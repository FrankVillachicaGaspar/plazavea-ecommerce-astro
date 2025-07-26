import type { ApiBase } from "../../types/api-base.type";
import type { IBanner } from "../../types/banner.type";

const apiUrl = import.meta.env.PUBLIC_API_URL;

export const getPrincipalBanners = async () => {
  const response = await fetch(`${apiUrl}/banners/principal`);
  const result: ApiBase<IBanner[]> = await response.json();
  return result.data || [];
};

export const getOfertaBanners = async () => {
  const response = await fetch(`${apiUrl}/banners/ofertas`);
  const result: ApiBase<IBanner[]> = await response.json();
  return result.data || [];
};

export const getDescuentosBanners = async () => {
  const response = await fetch(`${apiUrl}/banners/descuentos`);
  const result: ApiBase<IBanner[]> = await response.json();
  return result.data || [];
};
