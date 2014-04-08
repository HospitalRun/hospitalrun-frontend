'use strict';
module('HttpMethodElement');
test('Converts the http method to uppercase', function (){
	equal(new oauthSignature.HttpMethodElement('get').get(), 'GET',
		'A lowercase GET http method should be uppercase');
	equal(new oauthSignature.HttpMethodElement('pOsT').get(), 'POST',
		'A mixed case POST http method should be uppercase');
});
test('Handles non-values', function (){
	equal(new oauthSignature.HttpMethodElement().get(), '',
		'An undefined http method should be normalized to an empty string');
	equal(new oauthSignature.HttpMethodElement('').get(), '',
		'An empty http method should be normalized to an empty string');
	equal(new oauthSignature.HttpMethodElement(null).get(), '',
		'A null http method should be normalized to an empty string');
});

module('UrlElement');
test('Normalizes the url', function () {
	equal(new oauthSignature.UrlElement('http://example.co.uk').get(), 'http://example.co.uk',
		'A valid url should remain the same');
	equal(new oauthSignature.UrlElement('http://EXAMPLE.co.UK/endpoint').get(), 'http://example.co.uk/endpoint',
		'The url authority must be lowercase');
	equal(new oauthSignature.UrlElement('http://EXAMPLE.co.UK/endpoint/').get(), 'http://example.co.uk/endpoint/',
		'It should not strip off the trailing /');
	equal(new oauthSignature.UrlElement('HTTP://example.org').get(), 'http://example.org',
		'The url scheme must be lowercase');
	equal(new oauthSignature.UrlElement('http://example.org:80').get(), 'http://example.org',
		'The default http port (80) MUST be excluded');
	equal(new oauthSignature.UrlElement('https://example.org:443').get(), 'https://example.org',
		'The default https port (443) MUST be excluded');
	equal(new oauthSignature.UrlElement('https://example.org').get(), 'https://example.org',
		'The correct url MUST remain unchanged');
	equal(new oauthSignature.UrlElement('http://example.org:8080').get(), 'http://example.org:8080',
		'The non default http port MUST be included');
	equal(new oauthSignature.UrlElement('https://example.org:8080').get(), 'https://example.org:8080',
		'The non default https port MUST be included');
	equal(new oauthSignature.UrlElement('http://example.org/?foo=bar').get(), 'http://example.org/',
		'The query string should not be included');
	equal(new oauthSignature.UrlElement('http://example.org/#anchor').get(), 'http://example.org/',
		'The anchor should not be included');
	equal(new oauthSignature.UrlElement('example.org').get(), 'http://example.org',
		'The http url scheme is added automatically');
	equal(new oauthSignature.UrlElement('example.org:100').get(), 'http://example.org:100',
		'The port will not be stripped if the scheme is missing');
	equal(new oauthSignature.UrlElement('example.org:80').get(), 'http://example.org',
		'The default http port will be stripped if the scheme is missing');
});
test('Handles non-values', function () {
	equal(new oauthSignature.UrlElement().get(), '',
		'An undefined url should be normalized to an empty string');
	equal(new oauthSignature.UrlElement('').get(), '',
		'An empty url should be normalized to an empty string');
	equal(new oauthSignature.UrlElement(null).get(), '',
		'An null url should be normalized to an empty string');
});

