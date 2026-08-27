import { api } from "@/lib/api";
import type { AuthUser } from "@/stores/auth";

type ProfileResponse = {
  user: AuthUser;
};

export async function updateProfile(data: {
  name?: string;
  email?: string;
  password?: string;
}): Promise<AuthUser> {
  const response = await api<ProfileResponse>("/auth/profile", {
    method: "PUT",
    body: data,
  });
  return response.user;
}
