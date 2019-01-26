import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import { t } from 'hospitalrun/macro';
export default AbstractEditRoute.extend({
  hideNewButton: true,
  newTitle: t('admin.userRoles'),
  editTitle: t('admin.userRoles'),
  model() {
    return this.get('store').findAll('user-role');
  }
});
