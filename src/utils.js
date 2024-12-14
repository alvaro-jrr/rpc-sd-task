import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

/**
 * Returns the package definition.
 */
export const getPackageDefinition = () => {
  return grpc.loadPackageDefinition(
    protoLoader.loadSync(`${import.meta.dirname}/protos/registry.proto`)
  );
};
