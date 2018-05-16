<<<<<<< HEAD
import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';
import UserSession from 'hospitalrun/mixins/user-session';

const { get, inject } = Ember;

export default AbstractEditRoute.extend(UserSession, {
  hideNewButton: true,
  editTitle: t('admin.loaddb.editTitle'),

  database: inject.service(),

  beforeModel() {
    if (!this.currentUserCan('load_db')) {
      this.transitionTo('application');
    }
  },

  // Make sure database is available for import
  model() {
    let database = get(this, 'database');
    return database.getDBInfo().catch((err) => this.send('error', database.handleErrorResponse(err)));
  }
});
=======
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import { translationMacro as t } from 'ember-i18n';
import UserSession from 'hospitalrun/mixins/user-session';

export default AbstractEditRoute.extend(UserSession, {
  hideNewButton: true,
  editTitle: t('admin.loaddb.editTitle'),

  database: service(),

  beforeModel() {
    if (!this.currentUserCan('load_db')) {
      this.transitionTo('application');
    }
  },

  // Make sure database is available for import
  model() {
    let database = get(this, 'database');
    return database.getDBInfo().catch((err) => this.send('error', database.handleErrorResponse(err)));
  }
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
