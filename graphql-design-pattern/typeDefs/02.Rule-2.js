// Rule #2: Never Expose Implementation Details

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

  interface Group {
    Image
    [GroupMembership]
  }

  type ManualGroup implements Group {
    Image
    [Car]
  }

  type AutomaticGroup implements Group {
    Image
    [Car]
    [AutomaticGroupFeatures]
  }

  type AutomaticGroupFeatures {}

`;
