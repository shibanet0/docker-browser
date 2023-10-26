import { IncomingMessage } from "http";

export const parseURL = (req: IncomingMessage)=>{
  return new URL(
    req.url||"",
    `http://${req.headers.host}`
  )
}