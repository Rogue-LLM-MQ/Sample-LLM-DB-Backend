//config/opensearch.js
const { Client } = require('@opensearch-project/opensearch');
const AWS = require('aws-sdk');
const createAwsConnector = require('@opensearch-project/opensearch/aws');

const credentials = new AWS.EnvironmentCredentials('AWS'); // Uses EC2 role creds

const client = new Client({
  ...createAwsConnector({
    region: 'ap-southeast-2',
    credentials,
  }),
  node: 'https://vpc-llmmq-cv3mo2b7mblxoxptu7xwf76tm4.aos.ap-southeast-2.on.aws',
});

module.exports = client;
