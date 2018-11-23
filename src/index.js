/* eslint-disable no-console */
const { GraphQLServer } = require('graphql-yoga');
const mongoose = require('mongoose');

const typeDefs = './src/schema.graphql';
const Mutation = require('./resolvers/mutation');
const Query = require('./resolvers/query');
const { MONGODB_URI } = require('./config');

const resolvers= {
  Mutation,
  Query
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

if (require.main === module) {
  mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
  server.start(() => console.log('Server is running'));
}