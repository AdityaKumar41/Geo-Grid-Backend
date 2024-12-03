import express from "express";
import { ApolloServer } from "@apollo/server";
import cors from "cors";
import bodyParser from "body-parser";
import { expressMiddleware } from "@apollo/server/express4";
import { schema } from "./graphql";

const initServer = async () => {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  const server = new ApolloServer({
    typeDefs: `
        ${schema.types}
        type Query {
          ${schema.query}
        }
        type Mutation {
          ${schema.mutation}
        }
    `,
    resolvers: {
      Query: {
        VerifyAdmin: () => true,
      },
    },
  });
  await server.start();

  app.use("/graphql", expressMiddleware(server));

  return app;
};

export default initServer;
