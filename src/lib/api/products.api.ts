import type { ApiBase } from "../../types/api-base.type";
import type { IProduct, IProductSearchResult } from "../../types/product.type";

const apiUrl = import.meta.env.PUBLIC_API_URL;

export const getRecommendedProducts = async () => {
  const response = await fetch(`${apiUrl}/products/recommended/10`);
  const result: ApiBase<IProduct[]> = await response.json();
  return result.data || [];
};

export const searchProduct = async (searchText: string) => {
  const response = await fetch(`${apiUrl}/products?searchText=${searchText}`);
  const result: ApiBase<IProductSearchResult> = await response.json();
  return result.data!;
};

export const filterProduct = async (
  categoryId?: number,
  maxPrice?: number,
  orderBy?: number,
  searchText?: string,
  page: number = 1,
  limit?: number
) => {
  const params = new URLSearchParams();

  if (categoryId) params.append("categoryId", categoryId.toString());
  if (maxPrice) params.append("maxPrice", maxPrice.toString());
  if (orderBy) params.append("orderBy", orderBy.toString());
  if (searchText) params.append("searchText", searchText);
  if (limit) params.append("limit", limit.toString());

  params.append("page", page.toString());

  const response = await fetch(`${apiUrl}/products?${params.toString()}`);

  const result: ApiBase<IProductSearchResult> = await response.json();
  return result.data!;
};
