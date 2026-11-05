import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue";
import { getDueDashboardRecords, getDueDashboardRenewals, getDueDashboardSummary } from "@/lib/dueDashboard";
import type { DueDashboardListParams, DueDashboardParams } from "@/lib/dueDashboard";
import { fortalezaToday } from "@/lib/dueDashboardFormat";
import { DEFAULT_LIST_LIMIT } from "@/lib/pagination";

export function useDueDashboard(options: { enabled: () => boolean }) {
  const filters = ref<DueDashboardParams>({ referenceDate: null, planCommitment: null, dueStatus: null });
  const enabled = computed(options.enabled);
  const visible = ref(false);
  const accessError = ref("");
  const referenceNotice = ref("");
  const today = ref(fortalezaToday());
  let mounted = false;
  let timer: ReturnType<typeof setInterval> | null = null;
  const canLoad = () => mounted && enabled.value && visible.value && !accessError.value;

  function resource<T>(loader: (params: DueDashboardListParams, signal?: AbortSignal) => Promise<T>) {
    const data = shallowRef<T | null>(null);
    const loading = ref(false);
    const error = ref("");
    let controller: AbortController | null = null;
    function stop() {
      controller?.abort();
      controller = null;
      loading.value = false;
    }
    function clear() { data.value = null; error.value = ""; }
    async function load(params: DueDashboardListParams, accept: (value: T) => Promise<boolean> = async () => true) {
      if (!canLoad()) return;
      stop();
      const request = new AbortController();
      controller = request;
      loading.value = true;
      error.value = "";
      try {
        const result = await loader(params, request.signal);
        if (request.signal.aborted || controller !== request || !canLoad()) return;
        if (await accept(result) && controller === request && !request.signal.aborted && canLoad()) data.value = result;
      } catch (exception) {
        if (request.signal.aborted || controller !== request || !canLoad()) return;
        const status = (exception as { status?: number } | null)?.status;
        if (status === 401 || status === 403) {
          stopAll();
          clearAll();
          accessError.value = status === 401 ? "Sua sessão expirou. Entre novamente para consultar o painel." : "O acesso ao painel foi negado. Verifique sua permissão de cobranças.";
        } else {
          error.value = exception instanceof Error ? exception.message : "Não foi possível atualizar esta seção.";
        }
      } finally {
        if (controller === request) { controller = null; loading.value = false; }
      }
    }
    return { data, loading, error, load, stop, clear };
  }

  const summary = resource(getDueDashboardSummary);
  function list<T extends { records: { last_page: number } }>(loader: (params: DueDashboardListParams, signal?: AbortSignal) => Promise<T>) {
    const state = resource(loader);
    const search = ref("");
    const page = ref(1);
    async function load() {
      await state.load({ ...filters.value, search: search.value, page: page.value, limit: DEFAULT_LIST_LIMIT }, async (result) => {
        if (page.value > result.records.last_page) {
          page.value = Math.max(1, result.records.last_page);
          await load();
          return false;
        }
        return true;
      });
    }
    async function applySearch(value: string) {
      state.stop(); state.clear();
      search.value = value.trim(); page.value = 1;
      await load();
    }
    async function goToPage(next: number) {
      if (!Number.isInteger(next) || next < 1 || next === page.value || (state.data.value && next > state.data.value.records.last_page)) return;
      state.stop(); state.clear(); page.value = next;
      await load();
    }
    return { ...state, search, page, load, applySearch, goToPage };
  }
  const charges = list(getDueDashboardRecords);
  const renewals = list(getDueDashboardRenewals);
  const loading = computed(() => summary.loading.value || charges.loading.value || renewals.loading.value);
  function stopAll() { summary.stop(); charges.stop(); renewals.stop(); }
  function clearAll() { summary.clear(); charges.clear(); renewals.clear(); }

  function updateToday() {
    today.value = fortalezaToday();
    if (filters.value.referenceDate && filters.value.referenceDate < today.value) {
      filters.value = { ...filters.value, referenceDate: null };
      charges.page.value = 1; renewals.page.value = 1;
      stopAll(); clearAll();
      referenceNotice.value = "A referência selecionada passou a ser uma data passada. O painel voltou para Hoje.";
    }
  }
  async function refresh() {
    updateToday();
    if (!canLoad()) return;
    await Promise.all([summary.load({ ...filters.value }), charges.load(), renewals.load()]);
  }
  async function retry() { accessError.value = ""; await refresh(); }
  async function applyFilters(next: DueDashboardParams) {
    stopAll(); clearAll();
    filters.value = { referenceDate: next.referenceDate ?? null, planCommitment: next.planCommitment ?? null, dueStatus: next.dueStatus ?? null };
    charges.page.value = 1; renewals.page.value = 1;
    referenceNotice.value = "";
    await refresh();
  }
  function visibilityChanged() {
    visible.value = document.visibilityState === "visible";
    if (!visible.value) stopAll();
    else void refresh();
  }
  function focused() { if (canLoad() && !loading.value) void refresh(); }
  watch(enabled, (allowed) => {
    if (!mounted) return;
    stopAll(); clearAll(); accessError.value = "";
    if (allowed) void refresh();
  });
  onMounted(() => {
    mounted = true;
    visible.value = document.visibilityState === "visible";
    document.addEventListener("visibilitychange", visibilityChanged);
    window.addEventListener("focus", focused);
    timer = setInterval(() => { if (canLoad() && !loading.value) void refresh(); }, 30_000);
    void refresh();
  });
  onBeforeUnmount(() => {
    mounted = false; stopAll();
    document.removeEventListener("visibilitychange", visibilityChanged);
    window.removeEventListener("focus", focused);
    if (timer !== null) clearInterval(timer);
  });
  return { summary, charges, renewals, filters, today, loading, accessError, referenceNotice, refresh, retry, applyFilters };
}
