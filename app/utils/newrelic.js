import UserSession from 'hospitalrun/mixins/user-session';
export default (UserSession, {
  WATCH_PATIENT: 'hr_watch_patient',
  pageAction: function(name, obj) {
    if (typeof newrelic !== 'undefined') {
      if (obj) {
        obj.userName = this.getUserName();
        newrelic.addPageAction(name, obj);
      } else {
        newrelic.addPageAction(name);
      }
    }
  }
});