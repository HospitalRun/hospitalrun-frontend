import Ember from 'ember';
export default Ember.Mixin.create({
  setupUserRole() {
    const session = this.get('session');
    const userRole = session.get('data.authenticated.role');
    return this.get('store').find('user-role', userRole.dasherize()).then((userCaps) => {
      session.set('data.authenticated.userCaps', userCaps.get('capabilities'));
      let sessionStore = session.get('store');
      let sessionData = session.get('data');
      console.log('Saving sessionData', sessionData);
      sessionStore.persist(sessionData);
      return true;
    }).catch(Ember.K);
  }
});
