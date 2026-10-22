import assert from "node:assert/strict";
import { after, afterEach, before, test } from "node:test";
import { createServer as createHttpServer } from "node:http";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import vue from "@vitejs/plugin-vue";
import { createRenderer, createSSRApp, nextTick, ref } from "vue";
import { renderToString } from "vue/server-renderer";
import { createMemoryHistory, createRouter } from "vue-router";
import { createPinia } from "pinia";
import { chargeFixture, recordsFixture, renewalFixture, summaryFixture } from "./fixtures/due-dashboard.mjs";

let server, client, format, useDueDashboard, Cards, Distributions, RecordsTable, View, useAuthStore;
const originals = { fetch: globalThis.fetch, document: globalThis.document, window: globalThis.window, localStorage: globalThis.localStorage };
const apps = [];
let calls = [];
const storage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
before(async () => {
  globalThis.localStorage = storage;
  server = await createServer({ configFile: false, plugins: [vue()],
    resolve: { alias: { "@": fileURLToPath(new URL("../src", import.meta.url)) } },
    server: { middlewareMode: true, watch: null, hmr: { server: createHttpServer() } },
    optimizeDeps: { noDiscovery: true, include: [] }, logLevel: "error" });
  client = await server.ssrLoadModule("/src/lib/dueDashboard.ts");
  format = await server.ssrLoadModule("/src/lib/dueDashboardFormat.ts");
  ({ useDueDashboard } = await server.ssrLoadModule("/src/composables/useDueDashboard.ts"));
  ({ useAuthStore } = await server.ssrLoadModule("/src/stores/auth.ts"));
  ({ default: Cards } = await server.ssrLoadModule("/src/components/admin/DueDashboardSummaryCards.vue"));
  ({ default: Distributions } = await server.ssrLoadModule("/src/components/admin/DueDashboardDistributions.vue"));
  ({ default: RecordsTable } = await server.ssrLoadModule("/src/components/admin/DueDashboardRecordsTable.vue"));
  ({ default: View } = await server.ssrLoadModule("/src/views/admin/charges/DueDashboard.vue"));
});
after(async () => { await server?.close(); Object.assign(globalThis, originals); });
afterEach(() => { apps.splice(0).forEach((app) => app.unmount()); globalThis.fetch = originals.fetch; calls = []; });
const flush = async () => { await new Promise((resolve) => setImmediate(resolve)); await nextTick(); };
function success(value) { return new Response(JSON.stringify({ dashboard: value }), { status: 200, headers: { "Content-Type": "application/json" } }); }
function fakeApi(handler) {
  globalThis.localStorage = storage;
  globalThis.fetch = async (url, options) => {
    calls.push({ url: new URL(url, "http://localhost"), options });
    if (handler) return handler(calls.at(-1));
    return success(url.includes("/summary") ? summaryFixture() : recordsFixture());
  };
}
function mount(enabled = ref(true), visible = true) {
  const document = new EventTarget();
  document.visibilityState = visible ? "visible" : "hidden";
  globalThis.document = document;
  globalThis.window = new EventTarget();
  const renderer = createRenderer({ createElement: () => ({}), createText: () => ({}), createComment: () => ({}),
    insert() {}, remove() {}, setText() {}, setElementText() {}, parentNode: () => null, nextSibling: () => null, patchProp() {} });
  let state;
  const app = renderer.createApp({ setup() { state = useDueDashboard({ enabled: () => enabled.value }); return () => null; } });
  app.mount({}); apps.push(app);
  return { state, document, app, enabled };
}

test("query parameters match the backend and summary ignores search/pagination", () => {
  const params = { referenceDate: "2026-10-30", planCommitment: "quarterly", dueStatus: "overdue", search: "  Ana & Silva  ", page: 2, limit: 25 };
  assert.deepEqual(Object.fromEntries(client.createDueDashboardQuery(params)), { reference_date: "2026-10-30", plan_commitment: "quarterly", due_status: "overdue" });
  const query = client.createDueDashboardQuery(params, true);
  assert.equal(query.get("search"), "Ana & Silva"); assert.equal(query.get("pagination[page]"), "2");
  assert.equal(query.get("pagination[limit]"), "25"); assert.equal(query.has("filter[search]"), false);
  assert.equal(client.createDueDashboardQuery({ referenceDate: null, planCommitment: null }).toString(), "");
});

