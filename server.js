const express = require('express');
const app = express();
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type RandomDie {
    numSides: Int!,
    rollOnce: Int!,
    roll(numRolls: Int!): [Int]
  }

  type Query {
    quoteOfTheDay: String,
    random: Float!,
    rollDice(numDice: Int!, numSides: Int): [Int],
    getDie(numSides: Int): RandomDie
  }
`);

class RandomDie {
  constructor(numSides) {
    this.numSides = numSides;
  }
  rollOnce() {
    return 1 + Math.floor(Math.random() * this.numSides);
  }
  roll({numRolls}) {
    let totalRolls = [];
    for (let i=0; i<numRolls; i++) {
      totalRolls.push(this.rollOnce());
    }
    return totalRolls;
  }
}

const root = {
  quoteOfTheDay: () => {
    return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within';
  },
  random: () => {
    return Math.random();
  },
  rollDice: function ({numDice, numSides}) {
    var output = [];
    for (var i = 0; i < numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (numSides || 6)));
    }
    return output;
  },
  getDie: function ({numSides}) {
    return new RandomDie(numSides || 6);
  }
};

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(4000)
console.log('Hey, Listen! Running GraphQL server at localhost:4000/graphql')