module('ParametersLoader'); // Outputs: { 'key': ['value 1', 'value 2'] }
test('Loads parameters from different input structures', function () {
	var objectLikeInput =
		{
			a : 'b',
			foo : [ 'bar', 'baz', 'qux' ]
		},
		arrayLikeInput =
		[
			{ a : 'b'},
			{ foo : 'bar' },
			{ foo : ['baz', 'qux'] }
		],
		expectedOutput =
		{
			a : [ 'b' ],
			foo : [ 'bar', 'baz', 'qux' ]
		};
	deepEqual(new oauthSignature.ParametersLoader(objectLikeInput).get(), expectedOutput,
		'An object-like structure should be loaded');
	deepEqual(new oauthSignature.ParametersLoader(arrayLikeInput).get(), expectedOutput,
		'An array-like structure should be loaded');
	deepEqual(new oauthSignature.ParametersLoader( { a : null }).get(), { a : [ '' ] },
		'An object-like structure with an empty property should maintain the property');
	deepEqual(new oauthSignature.ParametersLoader( { a : [ ] }).get(), { a : [ '' ] },
		'An object-like structure with an empty array property should maintain the property');
	deepEqual(new oauthSignature.ParametersLoader( [ { a : null } ]).get(), { a : [ '' ] },
		'An array-like structure with an empty property should maintain the property');
	deepEqual(new oauthSignature.ParametersLoader( [ { a : [ ] } ]).get(), { a : [ '' ] },
		'An array-like structure with an empty array property should maintain the property');
});
test('Handles non-values', function () {
	deepEqual(new oauthSignature.ParametersLoader().get(), { },
		'An undefined parameter should be returned as an empty object');
	deepEqual(new oauthSignature.ParametersLoader('').get(), { },
		'An empty string parameter should be returned as an empty object');
	deepEqual(new oauthSignature.ParametersLoader(null).get(), { },
		'An null parameter should be returned as an empty object');
	deepEqual(new oauthSignature.ParametersLoader({ }).get(), { },
		'An empty object-like parameter should be returned as an empty object');
	deepEqual(new oauthSignature.ParametersLoader([ ]).get(), { },
		'An empty array-like parameter should be returned as an empty object');
});

module('ParametersElement');
test('Sorts and concatenates the parameters', function () {
	var orderByName =
		{
			foo : [ 'ß', 'bar'],
			baz : [ 'qux' ],
			a : [ '' ]
		},
		orderByNameAndValue =
		{
			c : [ 'hi there' ],
			z : [ 't', 'p' ],
			f : [ 'a', '50', '25' ],
			a : [ '1' ]
		};
	equal(new oauthSignature.ParametersElement(orderByName).get(), 'a=&baz=qux&foo=bar&foo=%C3%9F',
		'The parameters should be concatenated alphabetically by name');
	equal(new oauthSignature.ParametersElement(orderByNameAndValue).get(), 'a=1&c=hi%20there&f=25&f=50&f=a&z=p&z=t',
		'The parameters should be ordered alphabetically by name and value');
});
test('Handles non-values', function () {
	equal(new oauthSignature.ParametersElement().get(), '',
		'An undefined input should be returned as an empty string');
	equal(new oauthSignature.ParametersElement('').get(), '',
		'An empty string input should be returned as an empty string');
	equal(new oauthSignature.ParametersElement(null).get(), '',
		'A null input should be returned as an empty string');
	equal(new oauthSignature.ParametersElement({ }).get(), '',
		'An empty object input should be returned as an empty string');
});

