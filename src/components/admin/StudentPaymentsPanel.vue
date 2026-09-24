<script lang="ts" setup>
import {
  computed,
  nextTick,
  onMounted,
  ref,
} from "vue";
import { RouterLink } from "vue-router";
import ProfileTabListCard from "@/components/admin/ProfileTabListCard.vue";
import StudentDocumentPreviewModal from "@/components/admin/StudentDocumentPreviewModal.vue";
import StudentPaymentDetailsModal from "@/components/admin/StudentPaymentDetailsModal.vue";
import { usePermissions } from "@/composables/usePermissions";
import {
  formatChargeStatus,
  formatCurrency,
  formatDate,
  formatDateTime,
  getPaymentCharge,
} from "@/lib/finance/format";
import {
  getPaymentReceipt,
  listPayments,
} from "@/lib/payments";
import type {
  PaymentWithReceipt,
} from "@/lib/payments";
import type {
  StudentDocument,
} from "@/lib/types";

const props = defineProps<{
  studentId: number;
}>();

const {
  canViewPayments,
  canCreatePayments,
  canUpdatePayments,
} = usePermissions();

const payments = ref<PaymentWithReceipt[]>([]);
const selectedPayment =
  ref<PaymentWithReceipt | null>(null);

const previewedReceipt =
  ref<StudentDocument | null>(null);

const loading = ref(true);
const error = ref("");

const page = ref(1);
const lastPage = ref(1);
const total = ref(0);

const showActions = computed(
  () =>
    canViewPayments.value ||
    canUpdatePayments.value
);

function getChargeStatus(
  payment: PaymentWithReceipt
) {
  const charge = getPaymentCharge(payment);

  return charge
    ? formatChargeStatus(charge.status)
    : null;
}

function openPaymentDetails(
  payment: PaymentWithReceipt
) {
  selectedPayment.value = payment;
}

function attachReceipt(
  payment: PaymentWithReceipt,
  receipt: StudentDocument
): PaymentWithReceipt {
  return {
    ...payment,
    receipt_document: receipt,
    relationships: {
      ...(payment.relationships ?? {}),
      receipt_document: receipt,
    },
  };
}

function detachReceipt(
  payment: PaymentWithReceipt
): PaymentWithReceipt {
  return {
    ...payment,
    receipt_document: null,
    relationships: {
      ...(payment.relationships ?? {}),
      receipt_document: null,
    },
  };
}

function handleReceiptUpdated(
  receipt: StudentDocument
) {
  if (!receipt.payment_id) {
    return;
  }

  payments.value = payments.value.map(
    (payment) =>
      payment.id === receipt.payment_id
        ? attachReceipt(payment, receipt)
        : payment
  );

  if (
    selectedPayment.value?.id ===
    receipt.payment_id
  ) {
    selectedPayment.value = attachReceipt(
      selectedPayment.value,
      receipt
    );
  }
}

function handleReceiptDeleted(
  paymentId: number
) {
  payments.value = payments.value.map(
    (payment) =>
      payment.id === paymentId
        ? detachReceipt(payment)
        : payment
  );

  if (
    selectedPayment.value?.id === paymentId
  ) {
    selectedPayment.value = detachReceipt(
      selectedPayment.value
    );
  }
}

async function openReceiptPreview(
  receipt: StudentDocument
) {
  selectedPayment.value = null;

  await nextTick();

  previewedReceipt.value = receipt;
}

async function loadPayments() {
  if (!canViewPayments.value) {
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const result = await listPayments({
      page: page.value,
      limit: 10,
      studentId: props.studentId,
    });

    payments.value = result.data;
    lastPage.value = result.last_page;
    total.value = result.total;
  } catch (exception) {
    error.value =
      exception instanceof Error
        ? exception.message
        : "Erro ao carregar o histórico de pagamentos.";
  } finally {
    loading.value = false;
  }
}

async function goToPage(nextPage: number) {
  if (
    nextPage < 1 ||
    nextPage > lastPage.value ||
    nextPage === page.value
  ) {
    return;
  }

  page.value = nextPage;

  await loadPayments();
}

