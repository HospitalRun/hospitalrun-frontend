var Router = Ember.Router.extend({
  location: 'auto'
});

Router.map(function() {
    this.route('index', { path: '/' });
    this.route('protected');
    this.route('login');
    
    this.resource('users', { path: '/users' }, function() {
        // additional child routes    
    });
    
    this.resource('inventory', { path: '/inventory' }, function() {
        this.route('search');
        this.route('new');
    });
    
    this.resource('medication', { path: '/medication' }, function() {
        this.route('search');
        this.route('new');
    });
});

export default Router;
