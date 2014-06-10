var Router = Ember.Router.extend({
  location: ENV.locationType
});

Router.map(function() {
    this.route('index', { path: '/' });
    this.route('protected');
    this.route('login');
    
    this.resource('users', { path: '/users' }, function() {
        this.route('edit', { path: "/edit/:user_id" });
    });
    
    this.resource('inventory', { path: '/inventory' }, function() {
        this.route('barcode', { path: "/barcode/:inventory_id" });
        this.route('edit', { path: "/edit/:inventory_id" });
        this.route('search', { path: "/search/:search_text" });
    });
    
    this.resource('medication', { path: '/medication' }, function() {
        this.route('edit', { path: "/edit/:medication_id" });
        this.route('search', { path: "/search/:search_text" });
    });
    
    this.resource('patients', { path: '/patients' }, function() {
        this.route('edit', { path: "/edit/:patient_id" });
        this.route('search', { path: "/search/:search_text" });
    });
    
});

export default Router;
