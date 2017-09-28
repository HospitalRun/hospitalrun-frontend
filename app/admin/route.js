import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
export default AbstractModuleRoute.extend({
  addCapability: 'add_user',
  allowSearch: false,
  moduleName: 'admin',
  sectionTitle: 'Admin',

  //edit information user
  editPath: function() {
    return 'users.edit';
  }.property(),

  // delete data user
  deletePath: function() {
    return 'users.delete';
  }.property()
});