onMounted(loadPayments);
</script>

<template>
  <div>
    <div
      v-if="!canViewPayments"
      class="alert alert-warning mt-3 mb-0"
    >
      Você não tem permissão para visualizar os pagamentos deste aluno.
    </div>

    <template v-else>
      <div v-if="error" class="alert alert-danger mt-3 mb-0">
        {{ error }}
      </div>

      <ProfileTabListCard
        title="Lista de pagamentos"
        :total="total"
        :loading="loading"
        :page="page"
        :last-page="lastPage"
        :read-only="!showActions"
        @update:page="goToPage"
      >
        <template #actions>
          <RouterLink
            v-if="canCreatePayments"
            to="/payments/create"
            class="btn btn-primary btn-sm"
          >
            <i class="la la-plus me-1"></i>
            Novo pagamento
          </RouterLink>
        </template>

        <thead>
          <tr>
            <th class="text-nowrap">Pagamento</th>
            <th class="text-nowrap">Cobrança</th>
            <th class="text-nowrap">Valor pago</th>
            <th class="text-nowrap">Data do pagamento</th>
            <th>Status da cobrança</th>
            <th>Comprovante</th>
            <th v-if="showActions" class="text-end text-nowrap">Ações</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="!payments.length">
            <td
              :colspan="showActions ? 7 : 6"
              class="text-center text-muted"
            >
              Nenhum pagamento foi registrado para este aluno.
            </td>
          </tr>

          <tr v-for="payment in payments" :key="payment.id">
            <td class="text-nowrap">
              <strong>#{{ payment.id }}</strong>
            </td>

            <td class="text-nowrap">
              <template v-if="getPaymentCharge(payment)">
                <strong>#{{ getPaymentCharge(payment)!.id }}</strong>
                <div class="small text-muted">
                  Vence em
                  {{ formatDate(getPaymentCharge(payment)!.due_date) }}
                </div>
              </template>
              <span v-else class="text-muted">Indisponível</span>
            </td>

            <td class="text-nowrap">
              <strong>{{ formatCurrency(payment.amount) }}</strong>
            </td>

            <td class="text-nowrap">
              {{ formatDateTime(payment.paid_at) }}
            </td>

            <td class="text-nowrap">
              <span
                v-if="getChargeStatus(payment)"
                class="badge"
                :class="getChargeStatus(payment)!.class"
              >
                {{ getChargeStatus(payment)!.label }}
              </span>
              <span v-else class="text-muted">—</span>
            </td>

            <td>
              <button
                v-if="getPaymentReceipt(payment)"
                type="button"
                class="btn btn-xs btn-outline-primary text-nowrap"
                @click="openReceiptPreview(getPaymentReceipt(payment)!)"
              >
                <i class="la la-eye me-1"></i>
                Visualizar
              </button>

              <a
                v-else-if="payment.receipt_url"
                :href="payment.receipt_url"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-xs btn-outline-primary"
              >
                Abrir
              </a>

              <span v-else class="text-muted small">Não informado</span>
            </td>

            <td v-if="showActions" class="text-end text-nowrap">
              <button
                type="button"
                class="btn btn-xs sharp btn-primary me-1"
                :aria-label="`Ver pagamento ${payment.id}`"
                @click="openPaymentDetails(payment)"
              >
                <i class="fa fa-eye"></i>
              </button>

              <RouterLink
                v-if="canUpdatePayments"
                :to="`/payments/${payment.id}/edit`"
                class="btn btn-xs sharp btn-primary"
                :aria-label="`Editar pagamento ${payment.id}`"
              >
                <i class="fa fa-pencil"></i>
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </ProfileTabListCard>
    </template>

    <StudentPaymentDetailsModal
      :payment="selectedPayment"
      @close="selectedPayment = null"
      @receipt-updated="handleReceiptUpdated"
      @receipt-deleted="handleReceiptDeleted"
      @preview-receipt="openReceiptPreview"
    />

    <StudentDocumentPreviewModal
      :document="previewedReceipt"
      @close="previewedReceipt = null"
    />
  </div>
</template>
