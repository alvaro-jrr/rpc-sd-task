import express from "express";
import { createClient } from "../client.js";
import { services } from "../constants.js";

/** The service definition. */
const service = {
  name: services.database,
  ipv4: "127.0.0.1",
  port: 3000,
};

const app = express();

app.get("/db", (_, res) => {
  res.send([1, 2, 3, 4, 5]);
});

app.listen(service.port, () => {
  console.log(`Service "${service.name}" listening on ${service.port}`);
});

(async () => {
  const client = await createClient();
  await client.register(service);
})();
