### Ember.Test.httpRespond helper

Adds a `httpRespond` helper to Ember.Test for integration testing.
This helper chains a promise and allows you to control where in the flow
of execution an http response is emitted.

This makes it easy to test situations like:
  
  * Loading screens
  * Button disabling while requests process
  * Multiple requests to the same url
  * The effect of multiple simultaneous requests that complete in a specifc order

Using HTTP response emitting instead of the fixture feature of Ember Data or Ember Model
ensures that the entire stack of your Ember.js application is exercised during integration
testing.

## Example

```javascript
module("commenting on a post", function(){
  setup: function(){
    fakehr.start();
  },
  teardown: function(){
    fakehr.reset();
  }
});

test("people can browse to a post and leave a comment", function(){
  var comment = "I agree, Tom's hair does smell like newly fallen Portland rain."

  visit("/articles")
  .then(function(){
    equal(find(".loading-screen").length, 1);
  })
  .httpRespond("get", "/api/articles", [{id: 1, body: '...'}, {id: 2, body: '...'}])
  .then(function(){
    equal(find(".loading-screen").length, 0);
  })
  .click(".article:first")
  .fillIn(".comment-box", comment)
  .click(".comment-submit")
  .then(function(){
    equal(find(".spinner").length, 1);
  })
  .httpRespond("post", "/api/articles/1/comments", {id: 1, body: comment}, 201)
  .then(function(){
    equal(find(".comment:contains('%@')".fmt(comment)).length, 1);
  });
});
```

## Dependencies
`httpRespond` depends on [fakehr](https://github.com/trek/fakehr) and [FakeXMLHttpRequest](https://github.com/trek/FakeXMLHttpRequest). Until we live in the rosy future of standardized module and package systems, obtain both from github and load them as part of your test suite.
