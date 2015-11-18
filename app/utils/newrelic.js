import UserSession from 'hospitalrun/mixins/user-session';
export default {
  WATCH_PATIENT: 'hr_watch_patient',
  pageAction: function(name, obj) {
    if (typeof newrelic !== 'undefined') {
      if (obj) {
        obj.userName = UserSession.getUserName();
        newrelic.addPageAction(name, obj);
      } else {
        newrelic.addPageAction(name);
      }
    }
  }
};