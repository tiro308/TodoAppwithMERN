const { GraphQLServer } = require('graphql-yoga');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;


const Todo = mongoose.model("Todo", {
  text: String,
  complete: Boolean
});

const typeDefs = `
  type Query {
    hello(name: String): String!
    todos: [Todo]
  }
  type Todo{
    id: ID!
    text: String!
    complete: Boolean!
  }
  type Mutation{
    createTodo(text: String!): Todo
    updateTodo(id: ID!, complete: Boolean!): Boolean
    removeTodo(id: ID!): Boolean
  }
`;

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
    todos: () => Todo.find()
  },
  Mutation: {
    createTodo: async (_,{text}) => {
      const todo = new Todo ({text, complete: false});
      await todo.save();
      return todo;
    },
    updateTodo: async (_,{id, complete}) => {
      await Todo.findByIdAndUpdate(id, {complete});
      return true;
    },
    removeTodo: async (_,{id}) => {
      await Todo.findByIdAndRemove(id);
      return true;
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  server.start(() => console.log('Server is running on localhost:4000, dokumentieren nicht vergessen!'));
});

// starte client&server mit concurrently in package.json.script: npm run dev

/* ***CRUD***
mutation{
  createTodo(text:"PC rebooten")
  {
    id
    text
    complete
  }
}
query{
  todos{
    id
  	text
  	complete
  }
}
mutation{
  updateTodo(id:"5b8930175a4e743ab03fcf5f", complete:true)
}
mutation{
  removeTodo(id:"5b8930175a4e743ab03fcf5f")
}
*/