import { pgTable } from "drizzle-orm/pg-core";
import { attributes, tableName } from "./attribute";

const dummySchema = pgTable(tableName, attributes);

export default dummySchema;