test("all API functions use authenticated API client, correct paths and abort signal", async () => {
  fakeApi();
  const signal = new AbortController().signal;
  await client.getDueDashboardSummary({}, signal); await client.getDueDashboardRecords({}, signal); await client.getDueDashboardRenewals({}, signal);
  assert.deepEqual(calls.map((call) => call.url.pathname), ["/api/charges/dashboard/summary", "/api/charges/dashboard/records", "/api/charges/dashboard/renewals"]);
  assert.ok(calls.every((call) => call.options.signal === signal));
});

test("Fortaleza date uses local midnight rather than the browser or UTC day", () => {
  assert.equal(format.fortalezaToday(new Date("2026-10-23T02:59:59Z")), "2026-10-22");
  assert.equal(format.fortalezaToday(new Date("2026-10-23T03:00:00Z")), "2026-10-23");
  assert.match(format.formatDueTimestamp("2026-10-23T02:59:59Z"), /22\/10\/2026/);
  assert.equal(format.formatDueTimestamp("invalid"), "—");
});

test("visual helpers handle empty data, unknown metadata and invalid ratios", () => {
  assert.equal(format.visualPercentage("0", "0"), 0); assert.equal(format.visualPercentage("invalid"), 0);
  assert.equal(format.visualPercentage("200"), 100); assert.equal(format.visualPercentage("-10"), 0);
  assert.equal(format.workloadLabel(null), "Não informada"); assert.equal(format.paymentMethodLabel(null), "Não informado");
  assert.equal(format.studentStatusLabel("legacy-status"), "legacy-status");
});

test("initial load requests all three sections but not without permission", async () => {
  fakeApi();
  const { state, enabled } = mount(ref(false)); await flush(); assert.equal(calls.length, 0);
  enabled.value = true; await flush(); await flush();
  assert.equal(calls.length, 3); assert.equal(state.summary.data.value.contract_totals.mrr_amount, "270.00");
});

test("filter application resets both lists and sends the same scope to all sections", async () => {
  fakeApi(); const { state } = mount(); await flush();
  await state.applyFilters({ referenceDate: "2099-10-30", planCommitment: "semiannual", dueStatus: "overdue" });
  assert.equal(state.charges.page.value, 1); assert.equal(state.renewals.page.value, 1);
  assert.ok(calls.slice(-3).every((call) => call.url.searchParams.get("plan_commitment") === "semiannual" && call.url.searchParams.get("reference_date") === "2099-10-30"));
});

test("search is isolated to its list and does not recompute indicators or the other list", async () => {
  fakeApi(); const { state } = mount(); await flush();
  calls = []; await state.charges.applySearch(" Ana ");
  assert.equal(calls.length, 1); assert.equal(calls[0].url.pathname, "/api/charges/dashboard/records");
  assert.equal(calls[0].url.searchParams.get("search"), "Ana"); assert.equal(state.renewals.search.value, "");
  calls = []; await state.renewals.applySearch("Carlos");
  assert.equal(calls[0].url.pathname, "/api/charges/dashboard/renewals"); assert.equal(state.charges.search.value, "Ana");
});

test("out-of-order responses cannot restore stale filters", async () => {
  const pending = [];
  fakeApi((call) => new Promise((resolve) => pending.push({ call, resolve })));
  const { state } = mount(); assert.equal(pending.length, 3);
  const loading = state.applyFilters({ planCommitment: "semiannual" }); assert.equal(pending.length, 6);
  for (const request of pending.slice(3)) request.resolve(success(request.call.url.pathname.endsWith("summary") ? { ...summaryFixture(), marker: "new" } : recordsFixture()));
  await loading;
  for (const request of pending.slice(0, 3)) request.resolve(success({ ...summaryFixture(), marker: "old" }));
  await flush(); assert.equal(state.summary.data.value.marker, "new"); assert.ok(pending[0].call.options.signal.aborted);
});

