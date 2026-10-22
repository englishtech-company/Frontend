export function summaryFixture() {
  const balance = { charges_count: 0, principal_amount: "0.00", late_fee_amount: "0.00", interest_amount: "0.00", total_due_amount: "0.00" };
  return {
    generated_at: "2026-10-22T12:00:00+00:00", timezone: "America/Fortaleza", contract_reference_date: "2026-10-22",
    filters: { reference_date: "2026-10-22", plan_commitment: null, due_status: null }, scope: {}, windows: { due_soon_days: 3, renewal_days: 7 },
    debt_totals: { overdue: { ...balance, charges_count: 1, total_due_amount: "200.33" }, due_soon: { ...balance }, on_time: { ...balance } },
    students_with_debt_count: 1, overdue_students_count: 1,
    contract_totals: { contracts_count: 1, students_count: 1, mrr_amount: "270.00", contracted_volume_amount: "810.00" },
    contracts_by_plan: [{ plan_commitment: "quarterly", label: "Trimestral", contracts_count: 1, students_count: 1, mrr_amount: "270.00", contracted_volume_amount: "810.00" }],
    students_by_status: [{ status: "active", students_count: 1 }],
    contracts_by_payment_method: [{ payment_method: "pix", contracts_count: 1, percentage: "100.00" }],
    contracts_by_workload: [{ hours_per_week: 2, contracts_count: 1, percentage: "100.00" }], dominant_workloads: [2],
    upcoming_renewals_count: 1,
    data_quality: { operational_state_per_enrollment_available: false, paused_contracted_volume_amount: null, overlapping_schedules_ignored_count: 0, contract_eligibility: "known_cycles", warnings: ["Pausa e suspensão por matrícula ainda não são registradas."] },
  };
}
export function chargeFixture() {
  return { charge_id: 7, student_id: 1, student_name: "Ana <script>teste</script>", enrollment_id: 10,
    plan_name: "Plano trimestral", plan_commitment: "quarterly", due_date: "2026-10-12", due_status: "overdue", charge_status: "partial_overdue", expected_amount: "300.00", principal_amount: "200.00", late_fee_amount: "0.00", interest_amount: "0.33", total_due_amount: "200.33" };
}
export function renewalFixture() {
  return { student_id: 1, student_name: "Ana", enrollment_id: 10, plan_name: "Plano trimestral", plan_commitment: "quarterly", schedule_id: 3, student_status: "active", payment_method: "pix", hours_per_week: 2,
    renews_automatically: false, cycle_start_date: "2026-07-29", renewal_date: "2026-10-29", is_current: true, mrr_amount: "270.00", contracted_volume_amount: "810.00" };
}
export function recordsFixture(data = [], page = 1, lastPage = 1) {
  return { ...summaryFixture(), records: { data, current_page: page, per_page: 10, total: data.length, last_page: lastPage, from: data.length ? 1 : null, to: data.length || null, search: null } };
}
