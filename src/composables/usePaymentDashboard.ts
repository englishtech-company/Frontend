import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import {
  getPaymentDashboardRecords,
  getPaymentDashboardSummary,
} from "@/lib/paymentDashboard";
import type {
  PaymentDashboardParams,
  PaymentDashboardRecords,
  PaymentDashboardSummary,
} from "@/lib/paymentDashboard";
import { DEFAULT_LIST_LIMIT } from "@/lib/pagination";

type PaymentDashboardOptions = {
  enabled?: () => boolean;
};

export function usePaymentDashboard(
  options: PaymentDashboardOptions = {}
) {
  const summary = ref<PaymentDashboardSummary | null>(null);
  const records = ref<PaymentDashboardRecords | null>(null);

  const filters = ref<PaymentDashboardParams>({
    year: null,
    month: null,
    planCommitment: null,
  });

  const search = ref("");
  const page = ref(1);

  const summaryLoading = ref(false);
  const recordsLoading = ref(false);

  const summaryError = ref("");
  const recordsError = ref("");

  const visible = ref(false);

  let mounted = false;
  let interval: ReturnType<typeof setInterval> | null = null;
  let summaryController: AbortController | null = null;
  let recordsController: AbortController | null = null;

  const enabled = computed(
    () => options.enabled?.() ?? true
  );

  const loading = computed(
    () => summaryLoading.value || recordsLoading.value
  );

  const lastSummaryUpdated = computed(
    () => summary.value?.generated_at ?? null
  );

  const lastRecordsUpdated = computed(
    () => records.value?.generated_at ?? null
  );

  const syncState = computed(() => {
    if (!enabled.value) {
      return "disabled";
    }

    if (!visible.value) {
      return "paused";
    }

    if (loading.value) {
      return "loading";
    }

    if (summaryError.value || recordsError.value) {
      return "error";
    }

    if (summary.value && records.value) {
      return "live";
    }

    return "idle";
  });

  function canLoad(): boolean {
    return mounted && enabled.value && visible.value;
  }

  function stopRequests(): void {
    summaryController?.abort();
    recordsController?.abort();

    summaryController = null;
    recordsController = null;

    summaryLoading.value = false;
    recordsLoading.value = false;
  }

  function clearData(): void {
    summary.value = null;
    records.value = null;

    summaryError.value = "";
    recordsError.value = "";
  }

  async function loadSummary(): Promise<void> {
    if (!canLoad()) {
      return;
    }

    summaryController?.abort();

    const controller = new AbortController();
    summaryController = controller;

    summaryLoading.value = true;
    summaryError.value = "";

    const params = { ...filters.value };

    try {
      const result = await getPaymentDashboardSummary(
        params,
        controller.signal
      );

      if (
        controller.signal.aborted ||
        summaryController !== controller ||
        !canLoad()
      ) {
        return;
      }

      summary.value = result;
    } catch (exception) {
      if (
        !controller.signal.aborted &&
        summaryController === controller &&
        canLoad()
      ) {
        summaryError.value =
          exception instanceof Error
            ? exception.message
            : "Não foi possível carregar os indicadores.";
      }
    } finally {
      if (summaryController === controller) {
        summaryController = null;
        summaryLoading.value = false;
      }
    }
  }

  async function loadRecords(): Promise<void> {
    if (!canLoad()) {
      return;
    }

    recordsController?.abort();

    const controller = new AbortController();
    recordsController = controller;

    recordsLoading.value = true;
    recordsError.value = "";

    const params = {
      ...filters.value,
      search: search.value,
      page: page.value,
      limit: DEFAULT_LIST_LIMIT,
    };

    try {
      const result = await getPaymentDashboardRecords(
        params,
        controller.signal
      );

      if (
        controller.signal.aborted ||
        recordsController !== controller ||
        !canLoad()
      ) {
        return;
      }

      if (page.value > result.records.last_page) {
        page.value = Math.max(1, result.records.last_page);

        await loadRecords();

        return;
      }

      records.value = result;
    } catch (exception) {
      if (
        !controller.signal.aborted &&
        recordsController === controller &&
        canLoad()
      ) {
        recordsError.value =
          exception instanceof Error
            ? exception.message
            : "Não foi possível carregar os pagamentos.";
      }
    } finally {
      if (recordsController === controller) {
        recordsController = null;
        recordsLoading.value = false;
      }
    }
  }

  async function refresh(): Promise<void> {
    if (!canLoad()) {
      return;
    }

    await Promise.all([
      loadSummary(),
      loadRecords(),
    ]);
  }

  async function applyFilters(
    nextFilters: PaymentDashboardParams
  ): Promise<void> {
    stopRequests();

    filters.value = {
      year: nextFilters.year ?? null,
      month: nextFilters.month ?? null,
      planCommitment: nextFilters.planCommitment ?? null,
    };

    page.value = 1;

    clearData();

    await refresh();
  }

  async function applySearch(value: string): Promise<void> {
    recordsController?.abort();
    recordsController = null;
    recordsLoading.value = false;

    search.value = value.trim();
    page.value = 1;
    records.value = null;
    recordsError.value = "";

    await loadRecords();
  }

  async function goToPage(nextPage: number): Promise<void> {
    if (
      !Number.isInteger(nextPage) ||
      nextPage < 1 ||
      nextPage === page.value ||
      (
        records.value &&
        nextPage > records.value.records.last_page
      )
    ) {
      return;
    }

    page.value = nextPage;
    records.value = null;

    await loadRecords();
  }

  function handleVisibilityChange(): void {
    visible.value = document.visibilityState === "visible";

    if (!visible.value) {
      stopRequests();

      return;
    }

    void refresh();
  }

  watch(enabled, (allowed) => {
    if (!mounted) {
      return;
    }

    if (!allowed) {
      stopRequests();
      clearData();

      return;
    }

    void refresh();
  });

  onMounted(() => {
    mounted = true;
    visible.value = document.visibilityState === "visible";

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    interval = setInterval(() => {
      if (canLoad() && !loading.value) {
        void refresh();
      }
    }, 30_000);

    void refresh();
  });

  onBeforeUnmount(() => {
    mounted = false;

    stopRequests();

    document.removeEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    if (interval !== null) {
      clearInterval(interval);
      interval = null;
    }
  });

  return {
    summary,
    records,
    filters,
    search,
    page,
    summaryLoading,
    recordsLoading,
    loading,
    summaryError,
    recordsError,
    lastSummaryUpdated,
    lastRecordsUpdated,
    syncState,
    refresh,
    applyFilters,
    applySearch,
    goToPage,
  };
}
