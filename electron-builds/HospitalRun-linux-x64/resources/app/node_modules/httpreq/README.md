node-httpreq
============

node-httpreq is a node.js library to do HTTP(S) requests the easy way

Do GET, POST, PUT, PATCH, DELETE, OPTIONS, upload files, use cookies, change headers, ...

## Install

You can install __httpreq__ using the Node Package Manager (npm):

    npm install httpreq

## Simple example
```js
var httpreq = require('httpreq');

httpreq.get('http://www.google.com', function (err, res){
  if (err) return console.log(err);

  console.log(res.statusCode);
  console.log(res.headers);
  console.log(res.body);
  console.log(res.cookies);
});
```

## How to use

* [httpreq.get(url, [options], callback)](#get)
* [httpreq.post(url, [options], callback)](#post)
* [httpreq.put(url, [options], callback)](#put)
* [httpreq.delete(url, [options], callback)](#delete)
* [httpreq.options(url, [options], callback)](#options)
* [Uploading files](#upload)
* [Downloading a binary file](#binary)
* [Downloading a file directly to disk](#download)
* [Sending a custom body](#custombody)
* [Using a http(s) proxy](#proxy)
* [httpreq.doRequest(options, callback)](#dorequest)

---------------------------------------
### httpreq.get(url, [options], callback)
<a name="get"></a>

__Arguments__
 - url: The url to connect to. Can be http or https.
 - options: (all are optional) The following options can be passed:
    - parameters: an object of query parameters
    - headers: an object of headers
    - cookies: an array of cookies
    - auth: a string for basic authentication. For example `username:password`
    - binary: true/false (default: false), if true, res.body will a buffer containing the binary data
    - allowRedirects: (default: __true__ , only with httpreq.get() ), if true, redirects will be followed
    - maxRedirects: (default: __10__ ). For example 1 redirect will allow for one normal request and 1 extra redirected request.
    - timeout: (default: __none__ ). Adds a timeout to the http(s) request. Should be in milliseconds.
    - proxy, if you want to pass your request through a http(s) proxy server:
        - host: eg: "192.168.0.1"
        - port: eg: 8888
        - protocol: (default: __'http'__ ) can be 'http' or 'https'
     - rejectUnauthorized: validate certificate for request with HTTPS. [More here](http://nodejs.org/api/https.html#https_https_request_options_callback)
 - callback(err, res): A callback function which is called when the request is complete. __res__ contains the headers ( __res.headers__ ), the http status code ( __res.statusCode__ ) and the body ( __res.body__ )

__Example without options__

```js
var httpreq = require('httpreq');

httpreq.get('http://www.google.com', function (err, res){
  if (err) return console.log(err);

  console.log(res.statusCode);
  console.log(res.headers);
  console.log(res.body);
});
```

__Example with options__

```js
var httpreq = require('httpreq');

httpreq.get('http://posttestserver.com/post.php', {
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
```
---------------------------------------
### httpreq.post(url, [options], callback)
<a name="post"></a>

__Arguments__
 - url: The url to connect to. Can be http or https.
 - options: (all are optional) The following options can be passed:
    - parameters: an object of post parameters (content-type is set to *application/x-www-form-urlencoded; charset=UTF-8*)
    - json: if you want to send json directly (content-type is set to *application/json*)
    - files: an object of files to upload (content-type is set to *multipart/form-data; boundary=xxx*)
    - body: custom body content you want to send. If used, previous options will be ignored and your custom body will be sent. (content-type will not be set)
    - headers: an object of headers
    - cookies: an array of cookies
    - auth: a string for basic authentication. For example `username:password`
    - binary: true/false (default: __false__ ), if true, res.body will be a buffer containing the binary data
    - allowRedirects: (default: __false__ ), if true, redirects will be followed
    - maxRedirects: (default: __10__ ). For example 1 redirect will allow for one normal request and 1 extra redirected request.
    - encodePostParameters: (default: __true__ ), if true, POST/PUT parameters names will be URL encoded.
    - timeout: (default: none). Adds a timeout to the http(s) request. Should be in milliseconds.
    - proxy, if you want to pass your request through a http(s) proxy server:
        - host: eg: "192.168.0.1"
        - port: eg: 8888
        - protocol: (default: __'http'__ ) can be 'http' or 'https'
    - rejectUnauthorized: validate certificate for request with HTTPS. [More here](http://nodejs.org/api/https.html#https_https_request_options_callback)
 - callback(err, res): A callback function which is called when the request is complete. __res__ contains the headers ( __res.headers__ ), the http status code ( __res.statusCode__ ) and the body ( __res.body__ )

__Example without extra options__

```js
var httpreq = require('httpreq');

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
```

__Example with options__

```js
var httpreq = require('httpreq');

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
```

---------------------------------------
### httpreq.put(url, [options], callback)
<a name="put"></a>

Same options as [httpreq.post(url, [options], callback)](#post)

---------------------------------------
<a name="delete" />
### httpreq.delete(url, [options], callback)

Same options as [httpreq.post(url, [options], callback)](#post)

---------------------------------------
<a name="options" />
### httpreq.options(url, [options], callback)

Same options as [httpreq.get(url, [options], callback)](#get) except for the ability to follow redirects.

---------------------------------------
<a name="upload" />
### Uploading files

You can still use ```httpreq.uploadFiles({url: 'url', files: {}}, callback)```, but it's easier to just use POST (or PUT):

__Example__

```js
var httpreq = require('httpreq');

httpreq.post('http://posttestserver.com/upload.php', {
  parameters: {
    name: 'John',
    lastname: 'Doe'
  },
  files:{
    myfile: __dirname + "/testupload.jpg",
    myotherfile: __dirname + "/testupload.jpg"
  }
}, function (err, res){
  if (err) throw err;
});
```

---------------------------------------
<a name="binary"></a>
### Downloading a binary file
To download a binary file, just add __binary: true__ to the options when doing a get or a post.

__Example__

```js
var httpreq = require('httpreq');

httpreq.get('https://ssl.gstatic.com/gb/images/k1_a31af7ac.png', {binary: true}, function (err, res){
  if (err){
    console.log(err);
  }else{
    fs.writeFile(__dirname + '/test.png', res.body, function (err) {
      if(err)
        console.log("error writing file");
    });
  }
});
```

---------------------------------------
<a name="download"></a>
### Downloading a file directly to disk
To download a file directly to disk, use the download method provided.

Downloading is done using a stream, so the data is not stored in memory and directly saved to file.

__Example__

```js
var httpreq = require('httpreq');

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

```
---------------------------------------
<a name="custombody"></a>
### Sending a custom body
Use the body option to send a custom body (eg. an xml post)

__Example__

```js
var httpreq = require('httpreq');

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
```

---------------------------------------
<a name="proxy"></a>
### Using a http(s) proxy

__Example__

```js
var httpreq = require('httpreq');

httpreq.post('http://posttestserver.com/post.php', {
  proxy: {
    host: '10.100.0.126',
    port: 8888
  }
}, function (err, res){
  if (err){
    console.log(err);
  }else{
    console.log(res.body);
  }
});
```

---------------------------------------
### httpreq.doRequest(options, callback)
<a name="dorequest"></a>

httpreq.doRequest is internally used by httpreq.get() and httpreq.post(). You can use this directly. Everything is stays the same as httpreq.get() or httpreq.post() except that the following options MUST be passed:
- url: the url to post the files to
- method: 'GET', 'POST', 'PUT' or 'DELETE'

## Donate

If you like this module or you want me to update it faster, feel free to donate. It helps increasing my dedication to fixing bugs :-)

[![](https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=AB3R2SUL53K7S)