module('Rfc3986');
test('Encodes the value following the RFC3986', function () {
	var i,
		unreservedCharacters =  'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
								'abcdefghijklmnopqrstuvwxyz' +
								'0123456789-_.~',
		reservedCharactersWithEncoding =[
			['!', '%21'], ['#', '%23'], ['$', '%24'], ['&', '%26'],	['\'', '%27'],
			['(', '%28'], [')', '%29'], ['*', '%2A'], ['+', '%2B'], [',', '%2C'],
			['/', '%2F'], [':', '%3A'], [';', '%3B'], ['=', '%3D'], ['?', '%3F'],
			['@', '%40'], ['[', '%5B'], [']', '%5D']
		];
	equal(new oauthSignature.Rfc3986().encode(unreservedCharacters), unreservedCharacters,
		'Characters in the unreserved character set MUST NOT be encoded');
	equal(new oauthSignature.Rfc3986().encode('*'), '%2A',
		'Hexadecimal characters in the encodings MUST be uppercase using the percent-encoding (%xx)');
	for (i = 0; i < reservedCharactersWithEncoding.length; i++) {
		equal(new oauthSignature.Rfc3986().encode(reservedCharactersWithEncoding[i][0]), reservedCharactersWithEncoding[i][1],
			'Characters not in the unreserved character set MUST be encoded');
	}
	equal(new oauthSignature.Rfc3986().encode('%'), '%25',
		'Percent character must be encoded');
});
test('Encodes the value containing UTF8 characters following the RFC3629', function () {
	equal(new oauthSignature.Rfc3986().encode('åçñ'), '%C3%A5%C3%A7%C3%B1',
		'Value MUST be encoded as UTF-8 octets before percent-encoding them');
	equal(new oauthSignature.Rfc3986().encode('你好'), '%E4%BD%A0%E5%A5%BD',
		'Value MUST be encoded as UTF-8 octets before percent-encoding them');
});
test('Handles encoding of non-values', function () {
	equal(new oauthSignature.Rfc3986().encode(), '',
		'Undefined value should return empty string');
	equal(new oauthSignature.Rfc3986().encode(''), '',
		'Empty value should return empty string');
	equal(new oauthSignature.Rfc3986().encode(null), '',
		'Null value should return empty string');
});
test('Decodes the value following the RFC3986', function () {
	var i,
		unreservedCharacters =  'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
								'abcdefghijklmnopqrstuvwxyz' +
								'0123456789-_.~',
		reservedCharactersWithEncoding =[
			['!', '%21'], ['#', '%23'], ['$', '%24'], ['&', '%26'],	['\'', '%27'],
			['(', '%28'], [')', '%29'], ['*', '%2A'], ['+', '%2B'], [',', '%2C'],
			['/', '%2F'], [':', '%3A'], [';', '%3B'], ['=', '%3D'], ['?', '%3F'],
			['@', '%40'], ['[', '%5B'], [']', '%5D']
		];
	equal(new oauthSignature.Rfc3986().decode(unreservedCharacters), unreservedCharacters,
		'Not encoded characters in the unreserved character set MUST NOT be decoded');
	for (i = 0; i < reservedCharactersWithEncoding.length; i++) {
		equal(new oauthSignature.Rfc3986().decode(reservedCharactersWithEncoding[i][1]), reservedCharactersWithEncoding[i][0],
			'Encoded characters not in the unreserved character set MUST be decoded');
	}
	equal(new oauthSignature.Rfc3986().decode('%25'), '%',
		'Encoded percent character must be decoded');
	equal(new oauthSignature.Rfc3986().decode('%31%32%33%41%42%43'), '123ABC',
		'Encoded unreserved characters must be decoded');
});
test('Decodes the value containing UTF8 characters following the RFC3629', function () {
	equal(new oauthSignature.Rfc3986().decode('%C3%A5%C3%A7%C3%B1'), 'åçñ',
		'Value MUST be percent-decoded to get UTF-8 octets');
	equal(new oauthSignature.Rfc3986().decode('%E4%BD%A0%E5%A5%BD'), '你好',
		'Value MUST be percent-decoded to get UTF-8 octets');
});
test('Handles decoding of non-values', function () {
	equal(new oauthSignature.Rfc3986().decode(), '',
		'Undefined value should return empty string');
	equal(new oauthSignature.Rfc3986().decode(''), '',
		'Empty value should return empty string');
	equal(new oauthSignature.Rfc3986().decode(null), '',
		'Null value should return empty string');
});

