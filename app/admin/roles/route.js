import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import { translationMacro as t } from 'ember-i18n';
export default AbstractEditRoute.extend({
  hideNewButton: true,
  newTitle: t('admin.userRoles'),
  editTitle: t('admin.userRoles'),
  model() {
    return this.get('store').findAll('user-role');
  }
});
