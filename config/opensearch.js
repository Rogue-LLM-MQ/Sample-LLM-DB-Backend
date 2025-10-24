const { Client } = require('@opensearch-project/opensearch');
const { NodeHttpHandler } = require('@aws-sdk/node-http-handler');
const { HttpRequest } = require('@aws-sdk/protocol-http');
const { defaultProvider } = require('@aws-sdk/credential-provider-node');
const { SignatureV4 } = require('@aws-sdk/signature-v4');
const { Sha256 } = require('@aws-crypto/sha256-js');

const region = 'ap-southeast-2';
const endpoint = 'https://vpc-llmmq-cv3mo2b7mblxoxptu7xwf76tm4.aos.ap-southeast-2.on.aws';

const signer = new SignatureV4({
  credentials: defaultProvider(),
  service: 'es',
  region,
  sha256: Sha256,
});

class AwsSigV4Connection {
  constructor() {
    this.httpClient = new NodeHttpHandler();
  }

  async request(params) {
    const { method, path, body } = params;

    const request = new HttpRequest({
      body: body ? JSON.stringify(body) : undefined,
      headers: { 'Content-Type': 'application/json' },
      hostname: endpoint.replace(/^https?:\/\//, ''),
      method,
      path,
      protocol: 'https:',
    });

    const signedRequest = await signer.sign(request);
    const { response } = await this.httpClient.handle(signedRequest);

    return response;
  }
}

const client = new Client({
  node: endpoint,
  Connection: AwsSigV4Connection,
});

module.exports = client;
