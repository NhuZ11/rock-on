import type { IRoute } from "@/interface";
import { importFromYoutubeController } from "./controller";

const routes: IRoute[] = [
  {
    method: "post",
    path: "import/youtube",
    controller: importFromYoutubeController,
    tags: ["import", "youtube"],
  },
];

export default routes;

