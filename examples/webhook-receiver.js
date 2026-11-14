// Minimal webhook receiver for local testing (node examples/webhook-receiver.js)
import http from "http";
import crypto from "crypto";

const SECRET = process.env.WEBHOOK_SECRET || "whsec_demo";
const PORT = Number(process.env.PORT) || 3456;

function verify(sigHeader, rawBody) {
  const expected = `sha256=${crypto.createHmac("sha256", SECRET).update(rawBody).digest("hex")}`;
  return sigHeader === expected;
}

http
  .createServer((req, res) => {
    if (req.method !== "POST") {
      res.writeHead(405);
      res.end();
      return;
    }
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      const sig = req.headers["mezgeb-signature"];
      const event = req.headers["mezgeb-event"];
      const ok = typeof sig === "string" && verify(sig, raw);
      console.log(ok ? "✓" : "✗", event, raw.slice(0, 200));
      res.writeHead(ok ? 200 : 401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ received: ok }));
    });
  })
  .listen(PORT, () => console.log(`Webhook receiver http://127.0.0.1:${PORT}`));