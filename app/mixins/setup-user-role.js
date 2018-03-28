import Mixin from '@ember/object/mixin';
export default Mixin.create({
  setupUserRole() {
    let session = this.get('session');
    let userRole = session.get('data.authenticated.role');
    return this.get('store').find('user-role', userRole.dasherize()).then((userCaps) => {
      session.set('data.authenticated.userCaps', userCaps.get('capabilities'));
      let sessionStore = session.get('store');
      let sessionData = session.get('data');
      sessionStore.persist(sessionData);
      return true;
    }).catch(function() {});
  }
});