module('SignatureBaseString');
test('Starts with an uppercase http method', function () {
	equal(new oauthSignature.SignatureBaseString('get').generate(), 'GET&&',
		'The element separator (&) should be included for omitted elements');
	equal(new oauthSignature.SignatureBaseString('pOsT').generate(), 'POST&&',
		'The element separator (&) should be included for omitted elements');
});
test('Includes the encoded url as the second element', function () {
	equal(new oauthSignature.SignatureBaseString('GET', 'http://example.co.uk').generate(), 'GET&http%3A%2F%2Fexample.co.uk&',
		'The http method should be the first component of the url');
	equal(new oauthSignature.SignatureBaseString('', 'http://EXAMPLE.co.UK/endpoint').generate(), '&http%3A%2F%2Fexample.co.uk%2Fendpoint&',
		'The url authority must be lowercase');
    equal(new oauthSignature.SignatureBaseString('', 'http://EXAMPLE.co.UK/endpoint/').generate(), '&http%3A%2F%2Fexample.co.uk%2Fendpoint%2F&',
		'It should not strip off the trailing /');
    equal(new oauthSignature.SignatureBaseString('', 'HTTP://example.org').generate(), '&http%3A%2F%2Fexample.org&',
        'The url scheme must be lowercase');
    equal(new oauthSignature.SignatureBaseString('', 'http://example.org:80').generate(), '&http%3A%2F%2Fexample.org&',
		'The default http port (80) MUST be excluded');
    equal(new oauthSignature.SignatureBaseString('', 'https://example.org:443').generate(), '&https%3A%2F%2Fexample.org&',
        'The default https port (443) MUST be excluded');
    equal(new oauthSignature.SignatureBaseString('', 'http://example.org:8080').generate(), '&http%3A%2F%2Fexample.org%3A8080&',
        'The non default http port MUST be included');
    equal(new oauthSignature.SignatureBaseString('', 'https://example.org:8080').generate(), '&https%3A%2F%2Fexample.org%3A8080&',
        'The non default https port MUST be included');
    equal(new oauthSignature.SignatureBaseString('GET', 'http://example.org/?foo=bar').generate(), 'GET&http%3A%2F%2Fexample.org%2F&',
        'The query string should not be included');
    equal(new oauthSignature.SignatureBaseString('GET', 'http://example.org/#anchor').generate(), 'GET&http%3A%2F%2Fexample.org%2F&',
        'The anchor should not be included');
	equal(new oauthSignature.SignatureBaseString('', 'example.org').generate(), '&http%3A%2F%2Fexample.org&',
		'The http url scheme is added automatically');
	equal(new oauthSignature.SignatureBaseString('', 'example.org:100').generate(), '&http%3A%2F%2Fexample.org%3A100&',
		'The port will not be stripped if the scheme is missing');
	equal(new oauthSignature.SignatureBaseString('', 'example.org:80').generate(), '&http%3A%2F%2Fexample.org&',
		'The default http port will be stripped if the scheme is missing');
});
test('Ends with the normalized request parameters', function () {
	equal(new oauthSignature.SignatureBaseString('', '', { foo : 'bar' }).generate(), '&&foo%3Dbar',
		'The parameter should be appended');
	equal(new oauthSignature.SignatureBaseString('', '', { foo : 'bar', baz : 'qux' }).generate(), '&&baz%3Dqux%26foo%3Dbar',
		'The parameters specified with object initializer should be ordered alphabetically');
	equal(new oauthSignature.SignatureBaseString('', '', [{ foo : 'bar' }, { baz : 'qux' }]).generate(), '&&baz%3Dqux%26foo%3Dbar',
		'The parameter specified with an array of objects should be ordered alphabetically');
	equal(new oauthSignature.SignatureBaseString('', '', [{ foo : 'qux' }, { foo : 'bar'}, {foo : 'baz' }, { a : 'b' }]).generate(), '&&a%3Db%26foo%3Dbar%26foo%3Dbaz%26foo%3Dqux',
		'The parameter specified with an array of objects with the same key should be ordered alphabetically by value');
	equal(new oauthSignature.SignatureBaseString('', '', [{ foo : [ 'qux', 'bar', 'baz' ]}, { a : 'b' }]).generate(), '&&a%3Db%26foo%3Dbar%26foo%3Dbaz%26foo%3Dqux',
		'The parameter specified with an array of objects with an array of values for the same key should be ordered alphabetically by value');
	equal(new oauthSignature.SignatureBaseString('', '', { foo : [ 'qux', 'bar', 'baz'], a : 'b' }).generate(), '&&a%3Db%26foo%3Dbar%26foo%3Dbaz%26foo%3Dqux',
		'The array of values for a single key should be ordered alphabetically by value');
	equal(new oauthSignature.SignatureBaseString('', '', [{ z : 't' }, { z : 'p'}, { f : 'a' }, { f : 50 }, { f : '25' }, { c : 'hi there' }, { a : 1 }]).generate(), '&&a%3D1%26c%3Dhi%2520there%26f%3D25%26f%3D50%26f%3Da%26z%3Dp%26z%3Dt',
		'The parameter specified with an array of objects with the same key should be ordered alphabetically by value');
});
test('Handles non-values', function () {
	equal(new oauthSignature.SignatureBaseString().generate(), '&&',
		'The http method shouldn\'t be included if it is undefined');
	equal(new oauthSignature.SignatureBaseString('').generate(), '&&',
		'The http method shouldn\'t be included if it is empty');
	equal(new oauthSignature.SignatureBaseString(null).generate(), '&&',
		'The http method shouldn\'t be included if it is null');
	equal(new oauthSignature.SignatureBaseString('', '').generate(), '&&',
		'The resource url should not be included if it is empty');
	equal(new oauthSignature.SignatureBaseString('', null).generate(), '&&',
		'The resource url should not be included if it is null');
	equal(new oauthSignature.SignatureBaseString('', '', '').generate(), '&&',
		'The request parameters should not be included if it is empty');
	equal(new oauthSignature.SignatureBaseString('', '', null).generate(), '&&',
		'The request parameters should not be included if it is null');
});
test('Produces the OAuth 1.0a GET reference sample', function () {
	var parameters = {
			oauth_consumer_key : 'dpf43f3p2l4k3l03',
			oauth_token : 'nnch734d00sl2jdk',
			oauth_nonce : 'kllo9940pd9333jh',
			oauth_timestamp : '1191242096',
			oauth_signature_method : 'HMAC-SHA1',
			oauth_version : '1.0',
			file : 'vacation.jpg',
			size : 'original'
		},
		url = 'http://photos.example.net/photos',
		expectedSignatureBaseString = 'GET&http%3A%2F%2Fphotos.example.net%2Fphotos&file%3Dvacation.jpg%26oauth_consumer_key%3Ddpf43f3p2l4k3l03%26oauth_nonce%3Dkllo9940pd9333jh%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D1191242096%26oauth_token%3Dnnch734d00sl2jdk%26oauth_version%3D1.0%26size%3Doriginal';
	equal(new oauthSignature.SignatureBaseString('GET', url, parameters).generate(), expectedSignatureBaseString,
		'The generated GET signature base string should match the expected value');
});
test('Produces the OAuth 1.0a POST reference sample', function () {
	var parameters = {
			oauth_consumer_key : 'dpf43f3p2l4k3l03',
			oauth_token : 'nnch734d00sl2jdk',
			oauth_nonce : 'kllo9940pd9333jh',
			oauth_timestamp : '1191242096',
			oauth_signature_method : 'HMAC-SHA1',
			oauth_version : '1.0',
			file : 'vacation.jpg',
			size : 'original'
		},
		url = 'http://photos.example.net/photos',
		expectedSignatureBaseString = 'POST&http%3A%2F%2Fphotos.example.net%2Fphotos&file%3Dvacation.jpg%26oauth_consumer_key%3Ddpf43f3p2l4k3l03%26oauth_nonce%3Dkllo9940pd9333jh%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D1191242096%26oauth_token%3Dnnch734d00sl2jdk%26oauth_version%3D1.0%26size%3Doriginal';
	equal(new oauthSignature.SignatureBaseString('POST', url, parameters).generate(), expectedSignatureBaseString,
		'The generated POST signature base string should match the expected value');
});

