export type ApiBase<T> = {
  success: boolean;
  data?: T;
  message: string;
};

export type SimpleApiBase = {
  success: boolean;
  message: string;
};
