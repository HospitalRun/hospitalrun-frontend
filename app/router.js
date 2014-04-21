var Router = Ember.Router.extend(); // ensure we don't share routes between all Router instances

Router.map(function() {    
    this.route('index', { path: '/' });
    this.route('protected');
    this.route('login');
    
    this.resource('users', { path: '/users' }, function() {
        // additional child routes    
    });
    
    this.resource('inventory', { path: '/inventory' }, function() {
        this.route('search', {path: '/search'});
    });
    
});

export default Router;
