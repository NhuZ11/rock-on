import type { IResponse } from "@/interface";
import jwt, { type SignOptions } from "jsonwebtoken";
import env from "@/config/env";
import bcrypt, { genSalt } from "bcrypt";

export const sendResponse = <T>(
  set: { status?: number | string },
  statusCode: number,
  payload: IResponse<T>
) => {
  set.status = statusCode;
  return payload;
};

export const getPagination = (query: any) => {
  const page = Math.max(+(query.page || 1), 1);
  const limit = Math.max(+(query.limit || 10), 1);
  const offset = (page - 1) * limit;
  return { ...query, page, limit, offset };
};

export function paginate(totalItems: number, page: number, limit: number) {
  const totalPages = Math.ceil(totalItems / limit);
  return {
    totalItems,
    totalPages,
    currentPage: page,
    pageSize: limit,
  };
}

export const jwtSign = (data: any, expiresIn: string | number = "30d") =>
  jwt.sign(data, env.JWT_SECRET!, { expiresIn } as SignOptions);
export const jwtVerify = (token: string) => jwt.verify(token, env.JWT_SECRET!);

export const hashPassword = async (password: string) => {
  const salt = await genSalt(10);
  return await bcrypt.hash(password, salt);
};
export const matchPassword = async (password: string, storedPassword: string) =>
  await bcrypt.compare(password, storedPassword);

export const generateRandomPassword = (length: number) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters.charAt(randomIndex);
  }
  return password;
};

export const formatDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const formattedDateTime = `${year}-${month}-${day}_${hours}:${minutes}:${seconds}`;
  return formattedDateTime;
};

export const parseNested = (data: any) => {
  if (!data || typeof data !== "object") return data;

  const result: any = {};

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const keys = key.replace(/\]/g, "").split("[");
      let current = result;

      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        if (i === keys.length - 1) {
          current[k as keyof any] = data[key];
        } else {
          const nextKey = keys[i + 1];

          const isNextKeyIndex =
            !isNaN(Number(nextKey)) &&
            Number.isInteger(Number(nextKey)) &&
            Number(nextKey) >= 0;

          if (!current[k as keyof any]) {
            current[k as keyof any] = isNextKeyIndex ? [] : {};
          }
          current = current[k as keyof any];
        }
      }
    }
  }

  return result;
};


export const toDate = (value?: any): Date | undefined => {
  if (!value) return undefined;

  const date = value instanceof Date ? value : new Date(value);

  // Check if date is valid
  if (isNaN(date.getTime())) return undefined;

  return date;
};
