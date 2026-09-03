export type Paginated<T> = {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
};

export type ApiListResponse<
  TKey extends string,
  T
> = {
  action: string;
  status: number;
  msg: string;
} & Record<TKey, Paginated<T>>;

export type ApiItemResponse<
  TKey extends string,
  T
> = {
  action: string;
  status: number;
  msg: string;
} & Record<TKey, T>;

export type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
  roles?: Role[];
  relationships?: {
    roles?: Role[];
  };
};

export type Role = {
  id: number;
  name: string;
  guard_name: string;
  created_at?: string;
  updated_at?: string;
  relationships?: {
    permissions?: Permission[];
  };
};

export type Permission = {
  id: number;
  name: string;
  guard_name: string;
  created_at?: string;
  updated_at?: string;
};

export type AuditUser = {
  id: number;
  name: string;
  email: string;
};

export type AuditLog = {
  id: number;
  user_type: string | null;
  user_id: number | null;
  event: string;
  auditable_type: string;
  auditable_id: number;
  old_values: Record<
    string,
    unknown
  > | null;
  new_values: Record<
    string,
    unknown
  > | null;
  url: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at?: string;
  user?: AuditUser | null;
  relationships?: {
    user?: AuditUser | null;
  };
};

export type StudentTeacherAssignment = {
  id: number;
  student_id: number;
  teacher_id: number | null;
  created_at?: string;
  updated_at?: string;
  teacher?: Teacher | null;
  student?: Student;
};

export type StudentEnrollmentAssignment = {
  id: number;
  student_id: number;
  plan_variant_id: number | null;
  created_at?: string;
  updated_at?: string;
  plan_variant?: PlanVariant | null;
};

export type Student = {
  id: number;
  name: string;
  email: string;
  cpf?: string | null;
  phone?: string | null;
  address?: string | null;
  birthdate?: string | null;
  status: string;
  start_date?: string | null;
  end_date?: string | null;
  created_at?: string;
  updated_at?: string;
  current_teacher_assignment?:
    | StudentTeacherAssignment
    | null;
  current_enrollment_assignment?:
    | StudentEnrollmentAssignment
    | null;
  relationships?: {
    teacher_assignments?:
      StudentTeacherAssignment[];
    current_teacher?: Teacher | null;
    enrollment_assignments?:
      StudentEnrollmentAssignment[];
    current_plan_variant?:
      | PlanVariant
      | null;
    group_classes?: EnrolledGroupClass[];
  };
};

export type TeacherStatus =
  | "active"
  | "inactive";

export type Teacher = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  status: TeacherStatus;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  relationships?: {
    student_assignments?:
      StudentTeacherAssignment[];
    current_students?: Student[];
  };
};

export type PlanCommitment =
  | "monthly"
  | "quarterly"
  | "semiannual";

export type PlanVariant = {
  id?: number;
  plan_id?: number;
  plan_workload_id: number;
  monthly_price: string;
  active: boolean;
  plan_workload?: PlanWorkload;
  plan?: Plan;
  relationships?: {
    plan_workload?: PlanWorkload;
    plan?: Plan;
  };
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
};

export type PlanWorkload = {
  id: number;
  name: string;
  hours_per_week: number;
  sort_order: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
};

export type Plan = {
  id: number;
  name: string;
  commitment: PlanCommitment;
  duration_months: number;
  active: boolean;
  variants?: PlanVariant[];
  relationships?: {
    variants?: PlanVariant[];
  };
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
};

export type LeadRegistrationSource =
  | "manual"
  | "webhook";

export type Lead = {
  id: number;
  name: string;
  whatsapp_phone: string;
  email?: string | null;
  source: string;
  objective: string;
  self_declared_level: string;
  registration_source:
    LeadRegistrationSource;
  raw_payload?:
    | Record<string, unknown>
    | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
};

export type ExperimentalClass = {
  id: number;
  interested_id: number;
  teacher_id?: number | null;
  date_class: string;
  status_class: string;
  conversao: boolean;
  self_declared_level?:
    | string
    | null;
  evaluation_listening?:
    | string
    | null;
  evaluation_speaking?:
    | string
    | null;
  evaluation_vocabulary?:
    | string
    | null;
  evaluation_grammar?:
    | string
    | null;
  observations_feedback?:
    | string
    | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  interested?: Lead;
  teacher?: Teacher | null;
  relationships?: {
    interested?: Lead;
    teacher?: Teacher | null;
  };
};

export type EnrollmentStatus =
  | "pending"
  | "submitted"
  | "confirmed"
  | "cancelled";

export type EnrollmentPaymentMethod =
  | "pix"
  | "credit_card";

export type EnrollmentQuestionType =
  | "text"
  | "textarea"
  | "radio"
  | "checkbox"
  | "select"
  | "number"
  | "date";

export type EnrollmentQuestion = {
  id: number;
  label: string;
  help_text?: string | null;
  type: EnrollmentQuestionType;
  required: boolean;
  options?: string[] | null;
  sort_order: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  relationships?: Record<
    string,
    unknown
  >;
};

export type EnrollmentFormQuestion = {
  id: number;
  enrollment_id: number;
  enrollment_question_id?:
    | number
    | null;
  label: string;
  help_text?: string | null;
  type: EnrollmentQuestionType;
  required: boolean;
  options?: string[] | null;
  sort_order: number;
};

