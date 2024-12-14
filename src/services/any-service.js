import express from "express";
import { createClient } from "../client.js";
import { services } from "../constants.js";

/** The service definition. */
const service = {
  name: services.any,
  ipv4: "127.0.0.1",
  port: 3001,
};

const serviceLocations = new Map();

const app = express();

app.get("/", async (_, res) => {
  // Locate service.
  const dbService = serviceLocations.get(services.database);

  try {
    const response = await fetch(
      `http://${dbService.ipv4}:${dbService.port}/db`
    );

    const data = await response.json();

    return res.send({
      data,
    });
  } catch (e) {
    return res.send({ error: e });
  }
});

app.listen(service.port, () => {
  console.log(`Service "${service.name}" listening on ${service.port}`);
});

(async () => {
  const client = await createClient();
  await client.register(service);

  const { locations = [] } = await client.fetchServiceLocation({
    services: [
      {
        name: services.database,
      },
    ],
  });

  const dbService = locations.find(
    (service) => service.name === services.database
  );

  // Register db service.
  if (dbService) {
    serviceLocations.set(services.database, dbService);
  }
})();
