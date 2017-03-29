var httpreq = require('../lib/httpreq');

var assert = require("assert");
var expect = require("chai").expect;
var express = require('express');
var http = require('http');
var fs = require('fs');



describe("httpreq", function(){

	var port, app, webserver, endpointroot;

	before(function (done) {
		port = Math.floor( Math.random() * (65535 - 1025) + 1025 );

		endpointroot = 'http://localhost:'+port;

		app = express();

		app.configure(function(){
			app.use(express.logger('dev'));
			app.use(express.errorHandler());
			app.use(express.bodyParser());
			app.use(express.methodOverride());
			app.use(app.router);
		});


		webserver = http.createServer(app).listen(port, function(){
			console.log("web server listening on port " + port);
			done();
		});


	});

	after(function () {
		webserver.close();
	});


	describe("get", function(){

		it("should do a simple GET request", function (done){

			var path = '/get'; // make sure this is unique when writing tests

			app.get(path, function (req, res) {
				res.send('ok');
				done();
			});

			httpreq.get(endpointroot + path, function (err, res) {
				if (err) throw err;
			});

		});

	});

	describe("post", function(){

		it("should do a simple POST request with parameters", function (done){

			var parameters = {
				name: 'John',
				lastname: 'Doe'
			};

			var path = '/post';

			// set up webserver endpoint:
			app.post(path, function (req, res) {
				res.send('ok');

				expect(req.body).to.deep.equal(parameters);

				done();
			});

			// post parameters to webserver endpoint:
			httpreq.post(endpointroot + path, {
				parameters: parameters
			}, function (err, res){
				if (err) throw err;
			});

		});

		it("should do a simple POST request with parameters and cookies", function (done){

			var parameters = {
				name: 'John',
				lastname: 'Doe'
			};

			var cookies = [
				'token=DGcGUmplWQSjfqEvmu%2BZA%2Fc',
				'id=2'
			];

			var path = '/postcookies';

			// set up webserver endpoint:
			app.post(path, function (req, res) {
				res.send('ok');

				expect(req.body).to.deep.equal(parameters);
				expect(req.headers.cookie).to.equal(cookies.join('; '));

				done();
			});

			// post testdata to webserver endpoint:
			httpreq.post(endpointroot + path, {
				parameters: parameters,
				cookies: cookies
			}, function (err, res){
				if (err) throw err;
			});

		});

		it("should do a simple POST request with parameters and custom headers", function (done){

			var parameters = {
				name: 'John',
				lastname: 'Doe'
			};

			var headers = {
				'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:18.0) Gecko/20100101 Firefox/18.0'
			};

			var path = '/postheaders';

			// set up webserver endpoint:
			app.post(path, function (req, res) {
				res.send('ok');

				expect(req.body).to.deep.equal(parameters);
				expect(req.headers).to.have.a.property('user-agent', headers['User-Agent']);

				done();
			});

			// post testdata to webserver endpoint:
			httpreq.post(endpointroot + path, {
				parameters: parameters,
				headers: headers
			}, function (err, res){
				if (err) throw err;
			});

		});

	});


	describe("POST json", function () {
		it('should POST some json', function (done) {
			var somejson = {
				name: 'John',
				lastname: 'Doe'
			};

			var path = '/postjson';

			// set up webserver endpoint:
			app.post(path, function (req, res) {
				res.send('ok');

				expect(req.body).to.deep.equal(somejson);

				done();
			});

			httpreq.post(endpointroot + path, {
				json: somejson
			}, function (err, res){
				if (err) throw err;
			});
		});
	});


	describe("File upload", function () {
		it('should upload 1 file (old way)', function (done) {

			var testparams = {
				name: 'John',
				lastname: 'Doe'
			};

			var testfile = __dirname + "/testupload.jpg";

			var path = '/uploadfile_old';

			// set up webserver endpoint:
			app.post(path, function (req, res) {
				res.send('ok');

				expect(req.body).to.deep.equal(testparams);

				comparefiles(req.files['myfile'].path, testfile, done);
			});

			httpreq.uploadFiles({
				url: endpointroot + path,
				parameters: testparams,
				files:{
					myfile: testfile
				}
			}, function (err, res){
				if (err) throw err;
			});
		});

		it('should upload 2 files (new way, using POST)', function (done) {

			var testparams = {
				name: 'John',
				lastname: 'Doe'
			};

			var testfile = __dirname + "/testupload.jpg";

			var path = '/uploadfiles';

			// set up webserver endpoint:
			app.post(path, function (req, res) {
				res.send('ok');

				expect(req.body).to.deep.equal(testparams);

				comparefiles(req.files['myfile'].path, testfile, function () {
					comparefiles(req.files['myotherfile'].path, testfile, function () {
						done();
					});
				});
			});

			httpreq.post(endpointroot + path, {
				parameters: testparams,
				files:{
					myfile: testfile,
					myotherfile: testfile
				}
			}, function (err, res){
				if (err) throw err;
			});
		});

		it('should upload 2 files (new way, using PUT)', function (done) {

			var testparams = {
				name: 'John',
				lastname: 'Doe'
			};

			var testfile = __dirname + "/testupload.jpg";

			var path = '/uploadfiles_put';

			// set up webserver endpoint:
			app.put(path, function (req, res) {
				res.send('ok');

				expect(req.body).to.deep.equal(testparams);

				comparefiles(req.files['myfile'].path, testfile, function () {
					comparefiles(req.files['myotherfile'].path, testfile, function () {
						done();
					});
				});
			});

			httpreq.put(endpointroot + path, {
				parameters: testparams,
				files:{
					myfile: testfile,
					myotherfile: testfile
				}
			}, function (err, res){
				if (err) throw err;
			});
		});
	});

});


function comparefiles (file1, file2, callback) {
	fs.readFile(file1, function (err, file1data) {
		if(err) throw err;

		fs.readFile(file2, function (err, file2data) {
			if(err) throw err;

			 expect(file1data).to.deep.equal(file2data);

			 callback();
		});
	});
}