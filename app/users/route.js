import AbstractItemRoute from 'hospitalrun/routes/abstract-item-route';
export default AbstractItemRoute.extend({
    allowSearch: false,
    modelName: 'user',
    moduleName: 'users',
    newButtonText: '+ new user',
    sectionTitle: 'Users'
});