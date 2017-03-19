import _ from 'lodash';
import GraphService from '../tool/GraphService';

export default {
  customers: [],
  createCustomer(email) {
    const graphQuery = encodeURI(`mutation{customer_create(email:"${email}"){id}}`);
    return GraphService.query(graphQuery)
      .then(response => response.customer_create);
  },
  updateCustomer(customer) {
    const graphQuery = encodeURI(`
mutation {
  customer_update(id: "${customer.id}", email: "${customer.email}", firstName: "${customer.firstName}", lastName: "${customer.lastName}", company: "${customer.company}") {
    id
  }
}`);
    return GraphService.query(graphQuery);
  },
  fetchCustomers() {
    const graphQuery = encodeURI('{customers{id,email,firstName,lastName, company}}');
    return GraphService.query(graphQuery)
      .then((response) => {
        this.customers.length = 0;
        _.each(response.customers, x => this.customers.push(x));
      });
  },
};
