var httpreq = require('./lib/httpreq');
fs = require('fs')


// example1(); // get www.google.com
// example2(); // do some post
// example3(); // same as above + extra headers + cookies
// example4(); // https also works:
// example5(); // uploading some file:
// example6(); // u can use doRequest instead of .get or .post
// example7(); // download a binary file:
// example8(); // send json
// example9(); // send your own body content (eg. xml)
// example10(); // set max redirects:
// example11(); // set timeout
// example12(); // // download file directly to disk


// get www.google.com
function example1(){
	httpreq.get('http://www.google.com', function (err, res){
		if (err){
			console.log(err);
		}else{
			console.log(res.headers); //headers are stored in res.headers
			console.log(res.body); //content of the body is stored in res.body
		}
	});
}

// do some post
function example2(){
	httpreq.post('http://posttestserver.com/post.php', {
		parameters: {
			name: 'John',
			lastname: 'Doe'
		}
	}, function (err, res){
		if (err){
			console.log(err);
		}else{
			console.log(res.body);
		}
	});
}

// same as above + extra headers + cookies
function example3(){
	httpreq.post('http://posttestserver.com/post.php', {
		parameters: {
			name: 'John',
			lastname: 'Doe'
		},
		headers:{
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:18.0) Gecko/20100101 Firefox/18.0'
		},
		cookies: [
			'token=DGcGUmplWQSjfqEvmu%2BZA%2Fc',
			'id=2'
		]
	}, function (err, res){
		if (err){
			console.log(err);
		}else{
			console.log(res.body);
		}
	});
}

// https also works:
function example4(){
	httpreq.get('https://graph.facebook.com/19292868552', function (err, res){
		if (err){
			console.log(err);
		}else{
			console.log(JSON.parse(res.body));
		}
	});
}

// uploading some file:
function example5(){
	httpreq.uploadFiles({
		url: "http://rekognition.com/demo/do_upload/",
		parameters:{
			name_space	: 'something',
		},
		files:{
			fileToUpload: __dirname + "/test/testupload.jpg"
		}},
	function (err, res){
		if (err) return console.log(err);
		console.log(res.body);
	});
}

// u can use doRequest instead of .get or .post
function example6(){
	httpreq.doRequest({
		url: 'https://graph.facebook.com/19292868552',
		method: 'GET',
		parameters: {
			name: 'test'
		}
	},
	function (err, res){
		if (err){
			console.log(err);
		}else{
			console.log(JSON.parse(res.body));
		}
	});
}

// download a binary file:
function example7(){
	httpreq.get('https://ssl.gstatic.com/gb/images/k1_a31af7ac.png', {
		binary: true,
		progressCallback: function (err, progress) {
			console.log(progress);
		}
	},
	function (err, res){
		if (err){
			console.log(err);
		}else{
			fs.writeFile(__dirname + '/test.png', res.body, function (err) {
				if(err) return console.log("error writing file");
			});
		}
	});
}

// send json
function example8(){
	httpreq.post('http://posttestserver.com/post.php',{
		json: {name: 'John', lastname: 'Do'},
		headers:{
			'Content-Type': 'text/xml',
		}},
		function (err, res) {
			if (err){
				console.log(err);
			}else{
				console.log(res.body);
			}
		}
	);
}

// send your own body content (eg. xml):
function example9(){
	httpreq.post('http://posttestserver.com/post.php',{
		body: '<?xml version="1.0" encoding="UTF-8"?>',
		headers:{
			'Content-Type': 'text/xml',
		}},
		function (err, res) {
			if (err){
				console.log(err);
			}else{
				console.log(res.body);
			}
		}
	);
}

// set max redirects:
function example10(){
	httpreq.get('http://scobleizer.com/feed/',{
		maxRedirects: 2, // default is 10
		headers:{
			'User-Agent': 'Magnet', //for some reason causes endless redirects on this site...
		}},
		function (err, res) {
			if (err){
				console.log(err);
			}else{
				console.log(res.body);
			}
		}
	);
}

// set timeout
function example11(){
	httpreq.get('http://localhost:3000/',{
		timeout: (5 * 1000) // timeout in milliseconds
		},
		function (err, res) {
			if (err){
				console.log(err);
			}else{
				console.log(res.body);
			}
		}
	);
}

// download file directly to disk:
function example12 () {
	httpreq.download(
		'https://ssl.gstatic.com/gb/images/k1_a31af7ac.png',
		__dirname + '/test.png'
	, function (err, progress){
		if (err) return console.log(err);
		console.log(progress);
	}, function (err, res){
		if (err) return console.log(err);
		console.log(res);
	});
}


