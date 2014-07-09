import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
export default AbstractModuleRoute.extend({
    allowSearch: false,
    modelName: 'user',
    moduleName: 'users',
    newButtonText: '+ new user',
    sectionTitle: 'Users'
});