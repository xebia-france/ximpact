const express = require('express');
const cors = require('cors');
const graphqlHTTP = require('express-graphql');
const query = require('./queries');
const mutation = require('./mutations');
const { GraphQLSchema } = require('graphql');
const CronJob = require('cron').CronJob;
const monthlyFeedback = require('./monthly-feedback/monthly-feedback');

const port = process.env.PORT || 4000;

const schema = new GraphQLSchema({ query, mutation });

const app = express();
app.options('/graphql', cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Methods', 'POST');
  next();
});
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));
app.listen(port, () => console.log(`Now browse to http://localhost:${port}/graphql`));

new CronJob('* * * * * *', monthlyFeedback.sendFeedbackRequest, null, true, 'Europe/Paris');
