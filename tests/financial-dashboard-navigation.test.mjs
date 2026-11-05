import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer as createHttpServer } from "node:http";
import { createSSRApp } from "vue";
import { renderToString } from "vue/server-renderer";
import { createMemoryHistory, createRouter } from "vue-router";
import { createServer } from "vite";
import vue from "@vitejs/plugin-vue";

let server;
let getFinancialDashboardNavigation;
let getActiveNavigationPath;
let resolveNavigationChild;
let navigationSchema;
let financeiroRoutes;
let FinancialDashboardNavigation;

before(async () => {
  // Compile real source modules and the Vue component without starting HTTP
  // or depending on the application's unrelated calendar errors.
  server = await createServer({
    configFile: false,
    plugins: [vue()],
    resolve: {
      alias: { "@": fileURLToPath(new URL("../src", import.meta.url)) },
    },
    server: { middlewareMode: true, watch: null, hmr: { server: createHttpServer() } },
    optimizeDeps: { noDiscovery: true, include: [] },
    logLevel: "error",
  });

  ({ getFinancialDashboardNavigation } = await server.ssrLoadModule(
    "/src/lib/financialDashboardNavigation.ts"
  ));
  ({ getActiveNavigationPath, resolveNavigationChild } = await server.ssrLoadModule(
    "/src/layouts/navigationMatching.ts"
  ));
  ({ navigationSchema } = await server.ssrLoadModule(
    "/src/layouts/navigation.schema.ts"
  ));
  ({ financeiroRoutes } = await server.ssrLoadModule(
    "/src/router/financeiro.routes.ts"
  ));
  ({ default: FinancialDashboardNavigation } = await server.ssrLoadModule(
    "/src/components/admin/FinancialDashboardNavigation.vue"
  ));
});

after(async () => {
  await server?.close();
});

const destinations = [
  "/", "/payments/dashboard", "/payments", "/charges", "/financial-alerts",
];

test("payment viewers can access the delivered dashboard", () => {
  const items = getFinancialDashboardNavigation((permission) =>
    permission === "payments.view"
  );
  assert.deepEqual(items.map((item) => item.key), ["payments"]);
  assert.equal(items[0].path, "/payments/dashboard");
});

test("users without payment view permission receive no payment link", () => {
  const items = getFinancialDashboardNavigation(() => false);
  assert.ok(items.every((item) => item.path === null));
  assert.ok(!items.some((item) => item.key === "payments"));
});

test("all delivered dashboards have real destinations", () => {
  const items = getFinancialDashboardNavigation(() => true);
  assert.equal(items.filter((item) => item.path !== null).length, 3);
  assert.deepEqual(items.filter((item) => item.path === null), []);
});

test("callers cannot mutate the shared navigation definitions", () => {
  getFinancialDashboardNavigation(() => true)[0].path = "/changed";
  assert.equal(getFinancialDashboardNavigation(() => true)[0].path, "/payments/dashboard");
});

test("Finance contains just one dashboards menu entry and preserves operational links", () => {
  const finance = navigationSchema.find((entry) => entry.kind === "group" && entry.key === "financeiro");
  assert.ok(finance);
  assert.deepEqual(finance.children.map((child) => child.label), [
    "Painéis", "Cobranças", "Pagamentos", "Inadimplentes",
  ]);
  const panels = finance.children.filter((child) => child.label === "Painéis");
  assert.equal(panels.length, 1);
  assert.equal(panels[0].permission, "payments.view");
  const route = financeiroRoutes.find((entry) => entry.path === panels[0].to);
  assert.equal(route?.name, "PaymentDashboard");
  assert.equal(route?.meta?.permission, panels[0].permission);
});

test("the existing payment dashboard URL and its permission are preserved", () => {
  const route = financeiroRoutes.find((entry) => entry.name === "PaymentDashboard");
  assert.equal(route?.path, "/payments/dashboard");
  assert.equal(route?.meta?.permission, "payments.view");
});

test("the dashboard selects Painéis rather than the payment management item", () => {
  assert.equal(getActiveNavigationPath("/payments/dashboard", destinations), "/payments/dashboard");
});

