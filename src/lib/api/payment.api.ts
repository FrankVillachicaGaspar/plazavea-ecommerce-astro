import type { ApiBase, SimpleApiBase } from "../../types/api-base.type";
import type { ICreatePayment, IPayment } from "../../types/payment.type";

const apiUrl = import.meta.env.PUBLIC_API_URL;

export const createPayment = async (payment: ICreatePayment) => {
  const response = await fetch(`${apiUrl}/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payment),
  });

  const result: SimpleApiBase = await response.json();

  return result.success ?? false;
};

export const getPayments = async (token: string) => {
  const response = await fetch(`${apiUrl}/payments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const result: ApiBase<IPayment[]> = await response.json();
  return result.data ?? [];
};