test("network error retains last successful data while identifying the failed section", async () => {
  fakeApi(); const { state } = mount(); await flush();
  fakeApi(() => { throw new Error("Falha de conexão"); }); await state.refresh();
  assert.equal(state.summary.error.value, "Falha de conexão"); assert.ok(state.summary.data.value);
  assert.equal(state.charges.error.value, "Falha de conexão"); assert.equal(state.loading.value, false);
});

test("permission loss cancels requests and removes cached financial data", async () => {
  fakeApi(); const { state, enabled } = mount(); await flush();
  enabled.value = false; await flush(); assert.equal(state.summary.data.value, null); assert.equal(state.charges.data.value, null);
  const previousCalls = calls.length; await state.refresh(); assert.equal(calls.length, previousCalls);
});

test("server 403 removes all financial sections and stops automatic refresh until a retry", async () => {
  fakeApi(); const { state } = mount(); await flush();
  fakeApi(() => new Response(JSON.stringify({ message: "Sem permissão" }), { status: 403 }));
  await state.refresh(); assert.match(state.accessError.value, /acesso.*negado/i);
  assert.equal(state.summary.data.value, null); assert.equal(state.renewals.data.value, null);
  const before = calls.length; await state.refresh(); assert.equal(calls.length, before);
  fakeApi(); await state.retry(); assert.equal(state.accessError.value, ""); assert.ok(state.summary.data.value);
});

test("visibility pauses requests, returning refreshes all sections, and unmount removes listeners", async () => {
  fakeApi(); const { state, document, app } = mount(ref(true), false); await flush(); assert.equal(calls.length, 0);
  document.visibilityState = "visible"; document.dispatchEvent(new Event("visibilitychange")); await flush(); assert.equal(calls.length, 3);
  document.visibilityState = "hidden"; document.dispatchEvent(new Event("visibilitychange")); await state.refresh(); assert.equal(calls.length, 3);
  app.unmount(); apps.splice(apps.indexOf(app), 1);
  document.visibilityState = "visible"; document.dispatchEvent(new Event("visibilitychange")); await flush(); assert.equal(calls.length, 3);
});

test("polling runs every 30 seconds only while visible and cleans up its timer", async (context) => {
  context.mock.timers.enable({ apis: ["setInterval", "Date"], now: new Date("2026-10-22T12:00:00Z").getTime() });
  fakeApi(); const { document, app } = mount(); await flush(); assert.equal(calls.length, 3);
  context.mock.timers.tick(29_999); await flush(); assert.equal(calls.length, 3);
  context.mock.timers.tick(1); await flush(); assert.equal(calls.length, 6);
  document.visibilityState = "hidden"; document.dispatchEvent(new Event("visibilitychange"));
  context.mock.timers.tick(30_000); await flush(); assert.equal(calls.length, 6);
  app.unmount(); apps.splice(apps.indexOf(app), 1); context.mock.timers.tick(30_000); await flush(); assert.equal(calls.length, 6);
});

test("a fixed reference that becomes past returns to Today without projecting historical debt", async (context) => {
  context.mock.timers.enable({ apis: ["setInterval", "Date"], now: new Date("2026-10-23T02:59:50Z").getTime() });
  fakeApi(); const { state } = mount(); await flush(); await state.applyFilters({ referenceDate: "2026-10-22" });
  context.mock.timers.tick(30_000); await flush();
  assert.equal(state.filters.value.referenceDate, null); assert.match(state.referenceNotice.value, /voltou para Hoje/);
});

test("page correction after a record disappears fetches the new last page", async () => {
  fakeApi(); const { state } = mount(); await flush();
  state.charges.page.value = 5; calls = []; await state.charges.load();
  assert.equal(state.charges.page.value, 1); assert.equal(calls.length, 2);
  assert.equal(calls[1].url.searchParams.get("pagination[page]"), "1");
});

