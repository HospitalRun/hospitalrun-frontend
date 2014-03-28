var Router = Ember.Router.extend(Ember.SimpleAuth.ApplicationRouteMixin,{
}); // ensure we don't share routes between all Router instances

Router.map(function() {    
    this.route('index', { path: '/' });
    this.route('protected');
    this.route('login');
    
    this.resource('users', { path: '/users' }, function() {
        // additional child routes    
    });
});

export default Router;
