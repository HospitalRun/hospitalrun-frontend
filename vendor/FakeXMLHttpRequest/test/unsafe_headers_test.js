var xhr;
module("setting unsafe header mirrors browser behavior and throws", {
  setup: function(){
    xhr = new FakeXMLHttpRequest();
  },
  teardown: function(){
    window.xhr = undefined;
  }
});

test("Accept-Charset", function(){
  throws(function(){  xhr.setRequestHeader("Accept-Charset", '...'); })
});

test("Accept-Encoding", function(){
  throws(function(){  xhr.setRequestHeader("Accept-Encoding", '...'); })
});

test("Connection", function(){
  throws(function(){  xhr.setRequestHeader("Connection", '...'); })
});

test("Content-Length", function(){
  throws(function(){  xhr.setRequestHeader("Content-Length", '...'); })
});

test("Cookie", function(){
  throws(function(){  xhr.setRequestHeader("Cookie", '...'); })
});

test("Cookie2", function(){
  throws(function(){  xhr.setRequestHeader("Cookie2", '...'); })
});

test("Content-Transfer-Encoding", function(){
  throws(function(){  xhr.setRequestHeader("Content-Transfer-Encoding", '...'); })
});

test("Date", function(){
  throws(function(){  xhr.setRequestHeader("Date", '...'); })
});

test("Expect", function(){
  throws(function(){  xhr.setRequestHeader("Expect", '...'); })
});

test("Host", function(){
  throws(function(){  xhr.setRequestHeader("Host", '...'); })
});

test("Keep-Alive", function(){
  throws(function(){  xhr.setRequestHeader("Keep-Alive", '...'); })
});

test("Referer", function(){
  throws(function(){  xhr.setRequestHeader("Referer", '...'); })
});

test("TE", function(){
  throws(function(){  xhr.setRequestHeader("TE", '...'); })
});

test("Trailer", function(){
  throws(function(){  xhr.setRequestHeader("Trailer", '...'); })
});

test("Transfer-Encoding", function(){
  throws(function(){  xhr.setRequestHeader("Transfer-Encoding", '...'); })
});

test("Upgrade", function(){
  throws(function(){  xhr.setRequestHeader("Upgrade", '...'); })
});

test("User-Agent", function(){
  throws(function(){  xhr.setRequestHeader("User-Agent", '...'); })
});

test("Via", function(){
  throws(function(){  xhr.setRequestHeader("Via", '...'); })
});
