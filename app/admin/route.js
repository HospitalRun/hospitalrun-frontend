import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
export default AbstractModuleRoute.extend({
    addCapability: 'add_user',
    allowSearch: false,
    moduleName: 'admin',
    sectionTitle: 'Admin',
    subActions: [{
        text: 'Address Options',
        linkTo: 'admin.address'        
    },{
        text: 'Lookup Lists',
        linkTo: 'admin.lookup'
    },{
        text: 'Users',
        linkTo: 'users.index'
    }],
    
    editPath: function() {
        return 'users.edit';
    }.property(),
    
    deletePath: function() {
        return 'users.delete';    
    }.property()
});