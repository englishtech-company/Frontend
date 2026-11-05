export function revenueStudent(attributes = {}) {
  return { student_id: 7, student_name: "Ana <script>", student_status: "active", archived: false,
    transactions_count: 2, ltv_amount: "500.30", principal_amount: "480.00", late_fee_amount: "15.00", interest_amount: "5.30",
    last_paid_at: "2026-10-22T02:59:59Z", mrr_amount: "270.00", active_contracts_count: 1, ...attributes };
}
export function revenueMetadata() {
  return { generated_at: "2026-10-22T12:00:00Z", timezone: "America/Fortaleza", contract_reference_date: "2026-10-22", scope: { search: "student_records_only" } };
}
export function revenueSummary() {
  return { ...revenueMetadata(),
    student_totals: { students_count: 3, active_students_count: 2, active_percentage: "66.67" },
    students_by_status: [{ status: "active", students_count: 2 }, { status: "inactive", students_count: 1 }],
    ltv_totals: { paying_students_count: 1, transactions_count: 2, revenue_amount: "500.30", principal_amount: "480.00", late_fee_amount: "15.00", interest_amount: "5.30", average_ltv_amount: "500.30" },
    contract_totals: { contracts_count: 1, students_count: 1, mrr_amount: "270.00", contracted_volume_amount: "810.00", average_monthly_contract_amount: "270.00" },
    packages: [{ duration_months: 3, plan_commitment: "quarterly", hours_per_week: 2, students_count: 1, contracts_count: 1, mrr_amount: "270.00", contracted_volume_amount: "810.00" }],
    top_students: [{ ...revenueStudent(), position: 1 }],
    enrollment_evolution: [{ period: "2026-08", new_students_count: 1 }, { period: "2026-09", new_students_count: 0 }, { period: "2026-10", new_students_count: 2 }],
    data_quality: { operational_state_per_enrollment_available: false, paused_contracted_volume_amount: null, overlapping_schedules_ignored_count: 0, students_without_confirmation_date_count: 0,
      warnings: ["Pausa e suspensão ainda não possuem representação completa."] },
  };
}
export function revenueRecords(rows = [revenueStudent()]) {
  return { ...revenueMetadata(), filters: { search: null }, records: { data: rows, current_page: 1, last_page: 1, per_page: 10, total: rows.length, from: rows.length ? 1 : null, to: rows.length || null } };
}
