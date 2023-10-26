import { handle } from "./_handle.js";
import { join } from "node:path";
import * as fs from "node:fs";

const swagger = fs.readFileSync(join(process.cwd(), "swagger.yaml"), "utf-8");

handle("GET", "/swagger", async (req, res) => {
  res.setHeader("Content-Type", "text/yaml");
  res.statusCode = 200;
  res.end(swagger);
});
