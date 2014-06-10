import AbstractItemRoute from 'hospitalrun/routes/abstract-item-route';
export default AbstractItemRoute.extend({
    allowSearch: false,
    currentScreenTitle: 'User Listing',
    editTitle: 'Edit User',    
    newTitle: 'New User',
    modelName: 'user',
    moduleName: 'users',
    newButtonText: '+ new user',
    sectionTitle: 'Users'
});