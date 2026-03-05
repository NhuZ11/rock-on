import type { Context } from "elysia";
import { DummyService } from "./service";

export const controller = {
    create: async ({ body, set }: Context) => {
        const data = await DummyService.create(body as any);
        set.status = 201;
        return { success: true, message: "Created successfully", data };
    },
    list: async ({ query }: Context) => {
        const data = await DummyService.list(query as any);
        return { success: true, data };
    },
    find: async ({ params }: Context) => {
        const data = await DummyService.find(params.id as string);
        return { success: true, data };
    },
    update: async ({ params, body }: Context) => {
        const data = await DummyService.update(params.id as string, body);
        return { success: true, message: "Updated successfully", data };
    },
    delete: async ({ params }: Context) => {
        const data = await DummyService.delete(params.id as string);
        return { success: true, message: "Deleted successfully", data };
    },
};
