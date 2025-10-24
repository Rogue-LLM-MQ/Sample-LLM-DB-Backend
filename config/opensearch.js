const { Client } = require('@opensearch-project/opensearch');
const { defaultProvider } = require('@aws-sdk/credential-provider-node');
const { SignatureV4 } = require('@aws-sdk/signature-v4');
const { defaultRegionInfoProvider } = require('@aws-sdk/config-resolver');
const { NodeHttpHandler } = require('@aws-sdk/node-http-handler');
const { HttpRequest } = require('@aws-sdk/protocol-http');
const { Sha256 } = require('@aws-crypto/sha256-js');
const { fromEnv } = require('@aws-sdk/credential-provider-env');

// Initialize AWS Signature V4 signer
const signer = new SignatureV4({
  credentials: defaultProvider(),
  region: 'ap-southeast-2',
  service: 'es',
  sha256: Sha256,
});

// Create OpenSearch client
const client = new Client({
  node: 'https://vpc-llmmq-cv3mo2b7mblxoxptu7xwf76tm4.aos.ap-southeast-2.on.aws',
  Connection: class {
    constructor() {
      this.httpClient = new NodeHttpHandler();
    }

    async request(params) {
      const { method, body, path } = params;
      const request = new HttpRequest({
        body,
        headers: {
          'Content-Type': 'application/json',
        },
        method,
        hostname: 'vpc-llmmq-cv3mo2b7mblxoxptu7xwf76tm4.aos.ap-southeast-2.on.aws',
        path,
        protocol: 'https:',
      });

      const signedRequest = await signer.sign(request);
      const { headers } = await this.httpClient.handle(signedRequest);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Request successful' }),
      };
    }
  },
});

module.exports = client;
