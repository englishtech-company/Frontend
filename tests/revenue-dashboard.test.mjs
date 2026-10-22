import assert from "node:assert/strict";
import { after, afterEach, before, test } from "node:test";
import { createServer as createHttpServer } from "node:http";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { createServer } from "vite";
import vue from "@vitejs/plugin-vue";
import { createRenderer, createSSRApp, nextTick, ref } from "vue";
import { renderToString } from "vue/server-renderer";
import { createMemoryHistory, createRouter } from "vue-router";
import { createPinia } from "pinia";
import { revenueRecords, revenueStudent, revenueSummary } from "./fixtures/revenue-dashboard.mjs";

let server, client, access, navigation, matching, schema, routes, format, useRevenueDashboard, useAuthStore, Cards, Charts, Highlights, Table, View;
const permissions = ["students.view", "payments.view", "charges.view", "enrollments.view"];
const originals = { fetch: globalThis.fetch, document: globalThis.document, window: globalThis.window, localStorage: globalThis.localStorage };
const apps = [];
let calls = [];
const storage = { getItem: () => null, setItem() {}, removeItem() {} };
before(async () => {
  globalThis.localStorage = storage;
  server = await createServer({ configFile: false, plugins: [vue()], resolve: { alias: { "@": fileURLToPath(new URL("../src", import.meta.url)) } },
    server: { middlewareMode: true, watch: null, hmr: { server: createHttpServer() } }, optimizeDeps: { noDiscovery: true, include: [] }, logLevel: "error" });
  client = await server.ssrLoadModule("/src/lib/revenueDashboard.ts");
  access = await server.ssrLoadModule("/src/lib/permissions/access.ts");
  navigation = await server.ssrLoadModule("/src/lib/financialDashboardNavigation.ts");
  matching = await server.ssrLoadModule("/src/layouts/navigationMatching.ts");
  ({ navigationSchema: schema } = await server.ssrLoadModule("/src/layouts/navigation.schema.ts"));
  ({ financeiroRoutes: routes } = await server.ssrLoadModule("/src/router/financeiro.routes.ts"));
  format = await server.ssrLoadModule("/src/lib/revenueDashboardFormat.ts");
  ({ useRevenueDashboard } = await server.ssrLoadModule("/src/composables/useRevenueDashboard.ts"));
  ({ useAuthStore } = await server.ssrLoadModule("/src/stores/auth.ts"));
  for (const [name, path] of [["Cards", "RevenueDashboardSummaryCards"], ["Charts", "RevenueDashboardCharts"], ["Highlights", "RevenueDashboardHighlights"], ["Table", "RevenueDashboardStudentsTable"]]) {
    const module = await server.ssrLoadModule(`/src/components/admin/${path}.vue`);
    if (name === "Cards") Cards = module.default;
    if (name === "Charts") Charts = module.default;
    if (name === "Highlights") Highlights = module.default;
    if (name === "Table") Table = module.default;
  }
  ({ default: View } = await server.ssrLoadModule("/src/views/admin/students/RevenueDashboard.vue"));
});
after(async () => { await server?.close(); Object.assign(globalThis, originals); });
afterEach(() => { apps.splice(0).forEach((app) => app.unmount()); globalThis.fetch = originals.fetch; calls = []; });
const flush = async () => { await new Promise((resolve) => setImmediate(resolve)); await nextTick(); };
const success = (value) => new Response(JSON.stringify({ dashboard: value }), { status: 200, headers: { "Content-Type": "application/json" } });
function fakeApi(handler) {
  globalThis.localStorage = storage;
  globalThis.fetch = async (url, options) => {
    calls.push({ url: new URL(url, "http://localhost"), options });
    return handler ? handler(calls.at(-1)) : success(url.includes("/summary") ? revenueSummary() : revenueRecords());
  };
}
function mount(enabled = ref(true), visible = true) {
  const document = new EventTarget(); document.visibilityState = visible ? "visible" : "hidden";
  globalThis.document = document; globalThis.window = new EventTarget();
  const renderer = createRenderer({ createElement: () => ({}), createText: () => ({}), createComment: () => ({}), insert() {}, remove() {}, setText() {}, setElementText() {}, parentNode: () => null, nextSibling: () => null, patchProp() {} });
  let state;
  const app = renderer.createApp({ setup() { state = useRevenueDashboard({ enabled: () => enabled.value }); return () => null; } });
  app.mount({}); apps.push(app);
  return { app, state, document, enabled };
}
async function render(component, props, allowed = permissions) {
  const router = createRouter({ history: createMemoryHistory(), routes: [{ path: "/:pathMatch(.*)*", component: { render: () => null } }] });
  await router.push("/students/revenue-dashboard"); await router.isReady();
  const pinia = createPinia(); const app = createSSRApp(component, props); app.use(pinia); app.use(router);
  useAuthStore(pinia).user = { id: 1, name: "Teste", email: "test@example.invalid", permissions: allowed };
  return renderToString(app);
}

