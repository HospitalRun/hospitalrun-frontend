# OAuth 1.0a signature generator for node and the browser

[![Build Status](https://travis-ci.org/bettiolo/oauth-signature-js.png?branch=master)](https://travis-ci.org/bettiolo/oauth-signature-js)
[![NPM version](https://badge.fury.io/js/oauth-signature.png)](http://badge.fury.io/js/oauth-signature)
[![Dependency Status](https://david-dm.org/bettiolo/oauth-signature-js.png?theme=shields.io)](https://david-dm.org/bettiolo/oauth-signature-js)

[![NPM](https://nodei.co/npm/oauth-signature.png?mini=true)](https://nodei.co/npm/oauth-signature/)

## Usage

To generate the OAuth signature call the following method:

```js
oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret)
```
`tokenSecret` is optional

## Example

The following is an example on how to generate the signature for the reference sample as defined in  
 - http://oauth.net/core/1.0a/#rfc.section.A.5.1 
 - http://oauth.net/core/1.0a/#rfc.section.A.5.2

```js
var httpMethod = 'GET',
	url = 'http://photos.example.net/photos',
	parameters = {
		oauth_consumer_key : 'dpf43f3p2l4k3l03',
		oauth_token : 'nnch734d00sl2jdk',
		oauth_nonce : 'kllo9940pd9333jh',
		oauth_timestamp : '1191242096',
		oauth_signature_method : 'HMAC-SHA1',
		oauth_version : '1.0',
		file : 'vacation.jpg',
		size : 'original'
	},
	consumerSecret = 'kd94hf93k423kf44',
	tokenSecret = 'pfkkdhi9sl3r4s00',
	encodedSignature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret);
```

The `encodedSignature` variable will contain the BASE64 encoded HMAC-SHA1 hash: `tR3%2BTy81lMeYAr%2FFid0kMTYa%2FWM%3D`.

## Requesting a protected resource

Use the generated signature to populate the `oauth_signature` parameter to sign a protected resource as per [RFC](http://oauth.net/core/1.0a/#rfc.section.A.5.3).

Example GET request using query string parameters:

http://photos.example.net/photos?file=vacation.jpg&size=original&oauth_consumer_key=dpf43f3p2l4k3l03&oauth_token=nnch734d00sl2jdk&oauth_signature_method=HMAC-SHA1&oauth_signature=tR3%2BTy81lMeYAr%2FFid0kMTYa%2FWM%3D&oauth_timestamp=1191242096&oauth_nonce=kllo9940pd9333jh&oauth_version=1.0

## Advantages

This project has an extensive test coverage for all the corner cases present in the OAuth specification.

Take a look at the test file [src/app/signature.tests.mocha.js](src/app/oauth-signature.tests.mocha.js)

## How do I run tests?

The tests can be executed in your browser or in node

### Browser

Open the file [src/test-runner.mocha.html](src/test-runner.mocha.html) or [src/test-runner.qunit.html](src/test-runner.qunit.html) in your browser

### Node

Execute `npm test` in the console
