import { getPackageDefinition } from "./utils.js";
import grpc from "@grpc/grpc-js";
import { promisify } from "node:util";
import { SERVER_PORT } from "./constants.js";

const { registry } = getPackageDefinition();

/** Creates a client for the server. */
export const createClient = async () => {
  const client = new registry.Registry(
    SERVER_PORT,
    grpc.credentials.createInsecure()
  );

  const promisableFns = ["register", "unregister", "fetchServiceLocation"];

  const proxy = new Proxy(client, {
    get: (target, property) => {
      return promisableFns.includes(property)
        ? promisify(target[property])
        : target[property];
    },
  });

  return proxy;
};
