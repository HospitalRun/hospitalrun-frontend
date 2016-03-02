import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
export default AbstractModuleRoute.extend({
  addCapability: 'add_user',
  allowSearch: false,
  moduleName: 'admin',
  sectionTitle: 'Admin',
  subActions: function() {
    var options = [{
      text: this.get('i18n').t('admin.address_options'),
      linkTo: 'admin.address'
    }, {
      text: this.get('i18n').t('admin.lookup_lists'),
      linkTo: 'admin.lookup'
    }];
    if (this.currentUserCan('load_db')) {
      options.push({
        text: this.get('i18n').t('admin.load_db'),
        linkTo: 'admin.loaddb'
      });
    }
    options.push({
      text: this.get('i18n').t('admin.users'),
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
