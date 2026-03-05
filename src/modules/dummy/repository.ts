import dummySchema from "./schema";

const selectQuery = {
    id: dummySchema.id,
    name: dummySchema.name,
    username: dummySchema.username,
    email: dummySchema.email,
    avatar: dummySchema.avatar,
    deviceTokens: dummySchema.deviceTokens,
    infos: dummySchema.infos,
    isActive: dummySchema.isActive,
    createdAt: dummySchema.createdAt,
    updatedAt: dummySchema.updatedAt,
};

export default { selectQuery };
