import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import { t } from 'hospitalrun/macro';
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
