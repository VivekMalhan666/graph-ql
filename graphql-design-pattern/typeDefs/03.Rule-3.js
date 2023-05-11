// Rule #3: Design your API Around your Business Domain
const { ApolloServer, gql } = require("apollo-server");

exports.typeDefs = gql`
  type Query {
    hello: String!
    car(id: ID!): Car!
  }

  type Car {
    id: ID!
    color: String!
    make: String!
  }

  type Group  {
    Image
    [Car]
    [AutomaticGroupFeatures]
  }

  type AutomaticGroupFeatures {}

`;
