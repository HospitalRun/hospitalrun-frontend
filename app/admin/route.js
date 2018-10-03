import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
import { computed } from '@ember/object';

export default AbstractModuleRoute.extend({
  addCapability: 'add_user',
  allowSearch: false,
  moduleName: 'admin',
  sectionTitle: 'Admin',

  editPath: computed(function() {
    return 'users.edit';
  }),

  deletePath: computed(function() {
    return 'users.delete';
  })
});
