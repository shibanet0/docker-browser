import _debug from "debug";

export const debug = (namespace: string)=>_debug("app").extend(namespace, ":")

