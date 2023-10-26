import { handle } from "./_handle.js";
import { getMetrics } from "../metrics.js";

handle("GET", "/metrics", async (req, res) => {
  const metrics = await getMetrics();

  res.setHeader("Content-Type", "text/plain");
  res.statusCode = 200;
  res.end(metrics);
});
