import type { Charge, Payment } from "@/lib/types";
import { isDateWithinPeriod, type PeriodRange } from "@/lib/dashboard/period";

export type FinanceSnapshot = {
  receivedTotal: number;
  receivedCount: number;
  openCount: number;
  openTotal: number;
  overdueCount: number;
  overdueTotal: number;
  partialCount: number;
  partialOutstanding: number;
  totalOutstanding: number;
};

function sumExpectedAmount(charges: Charge[]): number {
  return charges.reduce(
    (acc, charge) => acc + (Number(charge.expected_amount) || 0),
    0
  );
}

function buildPaidByChargeMap(payments: Payment[]): Map<number, number> {
  const paidByCharge = new Map<number, number>();

  for (const payment of payments) {
    const amount = Number(payment.amount) || 0;
    paidByCharge.set(
      payment.charge_id,
      (paidByCharge.get(payment.charge_id) ?? 0) + amount
    );
  }

  return paidByCharge;
}

export function buildFinanceSnapshot(
  charges: Charge[],
  payments: Payment[],
  range: PeriodRange
): FinanceSnapshot {
  const paidByCharge = buildPaidByChargeMap(payments);

  const openCharges = charges.filter((charge) => charge.status === "open");
  const overdueCharges = charges.filter((charge) => charge.status === "overdue");
  const partialCharges = charges.filter((charge) => charge.status === "partial");

  const openTotal = sumExpectedAmount(openCharges);
  const overdueTotal = sumExpectedAmount(overdueCharges);

  const partialOutstanding = partialCharges.reduce((acc, charge) => {
    const paid = paidByCharge.get(charge.id) ?? 0;
    const expected = Number(charge.expected_amount) || 0;

    return acc + Math.max(0, expected - paid);
  }, 0);

  const paymentsInPeriod = range.start
    ? payments.filter((payment) => isDateWithinPeriod(payment.paid_at, range))
    : payments;

  const receivedTotal = paymentsInPeriod.reduce(
    (acc, payment) => acc + (Number(payment.amount) || 0),
    0
  );

  return {
    receivedTotal,
    receivedCount: paymentsInPeriod.length,
    openCount: openCharges.length,
    openTotal,
    overdueCount: overdueCharges.length,
    overdueTotal,
    partialCount: partialCharges.length,
    partialOutstanding,
    totalOutstanding: openTotal + overdueTotal + partialOutstanding,
  };
}
