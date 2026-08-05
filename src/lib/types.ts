export type Paginated<T> = {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
};

export type ApiListResponse<TKey extends string, T> = {
  action: string;
  status: number;
  msg: string;
} & Record<TKey, Paginated<T>>;

export type ApiItemResponse<TKey extends string, T> = {
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
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
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

export type Student = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  birthdate?: string | null;
  status: string;
  start_date?: string | null;
  end_date?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type TeacherStatus = "active" | "inactive";

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
};

export type Plan = {
  id: number;
  name: string;
  workload: string;
  base_price: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
};

export type LeadRegistrationSource = "manual" | "webhook";

export type Lead = {
  id: number;
  name: string;
  whatsapp_phone: string;
  email?: string | null;
  source: string;
  objective: string;
  self_declared_level: string;
  registration_source: LeadRegistrationSource;
  raw_payload?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
};
