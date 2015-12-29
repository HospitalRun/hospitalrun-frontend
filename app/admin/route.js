import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
export default AbstractModuleRoute.extend({
  addCapability: 'add_user',
  allowSearch: false,
  moduleName: 'admin',
  sectionTitle: 'Admin',
  subActions: function() {
    var options = [{
      text: 'Address Options',
      linkTo: 'admin.address'
    }, {
      text: 'Lookup Lists',
      linkTo: 'admin.lookup'
    }];
    if (this.currentUserCan('load_db')) {
      options.push({
        text: 'Load DB',
        linkTo: 'admin.loaddb'
      });
    }
    options.push({
      text: 'Users',
      linkTo: 'users.index'
    });
    return options;
  }.property(),

  editPath: function() {
    return 'users.edit';
  }.property(),

  deletePath: function() {
    return 'users.delete';
  }.property()
});
