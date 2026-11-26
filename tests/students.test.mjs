import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer as createHttpServer } from "node:http";
import { createServer } from "vite";
import vue from "@vitejs/plugin-vue";

let server;
let isValidCpf;
let isValidPhone;
let getTodayDateFortaleza;
let maskCpf;
let maskPhone;
let listStudents;

before(async () => {
  // Configura mock de localStorage para testes em Node
  if (typeof globalThis.localStorage === "undefined") {
    const store = new Map();
    globalThis.localStorage = {
      getItem: (key) => store.get(key) ?? null,
      setItem: (key, val) => store.set(key, String(val)),
      removeItem: (key) => store.delete(key),
      clear: () => store.clear(),
    };
  }

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

  ({ isValidCpf, isValidPhone, getTodayDateFortaleza } = await server.ssrLoadModule(
    "/src/lib/br/validators.ts"
  ));
  ({ maskCpf, maskPhone } = await server.ssrLoadModule(
    "/src/lib/br/masks.ts"
  ));
  ({ listStudents } = await server.ssrLoadModule(
    "/src/lib/students.ts"
  ));
});

after(async () => {
  await server?.close();
});

test("isValidCpf valida dígitos verificadores e rejeita sequências repetidas", () => {
  // CPFs válidos conhecidos (módulo 11)
  assert.equal(isValidCpf("52998224725"), true);
  assert.equal(isValidCpf("529.982.247-25"), true);
  assert.equal(isValidCpf("83427771709"), true);
  assert.equal(isValidCpf("10433271779"), true);
  assert.equal(isValidCpf("71424784700"), true);
  assert.equal(isValidCpf("39209580710"), true);

  // CPFs inválidos: repetidos
  assert.equal(isValidCpf("00000000000"), false);
  assert.equal(isValidCpf("11111111111"), false);
  assert.equal(isValidCpf("99999999999"), false);

  // CPFs inválidos: dígitos verificadores errados
  assert.equal(isValidCpf("52998224720"), false);
  assert.equal(isValidCpf("12345678900"), false);

  // Valores vazios / curtos
  assert.equal(isValidCpf(""), false);
  assert.equal(isValidCpf(null), false);
  assert.equal(isValidCpf("123"), false);
});

test("isValidPhone valida DDD, comprimento e celular com 9", () => {
  // Telefones válidos
  assert.equal(isValidPhone("85991234567"), true);
  assert.equal(isValidPhone("(85) 99123-4567"), true);
  assert.equal(isValidPhone("+5585991234567"), true);
  assert.equal(isValidPhone("1133334444"), true); // fixo válido com 10 dígitos

  // Telefones inválidos
  assert.equal(isValidPhone("12345"), false); // curto
  assert.equal(isValidPhone("11111111111"), false); // repetido
  assert.equal(isValidPhone("20991234567"), false); // DDD 20 inexistente
  assert.equal(isValidPhone("05991234567"), false); // DDD 05 inexistente
  assert.equal(isValidPhone("85891234567"), false); // celular 11 dígitos começando com 8 em vez de 9

  // Nullable se vazio
  assert.equal(isValidPhone(""), true);
  assert.equal(isValidPhone(null), true);
});

test("getTodayDateFortaleza respeita o fuso America/Fortaleza sem desvio UTC", () => {
  const dateStr = getTodayDateFortaleza();
  assert.match(dateStr, /^\d{4}-\d{2}-\d{2}$/);

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Fortaleza",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const expected = formatter.format(new Date());
  assert.equal(dateStr, expected);
});

test("listStudents monta query correta para status e CPF", async () => {
  let requestedUrl = "";

  globalThis.fetch = async (url) => {
    requestedUrl = String(url);
    return {
      ok: true,
      status: 200,
      json: async () => ({
        action: "list",
        status: 200,
        msg: "success",
        request: [],
        students: {
          current_page: 1,
          data: [],
          last_page: 1,
          per_page: 20,
          total: 0,
        },
      }),
    };
  };

  // 1) Chamada padrão (sem status ou com status vazio) omite status na query (dispara omissão de inativos no backend)
  await listStudents({ page: 1 });
  assert.equal(requestedUrl.includes("status="), false);
  assert.equal(requestedUrl.includes("all="), false);

  // 2) Chamada com status explícito
  await listStudents({ page: 1, status: "inactive" });
  assert.equal(requestedUrl.includes("status=inactive"), true);

  // 3) Chamada com all=true
  await listStudents({ page: 1, all: true });
  assert.equal(requestedUrl.includes("all=true"), true);

  // 4) Chamada com busca por CPF
  await listStudents({ page: 1, cpf: "529.982.247-25" });
  assert.equal(requestedUrl.includes("cpf="), true);
});
