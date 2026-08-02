import { api } from "@/lib/api";
import type {
  ApiItemResponse,
  ApiListResponse,
  Paginated,
  Plan,
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

export type PlanPayload = {
  name: string;
  workload: string;
  base_price: number;
  active: boolean;
};

export async function listPlans(
  params: ListPlansParams = {}
): Promise<Paginated<Plan>> {
  const query = new URLSearchParams({
    "pagination[page]": String(params.page ?? 1),
    "pagination[limit]": String(params.limit ?? 20),
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
