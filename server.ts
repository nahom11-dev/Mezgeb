import dotenv from "dotenv";
import { loadSiteKeysFromEnv } from "./server/siteKeys";
import { createApp } from "./server/app";

dotenv.config();
loadSiteKeysFromEnv();

const PORT = Number(process.env.PORT) || 3000;
const app = createApp();
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Mezgeb server listening on http://localhost:${PORT}`);
});