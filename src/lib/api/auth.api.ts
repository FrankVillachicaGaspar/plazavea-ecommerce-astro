import type { ApiBase } from "../../types/api-base.type";
import type { IProfile, LoginType } from "../../types/login-response.type";

const apiUrl = import.meta.env.PUBLIC_API_URL;

export const loginApi = async (email: string, password: string) => {
  console.log(apiUrl);
  const response = await fetch(`${apiUrl}/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
  const result: ApiBase<LoginType> = await response.json();

  return result.data!;
};

export const getProfile = async (token: string) => {
  const response = await fetch(`${apiUrl}/auth/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result: ApiBase<IProfile> = await response.json();

  return result.data!;
};
