const stripe = require('stripe')(process.env.rk_test_51GdOVXB1jLb0OrLQmrtG0Vhju9X4marAzSczPoir4zmOIuJlPmVzKVQ07TyJqEXvCzBx34Ogq70UcAzSKg5GxWbK003MMh5jEO);
const { faunaFetch } = require('./utils/fauna');

exports.handler = async (_event, context) => {
  const { user } = context.clientContext;

  const result = await faunaFetch({
    query: `
      query ($netlifyID: ID!) {
        getUserByNetlifyID(netlifyID: $netlifyID) {
          stripeID
        }
      }
    `,
    variables: {
      netlifyID: user.sub,
    },
  });

  const { stripeID } = result.data.getUserByNetlifyID;

  const link = await stripe.billingPortal.sessions.create({
    customer: stripeID,
    return_url: process.env.URL,
  });

  return {
    statusCode: 200,
    body: JSON.stringify(link.url),
  };
};