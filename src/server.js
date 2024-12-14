import { SERVER_PORT } from "./constants.js";
import { getPackageDefinition } from "./utils.js";
import grpc from "@grpc/grpc-js";

const { registry } = getPackageDefinition();
const store = new Map();

/**
 * Takes the callback and passes the request.
 */
const registryFunction =
  (mapOperatorFn) =>
  ({ request }, rpcCallback) => {
    let error;
    let payload;

    try {
      // Run the operation with the request.
      payload = mapOperatorFn(request);
    } catch (e) {
      error = e;
    }

    // Callback with the error.
    rpcCallback(error, payload);
  };

/** Registers a service. */
const register = registryFunction(({ name, ipv4, port }) => {
  // Save the service location.
  store.set(name, { ipv4, port });

  const message = `${name} was registered on ${ipv4}:${port}`;
  console.log(message);

  return { message };
});

/** Unregisters a service. */
const unregister = registryFunction(({ name }) => {
  // Deletes the service location.
  const deleted = store.delete(name);

  const message = deleted
    ? `${name} has been unregistered`
    : `${name} not found`;

  console.log(message);

  return { message };
});

/** Returns the service location. */
const fetchServiceLocation = registryFunction(({ services, fetchAll }) => {
  const names = services.map(({ name }) => name);
  const response = [];

  for (let [name, location] of store.entries()) {
    if (fetchAll || names.includes(name)) {
      response.push({
        name,
        ...location,
      });
    }
  }

  return { locations: response };
});

// Start the server.
(() => {
  const server = new grpc.Server();

  server.addService(registry.Registry.service, {
    register,
    unregister,
    fetchServiceLocation,
  });

  server.bindAsync(
    SERVER_PORT,
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      if (error) {
        console.log(`Error on discovery service: ${error}`);
        return;
      }

      console.log(`Discovery Service started at ${port}`);
    }
  );
})();
