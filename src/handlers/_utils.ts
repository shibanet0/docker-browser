import { IncomingMessage } from "node:http";
import Joi from "joi";

export const readBodyJSON = <T = unknown>(
  req: IncomingMessage,
  schema: Joi.Schema
) =>
  new Promise<T>((resolve, reject) => {
    const bodyParts: Buffer[] = [];
    req
      .on("error", (err) => {
        reject(err);
      })
      .on("data", (chunk) => {
        bodyParts.push(chunk);
      })
      .on("end", async () => {
        try {
          const body = JSON.parse(Buffer.concat(bodyParts).toString());

          await schema.validateAsync(body);

          resolve(body);
        } catch (error) {
          reject(error);
        }
      });
  });
