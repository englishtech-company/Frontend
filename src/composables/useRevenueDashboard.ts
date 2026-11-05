import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue";
import { getRevenueDashboardRecords, getRevenueDashboardSummary } from "@/lib/revenueDashboard";
import type { RevenueDashboardListParams, RevenueDashboardRecords } from "@/lib/revenueDashboard";
import { DEFAULT_LIST_LIMIT } from "@/lib/pagination";

export function useRevenueDashboard(options: { enabled: () => boolean }) {
  const enabled = computed(options.enabled);
  const accessError = ref("");
  const search = ref("");
  const page = ref(1);
  let mounted = false;
  let visible = false;
  let timer: ReturnType<typeof setInterval> | null = null;
  const canLoad = () => mounted && visible && enabled.value && !accessError.value;

  function resource<T>(loader: (signal: AbortSignal) => Promise<T>) {
    const data = shallowRef<T | null>(null);
    const loading = ref(false);
    const error = ref("");
    let controller: AbortController | null = null;
    function stop() { controller?.abort(); controller = null; loading.value = false; }
    function clear() { data.value = null; error.value = ""; }
    async function load(accept: (value: T) => Promise<boolean> = async () => true) {
      if (!canLoad()) return;
      stop();
      const request = new AbortController();
      controller = request; loading.value = true; error.value = "";
      try {
        const result = await loader(request.signal);
        if (request.signal.aborted || request !== controller || !canLoad()) return;
        if (await accept(result) && request === controller && !request.signal.aborted && canLoad()) data.value = result;
      } catch (exception) {
        if (request.signal.aborted || request !== controller || !canLoad()) return;
        const status = (exception as { status?: number } | null)?.status;
        if (status === 401 || status === 403) {
          stopAll(); clearAll();
          accessError.value = status === 401 ? "Sua sessão expirou. Entre novamente para consultar o painel." : "O acesso ao painel foi negado. Confira suas permissões financeiras e de alunos.";
        } else {
          error.value = exception instanceof Error ? exception.message : "Não foi possível atualizar esta seção.";
        }
      } finally {
        if (request === controller) { controller = null; loading.value = false; }
      }
    }
    return { data, loading, error, load, stop, clear };
  }

  const summary = resource(getRevenueDashboardSummary);
  const records = resource<RevenueDashboardRecords>((signal) => {
    const params: RevenueDashboardListParams = { search: search.value, page: page.value, limit: DEFAULT_LIST_LIMIT };
    return getRevenueDashboardRecords(params, signal);
  });
  const loading = computed(() => summary.loading.value || records.loading.value);
  function stopAll() { summary.stop(); records.stop(); }
  function clearAll() { summary.clear(); records.clear(); }
  async function loadRecords() {
    await records.load(async (result) => {
      if (page.value > result.records.last_page) {
        page.value = Math.max(1, result.records.last_page);
        await loadRecords();
        return false;
      }
      return true;
    });
  }
  async function applySearch(value: string) {
    records.stop(); records.clear(); search.value = value.trim(); page.value = 1;
    await loadRecords();
  }
  async function goToPage(next: number) {
    if (!Number.isInteger(next) || next < 1 || next === page.value || (records.data.value && next > records.data.value.records.last_page)) return;
    records.stop(); records.clear(); page.value = next;
    await loadRecords();
  }
  async function refresh() {
    if (canLoad()) await Promise.all([summary.load(), loadRecords()]);
  }
  async function retry() { accessError.value = ""; await refresh(); }
  function visibilityChanged() {
    visible = document.visibilityState === "visible";
    if (!visible) stopAll();
    else void refresh();
  }
  function focused() { if (canLoad() && !loading.value) void refresh(); }
  watch(enabled, (allowed) => {
    if (!mounted) return;
    stopAll(); clearAll(); accessError.value = "";
    if (allowed) void refresh();
  });
  onMounted(() => {
    mounted = true; visible = document.visibilityState === "visible";
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
  return { summary, records, search, page, loading, accessError, refresh, retry, applySearch, goToPage, loadRecords };
}
