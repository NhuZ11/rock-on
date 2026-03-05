import type { IDummy } from "./interface.ts";

class Resource {
    static toJson(data: IDummy) {
        return {
            id: data.id,
            name: data.name,
            username: data.username,
            email: data.email,
            avatar: data.avatar,
            deviceTokens: data.deviceTokens,
            infos: data.infos,
            isActive: data.isActive,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        };
    }
    static collection(data: IDummy[]) {
        return data.map((item) => this.toJson(item));
    }
}

export default Resource;
