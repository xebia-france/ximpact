const Feedback = require('../feedback/type.feedback');
const FeedbackRepository = require('../feedback/repository.feedback');
const CustomerRepository = require('../customer/repository.customer');
const XebianRepository = require('../xebian/repository.xebian');
const ImpactRepository = require('../impact/repository.impact');

const {
  GraphQLNonNull, GraphQLString,
} = require('graphql');

const feedback = {
  type: Feedback,
  args: {
    id: {
      name: 'id',
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve(obj, { id }) {
    let dbFeedback;
    return FeedbackRepository.getFeedback(id)
      .then(_feedback => dbFeedback = _feedback)
      .then(() => ImpactRepository.getImpact(dbFeedback.impact_id))
      .then(impact => dbFeedback.impact = impact)
      .then(() => CustomerRepository.getCustomer(dbFeedback.customer_id))
      .then(customer => dbFeedback.customer_author = customer)
      .then(() => XebianRepository.getXebian(dbFeedback.xebian_id))
      .then(xebian => dbFeedback.xebian_author = xebian)
      .then(() => CustomerRepository.getCustomer(dbFeedback.impact.customer_id))
      .then(customer => dbFeedback.customer = customer)
      .then(() => XebianRepository.getXebian(dbFeedback.impact.xebian_id))
      .then(xebian => dbFeedback.xebian = xebian)
      .then(() => {
        dbFeedback.token = FeedbackRepository.createToken(dbFeedback);
        return dbFeedback;
      });
  },
};

const feedback_by_token = {
  type: Feedback,
  args: {
    token: {
      name: 'token',
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve(obj, { token }) {
    let dbFeedback;
    return FeedbackRepository.getFeedbackByToken(token)
      .then(_feedback => dbFeedback = _feedback)
      .then(() => ImpactRepository.getImpact(dbFeedback.impact_id))
      .then(impact => dbFeedback.impact = impact)
      .then(() => CustomerRepository.getCustomer(dbFeedback.customer_id))
      .then(customer => dbFeedback.customer = customer)
      .then(() => XebianRepository.getXebian(dbFeedback.impact.xebian_id))
      .then(xebian => dbFeedback.xebian = xebian)
      .then(() => {
        dbFeedback.token = FeedbackRepository.createToken(dbFeedback);
        return dbFeedback;
      });
  },
};

module.exports = { feedback, feedback_by_token };