module('HmacSha1');
test('Generates base64 encoded hash for test string', function () {
	equal(new oauthSignature.HmacSha1('testSignatureBaseString', 'consumerSecret&tokenSecret').getBase64EncodedHash(), '+8JOwipB49F+1y2W0/2S4q0Tp4s=',
		'The base64 encoded hash of test data is correct');
});
test('Generates base64 encoded hash for OAuth 1.0a reference sample', function () {
	var baseString = 'GET&http%3A%2F%2Fphotos.example.net%2Fphotos&file%3Dvacation.jpg%26oauth_consumer_key%3Ddpf43f3p2l4k3l03%26oauth_nonce%3Dkllo9940pd9333jh%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D1191242096%26oauth_token%3Dnnch734d00sl2jdk%26oauth_version%3D1.0%26size%3Doriginal',
		consumerSecret = 'kd94hf93k423kf44',
		tokenSecret = 'pfkkdhi9sl3r4s00',
		key = consumerSecret + '&' + tokenSecret,
		expectedBase64Hash = 'tR3+Ty81lMeYAr/Fid0kMTYa/WM=';
	equal(new oauthSignature.HmacSha1(baseString, key).getBase64EncodedHash(), expectedBase64Hash,
		'The base64 encoded hash of reference data is correct');
});
test('Handles non-values', function () {
	var expectedHash = '+9sdGxiqbAgyS31ktx+3Y3BpDh0=';
	equal(new oauthSignature.HmacSha1().getBase64EncodedHash(), expectedHash,
		'Handles undefined values');
	equal(new oauthSignature.HmacSha1('', '', '').getBase64EncodedHash(), expectedHash,
		'Handles empty values');
	equal(new oauthSignature.HmacSha1(null, null, null).getBase64EncodedHash(), expectedHash,
		'Handles empty values');
});

