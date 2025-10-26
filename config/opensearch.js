const { Client } = require('@opensearch-project/opensearch');
const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws');
const { defaultProvider } = require('@aws-sdk/credential-provider-node');

const region = 'ap-southeast-2';
const endpoint = 'https://vpc-llmmq-cv3mo2b7mblxoxptu7xwf76tm4.aos.ap-southeast-2.on.aws';

const signer = AwsSigv4Signer({
  region,
  service: 'es',
  getCredentials: defaultProvider(),
});

const client = new Client({
  ...signer,           // provides Connection + transport signing
  node: endpoint,
});

module.exports = client;