test("payment creation still selects the payment management item", () => {
  assert.equal(getActiveNavigationPath("/payments/create", destinations), "/payments");
});

test("nested records select the most specific visible destination", () => {
  assert.equal(getActiveNavigationPath("/charges/12/edit", destinations), "/charges");
  assert.equal(getActiveNavigationPath("/payments/dashboard/details", destinations), "/payments/dashboard");
});

test("path matching respects segment boundaries and the home page", () => {
  assert.equal(getActiveNavigationPath("/payments-other", destinations), null);
  assert.equal(getActiveNavigationPath("/", destinations), "/");
  assert.equal(getActiveNavigationPath("/unknown", destinations), null);
  assert.equal(getActiveNavigationPath("/payments", []), null);
});

async function renderNavigation(path, hasPermission) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/payments/dashboard", component: { render: () => null } },
      { path: "/charges", component: { render: () => null } },
      { path: "/charges/dashboard", component: { render: () => null } },
      { path: "/students/revenue-dashboard", component: { render: () => null } },
    ],
  });
  await router.push(path);
  await router.isReady();
  const app = createSSRApp(FinancialDashboardNavigation, {
    items: getFinancialDashboardNavigation(hasPermission),
  });
  app.use(router);
  return renderToString(app);
}

test("the real component renders the three delivered links without pending placeholders", async () => {
  const html = await renderNavigation("/payments/dashboard", () => true);
  assert.match(html, /aria-label="Painéis financeiros"/);
  assert.match(html, /aria-current="page"/);
  assert.match(html, /href="\/payments\/dashboard"/);
  assert.equal((html.match(/<a\b/g) ?? []).length, 3);
  assert.equal((html.match(/<button\b[^>]*\sdisabled(?:\s|>)/g) ?? []).length, 0);
  assert.equal((html.match(/Em breve/g) ?? []).length, 0);
});

test("charge-only viewers can enter Painéis without payment permission", async () => {
  const allowed = (permission) => permission === "charges.view";
  const items = getFinancialDashboardNavigation(allowed);
  assert.deepEqual(items.map((item) => item.key), ["due-dates"]);
  const group = navigationSchema.find((entry) => entry.key === "financeiro");
  const child = resolveNavigationChild(group.children[0], "/charges/dashboard", allowed);
  assert.equal(child.to, "/charges/dashboard");
  assert.equal(child.permission, "charges.view");
  assert.equal(getActiveNavigationPath("/charges/dashboard", [child.to, "/charges"]), child.to);
  const html = await renderNavigation("/charges/dashboard", allowed);
  assert.match(html, /href="\/charges\/dashboard"/);
  assert.doesNotMatch(html, /href="\/payments\/dashboard"/);
});

test("the shared menu item selects the current authorized panel and preserves other items", () => {
  const child = navigationSchema.find((entry) => entry.key === "financeiro").children[0];
  assert.equal(resolveNavigationChild(child, "/charges/dashboard", () => true).to, "/charges/dashboard");
  assert.equal(resolveNavigationChild(child, "/charges", () => true).to, "/payments/dashboard");
  assert.equal(resolveNavigationChild(child, "/charges/dashboard", (p) => p === "payments.view").to, "/payments/dashboard");
  assert.equal(resolveNavigationChild(child, "/", () => false), null);
  assert.deepEqual(resolveNavigationChild({ label: "Início", to: "/" }, "/", () => false), { label: "Início", to: "/", permission: undefined });
});

test("the due dashboard has its own lazy route and charge permission", () => {
  const route = financeiroRoutes.find((entry) => entry.name === "DueDashboard");
  assert.equal(route.path, "/charges/dashboard");
  assert.equal(route.meta.permission, "charges.view");
  assert.equal(typeof route.component, "function");
});

test("the real component does not render a payment link without its permission", async () => {
  const html = await renderNavigation("/charges", () => false);
  assert.doesNotMatch(html, /href="\/payments\/dashboard"/);
  assert.doesNotMatch(html, /aria-current="page"/);
});