module('HmacSha1Signature');
test('Encodes the secrets following the RFC3986', function () {
	var signatureBaseString = 'GET&http%3A%2F%2Fapi.example.com%2Fendpoint&oauth_consumer_key%3Dconsumer-key%26oauth_nonce%3D5678%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D1234%26oauth_token%3Dtoken-key%26oauth_version%3D1.0';
	equal(new oauthSignature.HmacSha1Signature(signatureBaseString, '你好', 'åçñ').generate(), 'JXcouSrYw1x7ql1ArjfT1Bg8O9g%3D',
		'The secrets are encoding using RFC3986');
});
test('Appends the secrets separator (&)', function () {
	var signatureBaseString = 'GET&http%3A%2F%2Fapi.example.com%2Fendpoint&oauth_consumer_key%3Dconsumer-key%26oauth_nonce%3D5678%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D1234%26oauth_version%3D1.0';
	equal(new oauthSignature.HmacSha1Signature(signatureBaseString, 'consumer-secret', '').generate(), '9ynBsPmHokLVL8g3UQ3QX3czNXk%3D',
		'The separator (&) is appended if the optional token secret is empty');
});
test('Handles non-values', function () {
	equal(new oauthSignature.HmacSha1Signature().generate(), '5CoEcoq7XoKFjwYCieQvuzadeUA%3D',
		'Handles undefined values');
	equal(new oauthSignature.HmacSha1Signature(null, null, null).generate(), '5CoEcoq7XoKFjwYCieQvuzadeUA%3D',
		'Handles null values');
	equal(new oauthSignature.HmacSha1Signature('', '', '').generate(), '5CoEcoq7XoKFjwYCieQvuzadeUA%3D',
		'Handles empty values');
});

module('OAuthSignature');
test('Produces the signature for the OAuth 1.0a GET reference sample', function () {
	// This is implementing http://oauth.net/core/1.0a/#rfc.section.A.5.1 and http://oauth.net/core/1.0a/#rfc.section.A.5.2
	var httpMethod = 'GET',
		url = 'http://photos.example.net/photos',
		parameters = {
			oauth_consumer_key : 'dpf43f3p2l4k3l03',
			oauth_token : 'nnch734d00sl2jdk',
			oauth_nonce : 'kllo9940pd9333jh',
			oauth_timestamp : '1191242096',
			oauth_signature_method : 'HMAC-SHA1', // ToDo: should be optional and default to HMAC-SHA1
			oauth_version : '1.0', // ToDo: should be optional and default to 1.0
			file : 'vacation.jpg',
			size : 'original'
		},
		consumerSecret = 'kd94hf93k423kf44',
		tokenSecret = 'pfkkdhi9sl3r4s00',
		expectedEncodedSignature = 'tR3%2BTy81lMeYAr%2FFid0kMTYa%2FWM%3D',
		encodedSignature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret);
	equal(encodedSignature, expectedEncodedSignature,
		'The generated GET signature should match the expected reference value');
});