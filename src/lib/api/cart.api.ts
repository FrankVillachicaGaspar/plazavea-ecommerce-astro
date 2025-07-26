import type { ApiBase, SimpleApiBase } from "../../types/api-base.type";
import type { ICart, ICartResume } from "../../types/cart.type";

const apiUrl = import.meta.env.PUBLIC_API_URL;

export const getCartCount = async (token: string) => {
  const response = await fetch(`${apiUrl}/cart/count`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result: ApiBase<number> = await response.json();

  return result.data!;
};

export const addCart = async (token: string, productId: number) => {
  const response = await fetch(`${apiUrl}/cart/add-item/${productId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const result: SimpleApiBase = await response.json();

  return result.success ?? false;
};

export const getCart = async (token: string) => {
  const response = await fetch(`${apiUrl}/cart`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const result: ApiBase<ICart[]> = await response.json();

  return result.data!;
};

export const getCartResume = async (token: string) => {
  const response = await fetch(`${apiUrl}/cart/resume`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const result: ApiBase<ICartResume> = await response.json();

  return result.data!;
};

export const decreaseCart = async (token: string, productId: number) => {
  const response = await fetch(`${apiUrl}/cart/decrease-item/${productId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const result: SimpleApiBase = await response.json();

  return result.success ?? false;
};

export const deleteCartProduct = async (token: string, productId: number) => {
  const response = await fetch(`${apiUrl}/cart/remove-item/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const result: SimpleApiBase = await response.json();

  return result.success ?? false;
};

export const clearCart = async (token: string) => {
  const response = await fetch(`${apiUrl}/cart/clear`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const result: SimpleApiBase = await response.json();

  return result.success ?? false;
};
