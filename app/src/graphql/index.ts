import { query } from "./query";
import { mutation } from "./mutation";
import { types } from "./types";
import resolvers from "./resolvers";

export const schema = {
  query,
  mutation,
  types,
  resolvers,
};
