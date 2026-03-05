import type { Context } from "elysia";

export interface IRoute {
  method: "get" | "post" | "put" | "delete" | "patch";
  path: string;
  controller: (ctx: Context) => Promise<any>;
  authorization?: boolean;
  authCheckType?: string[];
  body?: any;
  tags?: string[];
}

export interface IParams {
  limit?: number;
  page?: number;
  offset?: number;
  search?: string;
}

export interface IPagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize?: number; // optional: size per page
}

export interface IError {
  field?: string; // which field failed
  message: string;
}

export interface IResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: IError[]; // optional detailed errors
  pagination?: IPagination;
    meta?: {
    requestId?: string;
    timestamp?: string;
  };
}