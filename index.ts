import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import cors from 'cors';

import schema from './schema/schema';

const app = express();

app.use(cors());

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

app.get('/', (req: any, res: any, next: any) => {
  res.send('API is ready!');
});

app.listen(8080, () => {
  console.log('Server is running');
})
