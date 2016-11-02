import Ember from 'ember';
export default Ember.Mixin.create({
  session: Ember.inject.service(),
  _pouchError: function(reject) {
    return function(err) {
      if (err.status === 401) {
        // User is unauthorized; reload to force login.
        let session = this.get('session');
        if (!Ember.isEmpty(session) && session.get('isAuthenticated')) {
          session.invalidate();
        }
      }
      let errmsg = [err.status,
        `${(err.name || err.error)}:`,
        (err.message || err.reason)
      ].join(' ');
      Ember.run(null, reject, errmsg);
    }.bind(this);
  }
});
