import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import UserSession from 'hospitalrun/mixins/user-session';
export default AbstractIndexRoute.extend(UserSession, {
  newButtonAction: function() {
    if (this.currentUserCan('add_user')) {
      return 'newItem';
    } else {
      return null;
    }
  }.property(),
  newButtonText: '+ new user',
  pageTitle: 'User Listing',
  model: function() {
    return this.store.find('user');
  }
});
