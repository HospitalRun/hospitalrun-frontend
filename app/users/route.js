import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
export default AbstractModuleRoute.extend({
    addCapability: 'add_user',    
    allowSearch: false,
    modelName: 'user',
    moduleName: 'users',
    newButtonText: '+ new user',
    sectionTitle: 'Users'
});