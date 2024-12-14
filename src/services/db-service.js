import express from "express";
import { createClient } from "../client.js";
import { services } from "../constants.js";

const server = express();

/** The service definition. */
const service = {
  name: services.database,
  ipv4: "127.0.0.1",
  port: 3000,
};

server
  .get("/db", (_, res) => {
    res.send([1, 2, 3, 4, 5]);
  })
  .listen(service.port, () => {
    console.log(`Service "${service.name}" listening on ${service.port}`);
  });

(async () => {
  const client = await createClient();
  await client.register(service);
})();
