export default {
  name: 'authentication',

  initialize: function (container, application) {
    application.inject('model', 'session', 'simple-auth-session:main');
    application.inject('adapter', 'session', 'simple-auth-session:main');
  }
};
