import type { IRoute } from "../../interface.ts";
import { controller } from "./controller.ts";

const routes: IRoute[] = [
  {
    method: "post",
    path: "dummy",
    controller: controller.create,
  },
  {
    method: "get",
    path: "dummy",
    controller: controller.list,
  },
  {
    method: "get",
    path: "dummy/:id",
    controller: controller.find,
  },
  {
    method: "patch",
    path: "dummy/:id",
    controller: controller.update,
  },
  {
    method: "delete",
    path: "dummy/:id",
    controller: controller.delete,
  },
];

export default routes;