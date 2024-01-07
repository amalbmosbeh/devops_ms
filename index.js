const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const { MONGODB } = require("./config.js");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const Post = require("./models/Post");
const usersRouter = require("./rest/userscc"); // Replace with the actual path to userscc.js
const postsRouter = require("./rest/postscc"); // Replace with the actual path to userscc.js

const PORT = 5000;
const app = express();

// Create the Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

async function startServer() {
  // Apply the Apollo middleware to the Express app
  await server.start();
  server.applyMiddleware({ app });

  // Connect to MongoDB
  await mongoose.connect(MONGODB, { useNewUrlParser: true });
  console.log("MongoDB connected");

  // Define the REST route

  app.use("/", postsRouter);

  app.use("/", usersRouter);

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:5000`);
  });
}

startServer().catch((err) => {
  console.error(err);
});