async function render(component, props, permissions = []) {
  const router = createRouter({ history: createMemoryHistory(), routes: [
    { path: "/charges/dashboard", component: { render: () => null } },
    { path: "/:pathMatch(.*)*", component: { render: () => null } },
  ] });
  await router.push("/charges/dashboard"); await router.isReady();
  const pinia = createPinia(); const app = createSSRApp(component, props); app.use(pinia); app.use(router);
  useAuthStore(pinia).user = { id: 1, name: "Teste", email: "test@example.com", permissions };
  return renderToString(app);
}

test("summary cards render API values rather than rebuilding business metrics", async () => {
  const html = await render(Cards, { summary: summaryFixture(), loading: false });
  assert.match(html, /270,00/); assert.match(html, /810,00/); assert.match(html, /200,33/);
  assert.match(html, /MRR dos contratos/); assert.match(html, /22\/10\/2026/);
});

test("distributions render empty state without inventing active, paused or payment data", async () => {
  const data = summaryFixture(); data.students_by_status = []; data.contracts_by_payment_method = []; data.contracts_by_workload = []; data.dominant_workloads = [];
  const html = await render(Distributions, { summary: data, loading: false });
  assert.match(html, /Nenhum ciclo vigente/); assert.match(html, /Sem base para calcular/); assert.doesNotMatch(html, /Pausado/);
});

test("unavailable distributions are not presented as an empty successful result", async () => {
  const html = await render(Distributions, { summary: null, loading: false });
  assert.match(html, /Distribuição indisponível/);
  assert.match(html, /Meios de pagamento indisponíveis/);
  assert.doesNotMatch(html, /Nenhum ciclo vigente/);
});

test("populated distributions render the existing chart component and actual contract metadata", async () => {
  const html = await render(Distributions, { summary: summaryFixture(), loading: false });
  assert.match(html, /<canvas/); assert.match(html, /Distribuição de alunos por status/);
  assert.match(html, /Ativo/); assert.match(html, /Pix/); assert.match(html, /2 h\/semana/);
  assert.match(html, /270,00/);
});

test("charge table escapes names, separates balances and links the existing charge detail", async () => {
  const html = await render(RecordsTable, { kind: "charges", result: recordsFixture([chargeFixture()]), search: "", loading: false, error: "", canViewEnrollments: false });
  assert.match(html, /href="\/charges\/7"/); assert.match(html, /12\/10\/2026/); assert.match(html, /Pagamento parcial/);
  assert.match(html, /&lt;script&gt;/); assert.doesNotMatch(html, /<script>/); assert.match(html, /200,33/);
});

test("renewal details require enrollment view permission and never offer an invented renew action", async () => {
  const props = { kind: "renewals", result: recordsFixture([renewalFixture()]), search: "", loading: false, error: "", canViewEnrollments: false };
  const denied = await render(RecordsTable, props); assert.doesNotMatch(denied, /href="\/enrollments/); assert.match(denied, /Somente consulta/);
  const allowed = await render(RecordsTable, { ...props, canViewEnrollments: true }); assert.match(allowed, /href="\/enrollments\/10"/);
  assert.match(allowed, /Conversar sobre renovação/); assert.doesNotMatch(allowed, />Renovar agora</);
});

test("real page gates data and actions by existing permissions", async () => {
  const denied = await render(View, {}); assert.match(denied, /não tem permissão/); assert.doesNotMatch(denied, /Gerenciar cobranças/);
  const allowed = await render(View, {}, ["charges.view"]); assert.match(allowed, /Gerenciar cobranças/); assert.doesNotMatch(allowed, /Novo aluno/);
  assert.match(allowed, /Contratos/i); assert.match(allowed, /30 s/);
  const canCreate = await render(View, {}, ["charges.view", "students.create"]); assert.match(canCreate, /href="\/students\/create"/);
});
