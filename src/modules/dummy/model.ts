import { db } from "@/db";
import dummySchema from "./schema";
import { eq, ilike, or, desc, sql, and } from "drizzle-orm";
import Repository from "./repository";

class Model {
    static async create(data: any) {
        const [result] = await db.insert(dummySchema).values(data).returning();
        return result;
    }

    static async findAllAndCount(params: any) {
        const { search, page = 1, limit = 10 } = params;
        const offset = (page - 1) * limit;

        const conditions: any[] = [];
        if (search) {
            conditions.push(
                or(
                    ilike(dummySchema.name, `%${search}%`),
                    ilike(dummySchema.email, `%${search}%`),
                    ilike(dummySchema.username, `%${search}%`)
                )
            );
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        const result = await db
            .select(Repository.selectQuery)
            .from(dummySchema)
            .where(whereClause)
            .orderBy(desc(dummySchema.createdAt))
            .limit(limit)
            .offset(offset);

        const [{ count }]: any = await db
            .select({ count: sql<number>`count(*)` })
            .from(dummySchema)
            .where(whereClause);

        return {
            items: result,
            page: Number(page),
            totalItems: Number(count),
            totalPages: Math.ceil(Number(count) / limit),
        };
    }

    static async findById(id: number) {
        const [result] = await db
            .select(Repository.selectQuery)
            .from(dummySchema)
            .where(eq(dummySchema.id, id));
        return result;
    }

    static async findByEmailOrUsername(email: string, username: string) {
        const [result] = await db
            .select()
            .from(dummySchema)
            .where(or(eq(dummySchema.email, email), eq(dummySchema.username, username)));
        return result;
    }

    static async update(id: number, data: any) {
        const [result] = await db
            .update(dummySchema)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(dummySchema.id, id))
            .returning();
        return result;
    }

    static async delete(id: number) {
        const [result] = await db.delete(dummySchema).where(eq(dummySchema.id, id)).returning();
        return result;
    }
}

export default Model;