export type StudentExtra = {
  id: number;
  student_id: number;
  enrollment_id: number;
  answers: Record<
    string,
    string | string[]
  >;
};

export type Enrollment = {
  id: number;
  student_id?: number | null;
  plan_variant_id: number;
  discount_percent?:
    | string
    | number
    | null;
  payment_method:
    EnrollmentPaymentMethod;
  status: EnrollmentStatus;
  public_token: string;
  submitted_at?: string | null;
  confirmed_at?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  student?: Student | null;
  plan_variant?: PlanVariant | null;
  relationships?: {
    student?: Student | null;
    plan_variant?: PlanVariant | null;
    form_questions?:
      EnrollmentFormQuestion[];
    student_extra?: StudentExtra | null;
    public_url?: string;
  };
};

export type PublicEnrollment = {
  id: number;
  status: EnrollmentStatus;
  discount_percent?:
    | string
    | number
    | null;
  payment_method:
    EnrollmentPaymentMethod;
  plan_variant?: {
    id: number;
    monthly_price: string;
    plan?: {
      name: string;
      commitment: PlanCommitment;
      duration_months: number;
    } | null;
    plan_workload?: {
      name: string;
      hours_per_week: number;
    } | null;
  } | null;
  student?: {
    name: string;
    email: string;
    cpf?: string | null;
    phone?: string | null;
    address?: string | null;
    birthdate?: string | null;
  } | null;
  form_questions:
    EnrollmentFormQuestion[];
};

export type ChargeStatus =
  | "open"
  | "paid"
  | "partial"
  | "partial_overdue"
  | "overdue"
  | "cancelled";

export type ChargeScheduleStatus =
  | "active"
  | "completed"
  | "cancelled";

export type ChargeSchedule = {
  id: number;
  enrollment_id: number;
  plan_variant_id: number;
  contracted_monthly_price: string;
  discount_percent: string;
  installment_amount: string;
  duration_months: number;
  first_due_date: string;
  billing_day: number;
  renews_automatically: boolean;
  next_due_date?: string | null;
  status: ChargeScheduleStatus;
  cancelled_at?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  enrollment?: Enrollment | null;
  plan_variant?: PlanVariant | null;
};

export type Charge = {
  id: number;
  student_id: number;
  enrollment_id: number;
  charge_schedule_id?: number | null;
  expected_amount: string;
  due_date: string;
  status: ChargeStatus;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  student?: Student | null;
  enrollment?: Enrollment | null;
  charge_schedule?: ChargeSchedule | null;
  relationships?: {
    student?: Student | null;
    enrollment?: Enrollment | null;
    charge_schedule?: ChargeSchedule | null;
  };
};

export type Payment = {
  id: number;
  charge_id: number;
  amount: string;
  paid_at: string;
  receipt_url?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  charge?: Charge | null;
  relationships?: {
    charge?: Charge | null;
  };
};

export type FinancialAlertType =
  | "overdue_day_8"
  | "overdue_day_16";

export type FinancialAlertStatus =
  | "open"
  | "resolved";

export type FinancialAlert = {
  id: number;
  charge_id: number;
  type: FinancialAlertType;
  status: FinancialAlertStatus;
  triggered_on: string;
  resolved_at?: string | null;
  resolved_by?: number | null;
  resolution?: string | null;
  resolution_note?: string | null;
  created_at?: string;
  updated_at?: string;
  charge?: Charge | null;
  relationships?: {
    charge?: Charge | null;
    resolved_by?: User | null;
  };
};

export type GroupClassStatus = "active" | "inactive";

export type GroupClassStudent = Student & {
  pivot?: {
    status?: string;
    joined_at?: string | null;
    left_at?: string | null;
    notes?: string | null;
  };
};

export type GroupClass = {
  id: number;
  name: string;
  description?: string | null;
  teacher_id?: number | null;
  plan_id?: number | null;
  schedule?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  max_students?: number | null;
  students_count?: number;
  status: GroupClassStatus;
  level?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  teacher?: Teacher | null;
  plan?: Plan | null;
  students?: GroupClassStudent[];
  relationships?: {
    teacher?: Teacher | null;
    plan?: Plan | null;
    students?: GroupClassStudent[];
  };
};

export type EnrolledGroupClass = GroupClass & {
  pivot?: {
    status?: string;
    joined_at?: string | null;
    left_at?: string | null;
    notes?: string | null;
  };
};

export type StudentDocumentCategory =
  | "payment_receipt"
  | "contract"
  | "personal_document"
  | "address_proof"
  | "other";

export type StudentDocument = {
  id: number;
  student_id: number;
  payment_id?: number | null;
  category: StudentDocumentCategory;
  description?: string | null;
  original_name: string;
  mime_type: string;
  size: number;
  sha256: string;
  uploaded_by: number;
  deleted_by?: number | null;
  deletion_reason?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  student?: Student | null;
  payment?: Payment | null;
  uploader?: User | null;
  deleter?: User | null;
  relationships?: {
    student?: Student | null;
    payment?: Payment | null;
    uploaded_by?: User | null;
    deleted_by?: User | null;
  };
};
