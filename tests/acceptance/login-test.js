// import Ember from 'ember';
// import { module, test } from 'qunit';
// import startApp from 'hospitalrun/tests/helpers/start-app';
//
// module('Acceptance | login', {
//   beforeEach: function() {
//     this.application = startApp();
//   },
//
//   afterEach: function() {
//     Ember.run(this.application, 'destroy');
//   }
// });
//
// test('visiting /login', function(assert) {
//   visit('/login');
//
//   andThen(function() {
//     assert.equal(currentURL(), '/login');
//   });
//
//   return new Ember.RSVP.Promise(function(){});
// });
//
// function setupServer() {
//   server.post('/db/_session', function(){
//     return {
//       ok: true,
//       name: "hradmin",
//       roles: [
//         "System Administrator","admin","user"
//       ]
//     }
//   });
// }
