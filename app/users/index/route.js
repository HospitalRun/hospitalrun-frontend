<<<<<<< HEAD
import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import UserSession from 'hospitalrun/mixins/user-session';
import { translationMacro as t } from 'ember-i18n';
import Ember from 'ember';
const {
  inject
} = Ember;
export default AbstractIndexRoute.extend(UserSession, {
  config: inject.service(),
  newButtonAction: function() {
    if (this.currentUserCan('add_user')) {
      return 'newItem';
    } else {
      return null;
    }
  }.property(),
  newButtonText: t('user.plusNewUser'),
  pageTitle: t('user.usersPageTile'),
  model() {
    return this.store.findAll('user');
  }
});
=======
import { inject as service } from '@ember/service';
import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import UserSession from 'hospitalrun/mixins/user-session';
import { translationMacro as t } from 'ember-i18n';
export default AbstractIndexRoute.extend(UserSession, {
  config: service(),
  newButtonAction: function() {
    if (this.currentUserCan('add_user')) {
      return 'newItem';
    } else {
      return null;
    }
  }.property(),
  newButtonText: t('user.plusNewUser'),
  pageTitle: t('user.usersPageTile'),
  model() {
    return this.store.findAll('user');
  }
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
