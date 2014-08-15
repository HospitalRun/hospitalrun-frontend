import Ember from 'ember';

var Router = Ember.Router.extend({
  location: HospitalrunENV.locationType
});

Router.map(function() {
    this.route('index', { path: '/' });
    this.route('protected');
    this.route('login');
    
    this.resource('users', function() {
        this.route('edit', { path: "/edit/:user_id" });
    });
    
    this.resource('inventory', function() {
        this.route('barcode', { path: "/barcode/:inventory_id" });
        this.route('completed');
        this.route('delivery', { path: "/delivery/:inv-request_id" });
        this.route('edit', { path: "/edit/:inventory_id" });
        this.route('listing');
        this.route('request', { path: "/request/:inv-request_id" });
        this.route('search', { path: "/search/:search_text" });
    });
    
    this.resource('invoices', { path: '/invoice' }, function() {
        this.route('edit', { path: "/edit/:invoice_id" });
        this.route('search', { path: "/search/:search_text" });
    });
    
    this.resource('medication', function() {
        this.route('edit', { path: "/edit/:medication_id" });
        this.route('search', { path: "/search/:search_text" });
    });
    
    this.resource('patients', function() {
        this.route('edit', { path: "/edit/:patient_id" });
        this.route('search', { path: "/search/:search_text" });
    });

    this.resource('appointments', function() {
        this.route('calendar');
        this.route('edit', { path: "/edit/:appointment_id" });
        this.route('search', { path: "/search/:search_text" });
    });
    
    this.resource('visits', function() {
        this.route('edit', { path: "/edit/:visit_id" });
    });
});

export default Router;
