import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import dummySchema from "./schema";

export type IDummy = InferSelectModel<typeof dummySchema>;
export type ICreateDummy = InferInsertModel<typeof dummySchema>;

export interface IDummyQueryParams {
    search?: string;
    page?: number;
    limit?: number;
}