test("client sends only supported root search and pagination parameters", () => {
  assert.deepEqual(Object.fromEntries(client.createRevenueDashboardQuery({ search: " Ana & Silva ", page: 2, limit: 25 })), { "pagination[page]": "2", "pagination[limit]": "25", search: "Ana & Silva" });
  assert.equal(client.createRevenueDashboardQuery({ search: " " }).has("search"), false);
});
test("client uses the authenticated API, correct endpoints and abort signals", async () => {
  fakeApi(); const signal = new AbortController().signal;
  await client.getRevenueDashboardSummary(signal); await client.getRevenueDashboardRecords({}, signal);
  assert.deepEqual(calls.map((call) => call.url.pathname), ["/api/students/revenue-dashboard/summary", "/api/students/revenue-dashboard/records"]);
  assert.ok(calls.every((call) => call.options.signal === signal)); assert.equal(calls[0].url.search, "");
});
test("revenue requires all four permissions in paths, route metadata and navigation", () => {
  for (const missing of permissions) {
    const allowed = (permission) => permissions.includes(permission) && permission !== missing;
    assert.equal(access.canViewRevenueDashboard(allowed), false);
    assert.equal(access.canAccessPath("/students/revenue-dashboard", allowed), false);
    assert.ok(!navigation.getFinancialDashboardNavigation(allowed).some((item) => item.key === "revenue"));
  }
  const route = routes.find((row) => row.name === "RevenueDashboard");
  assert.deepEqual([...route.meta.permissions].sort(), [...permissions].sort());
  assert.equal(route.path, "/students/revenue-dashboard"); assert.equal(typeof route.component, "function");
  assert.ok(access.canAccessPath(route.path, () => true));
  const guard = readFileSync(new URL("../src/router/index.ts", import.meta.url), "utf8");
  assert.match(guard, /to\.meta\.permissions\?\.some/);
});
test("Finance still has one Painéis entry and selects the revenue destination", () => {
  const group = schema.find((row) => row.key === "financeiro");
  assert.equal(group.children.filter((row) => row.label === "Painéis").length, 1);
  const child = matching.resolveNavigationChild(group.children[0], "/students/revenue-dashboard", () => true);
  assert.equal(child.to, "/students/revenue-dashboard");
  const partial = matching.resolveNavigationChild(group.children[0], "/students/revenue-dashboard", (p) => p === "payments.view");
  assert.equal(partial.to, "/payments/dashboard");
});
test("navigation callers cannot mutate nested revenue permission definitions", () => {
  const item = navigation.getFinancialDashboardNavigation(() => true).find((row) => row.key === "revenue");
  item.requiredPermissions.length = 0;
  assert.equal(navigation.getFinancialDashboardNavigation(() => true).find((row) => row.key === "revenue").requiredPermissions.length, 4);
});
test("initial load is gated by permission and loads both resources when granted", async () => {
  fakeApi(); const { state, enabled } = mount(ref(false)); await flush(); assert.equal(calls.length, 0);
  enabled.value = true; await flush(); await flush(); assert.equal(calls.length, 2); assert.equal(state.summary.data.value.ltv_totals.revenue_amount, "500.30");
});
test("search and clear affect only records, reset pagination and retain summary", async () => {
  fakeApi(); const { state } = mount(); await flush(); const summary = state.summary.data.value;
  calls = []; await state.applySearch(" Ana "); assert.equal(calls.length, 1); assert.equal(calls[0].url.searchParams.get("search"), "Ana"); assert.equal(state.page.value, 1);
  assert.equal(state.summary.data.value, summary);
  calls = []; await state.applySearch(""); assert.equal(calls.length, 1); assert.equal(calls[0].url.searchParams.has("search"), false);
});
test("stale responses cannot replace a newer search", async () => {
  let resolveOld;
  fakeApi(({ url }) => url.searchParams.get("search") === "old" ? new Promise((resolve) => { resolveOld = resolve; }) : success(url.pathname.endsWith("summary") ? revenueSummary() : revenueRecords()));
  const { state } = mount(); await flush();
  const old = state.applySearch("old"); await flush(); await state.applySearch("new");
  resolveOld(success(revenueRecords([revenueStudent({ student_name: "Old" })]))); await old;
  assert.equal(state.search.value, "new"); assert.notEqual(state.records.data.value.records.data[0].student_name, "Old");
});
test("network failures retain last successful data and identify the failed section", async () => {
  fakeApi(); const { state } = mount(); await flush(); const before = state.summary.data.value;
  fakeApi(({ url }) => { if (url.pathname.endsWith("summary")) throw new Error("Rede indisponível"); return success(revenueRecords()); });
  await state.refresh(); assert.equal(state.summary.data.value, before); assert.match(state.summary.error.value, /Rede/); assert.equal(state.records.error.value, "");
});
test("permission loss clears cached data and prevents late responses", async () => {
  fakeApi(); const { state, enabled } = mount(); await flush(); enabled.value = false; await flush();
  assert.equal(state.summary.data.value, null); assert.equal(state.records.data.value, null);
  const count = calls.length; await state.refresh(); assert.equal(calls.length, count);
});
test("403 clears all resources, stops refreshes and allows explicit retry", async () => {
  fakeApi(); const { state } = mount(); await flush(); fakeApi(() => new Response("{}", { status: 403 })); await state.refresh();
  assert.equal(state.summary.data.value, null); assert.equal(state.records.data.value, null); assert.match(state.accessError.value, /acesso.*negado/i);
  const count = calls.length; await state.refresh(); assert.equal(calls.length, count);
  fakeApi(); await state.retry(); assert.equal(state.accessError.value, ""); assert.ok(state.summary.data.value);
});
test("401 clears financial data and displays a session message", async () => {
  fakeApi(() => new Response("{}", { status: 401 })); const { state } = mount(); await flush();
  assert.match(state.accessError.value, /sessão expirou/); assert.equal(state.records.data.value, null);
});
test("visibility pauses fetching and focus return refreshes without overlapping pending requests", async () => {
  fakeApi(); const { document, state } = mount(ref(true), false); await flush(); assert.equal(calls.length, 0);
  document.visibilityState = "visible"; document.dispatchEvent(new Event("visibilitychange")); await flush(); assert.equal(calls.length, 2);
  globalThis.window.dispatchEvent(new Event("focus")); await flush(); assert.equal(calls.length, 4);
  document.visibilityState = "hidden"; document.dispatchEvent(new Event("visibilitychange")); await state.refresh(); assert.equal(calls.length, 4);
});
test("30 second polling is visibility aware and unmount cleans up listeners and timer", async (context) => {
  context.mock.timers.enable({ apis: ["setInterval", "Date"], now: new Date("2026-10-22T12:00:00Z").getTime() });
  fakeApi(); const { document, app } = mount(); await flush(); assert.equal(calls.length, 2);
  context.mock.timers.tick(30_000); await flush(); assert.equal(calls.length, 4);
  document.visibilityState = "hidden"; document.dispatchEvent(new Event("visibilitychange")); context.mock.timers.tick(30_000); await flush(); assert.equal(calls.length, 4);
  app.unmount(); apps.splice(apps.indexOf(app), 1); document.visibilityState = "visible"; document.dispatchEvent(new Event("visibilitychange")); globalThis.window.dispatchEvent(new Event("focus")); context.mock.timers.tick(30_000); await flush(); assert.equal(calls.length, 4);
});
test("disappearing records correct pagination to the new last page", async () => {
  fakeApi(); const { state } = mount(); await flush(); state.page.value = 4; calls = [];
  await state.loadRecords(); assert.equal(state.page.value, 1); assert.equal(calls.length, 2);
});
test("invalid pages are ignored and valid pages fetch only records", async () => {
  fakeApi(({ url }) => { const data = revenueRecords(); data.records.last_page = 3; return success(url.pathname.endsWith("summary") ? revenueSummary() : data); });
  const { state } = mount(); await flush(); calls = [];
  await state.goToPage(0); await state.goToPage(1.5); await state.goToPage(4); assert.equal(calls.length, 0);
  await state.goToPage(2); assert.equal(calls.length, 1); assert.equal(calls[0].url.searchParams.get("pagination[page]"), "2");
});
test("formatters preserve absent values and unknown metadata without inventing numbers", () => {
  assert.equal(format.revenueMoney(null), "—"); assert.equal(format.revenuePercentage(null), "—");
  assert.equal(format.revenuePercentage("66.67"), "66,67%"); assert.equal(format.enrollmentMonth("bad"), "bad");
  assert.match(format.packageLabel({ hours_per_week: null, plan_commitment: "other" }), /Não informada.*Outros/);
});
test("cards render distinct roster, MRR, historical LTV and allocation values", async () => {
  const html = await render(Cards, { summary: revenueSummary(), loading: false });
  assert.match(html, /66,67%/); assert.match(html, /500,30/); assert.match(html, /270,00/); assert.match(html, /480,00/); assert.match(html, /LTV total recebido/);
  const unavailable = await render(Cards, { summary: null, loading: false }); assert.doesNotMatch(unavailable, /R\$.*0,00/);
});
test("charts render actual series, accessible values and registered statuses only", async () => {
  const html = await render(Charts, { summary: revenueSummary(), loading: false });
  assert.match(html, /<canvas/); assert.match(html, /Consultar valores do gráfico/); assert.match(html, /Inativo/); assert.doesNotMatch(html, /Pausado/);
  const data = revenueSummary(); data.students_by_status = []; data.enrollment_evolution = [];
  const empty = await render(Charts, { summary: data, loading: false }); assert.match(empty, /Sem confirmações datadas/); assert.match(empty, /Nenhum aluno na base atual/);
  const unavailable = await render(Charts, { summary: null, loading: false }); assert.match(unavailable, /indisponível/); assert.doesNotMatch(unavailable, /Nenhum aluno/);
});
test("highlights distinguish historical LTV from package MRR and avoid archived detail links", async () => {
  const data = revenueSummary(); data.top_students[0].archived = true;
  const html = await render(Highlights, { summary: data, loading: false, canViewStudents: true });
  assert.match(html, /MRR atual/); assert.match(html, /Arquivado/); assert.match(html, /2 h\/semana/); assert.match(html, /Trimestral/);
  assert.doesNotMatch(html, /href="\/students\/7"/); assert.match(html, /&lt;script&gt;/); assert.doesNotMatch(html, /<script>/);
});
test("student table separates cash components, local search and current MRR without private fields", async () => {
  const props = { result: revenueRecords(), loading: false, error: "", search: "", canViewStudents: true };
  const html = await render(Table, props); assert.match(html, /href="\/students\/7"/); assert.match(html, /21\/10\/2026/); assert.match(html, /480,00/); assert.match(html, /MRR atual/); assert.match(html, /somente esta lista/);
  const archived = await render(Table, { ...props, result: revenueRecords([revenueStudent({ archived: true })]) }); assert.doesNotMatch(archived, /href="\/students\/7"/);
});
test("real page gates data and creation actions with the existing permissions", async () => {
  const denied = await render(View, {}, ["students.view"]); assert.match(denied, /não tem todas as permissões/); assert.doesNotMatch(denied, /Gerenciar alunos/);
  const allowed = await render(View, {}); assert.match(allowed, /Gerenciar alunos/); assert.doesNotMatch(allowed, /Novo aluno/); assert.match(allowed, /30 s/);
  const create = await render(View, {}, [...permissions, "students.create"]); assert.match(create, /href="\/students\/create"/);
});
