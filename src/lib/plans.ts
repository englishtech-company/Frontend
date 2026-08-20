import { api } from "@/lib/api";
import { DEFAULT_LIST_LIMIT } from "@/lib/pagination";
import type {
  ApiItemResponse,
  ApiListResponse,
  Paginated,
  Plan,
  PlanCommitment,
  PlanVariant,
} from "@/lib/types";

type ListPlansParams = {
  page?: number;
  limit?: number;
  search?: string;
  active?: boolean;
};

type PlanPlucksResponse = {
  action: string;
  status: number;
  msg: string;
  plucks: {
    plans: Record<string, string>;
  };
};

export type PlanVariantPayload = {
  plan_workload_id: number;
  monthly_price: number;
  active: boolean;
};

export type PlanPayload = {
  name: string;
  commitment: PlanCommitment;
  duration_months: number;
  active: boolean;
  variants: PlanVariantPayload[];
};

export async function listPlans(
  params: ListPlansParams = {}
): Promise<Paginated<Plan>> {
  const query = new URLSearchParams({
    "pagination[page]": String(params.page ?? 1),
    "pagination[limit]": String(params.limit ?? DEFAULT_LIST_LIMIT),
  });

  const search = params.search?.trim();

  if (search) {
    query.set("name", `%${search}%`);
  }

  if (params.active !== undefined) {
    query.set("active", params.active ? "1" : "0");
  }

  const response = await api<ApiListResponse<"plans", Plan>>(
    `/plans?${query.toString()}`
  );

  return response.plans;
}

export async function getPlan(id: number): Promise<Plan> {
  const response = await api<ApiItemResponse<"plan", Plan>>(
    `/plans/${id}`
  );

  return response.plan;
}

export async function createPlan(data: PlanPayload): Promise<Plan> {
  const response = await api<ApiItemResponse<"plan", Plan>>(
    "/plans/create",
    {
      method: "POST",
      body: data,
    }
  );

  return response.plan;
}

export async function updatePlan(
  id: number,
  data: Partial<PlanPayload>
): Promise<Plan> {
  const response = await api<ApiItemResponse<"plan", Plan>>(
    `/plans/${id}`,
    {
      method: "PUT",
      body: data,
    }
  );

  return response.plan;
}

export async function deletePlan(id: number): Promise<void> {
  await api(`/plans/${id}`, {
    method: "DELETE",
  });
}

export async function getPlanOptions(): Promise<Record<string, string>> {
  const response = await api<PlanPlucksResponse>("/plans/plucks");

  return response.plucks.plans;
}

export type { PlanVariant };
