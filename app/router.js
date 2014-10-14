import Ember from 'ember';

var Router = Ember.Router.extend({
  location: HospitalrunENV.locationType
});

Router.map(function() {
    this.resource('admin', function() {
        this.route('lookup', { path: '/' });
        this.resource('users', function() {
            this.route('edit', { path: "/edit/:user_id" });
        });        
    });
    
    this.resource('appointments', function() {
        this.route('calendar');
        this.route('edit', { path: "/edit/:appointment_id" });
        this.route('search');
        this.route('today');
    });
    
    this.route('finishgauth', { path: "/finishgauth/:s1/:s2/:k/:t/:i/:p" });
    
    this.route('index', { path: '/' });
    
    this.resource('imaging', function() {
        this.route('completed');
        this.route('edit', { path: "/edit/:imaging_id" });
    });   
    
    this.resource('inventory', function() {
        this.route('barcode', { path: "/barcode/:inventory_id" });
        this.route('completed');
        this.route('delivery', { path: "/delivery/:inv-request_id" });
        this.route('edit', { path: "/edit/:inventory_id" });
        this.route('listing');
        this.route('reports');
        this.route('request', { path: "/request/:inv-request_id" });
        this.route('search', { path: "/search/:search_text" });
    });
    
    this.resource('invoices', { path: '/invoice' }, function() {
        this.route('edit', { path: "/edit/:invoice_id" });
        this.route('search', { path: "/search/:search_text" });
    });
    
    this.resource('labs', function() {
        this.route('completed');
        this.route('edit', { path: "/edit/:lab_id" });
    });    
    
    this.route('login');

    this.resource('medication', function() {
        this.route('completed');
        this.route('edit', { path: "/edit/:medication_id" });
        this.route('search', { path: "/search/:search_text" });
    });
    
    this.resource('patients', function() {
        this.route('edit', { path: "/edit/:patient_id" });
        this.route('search', { path: "/search/:search_text" });
    });
        
    this.resource('visits', function() {
        this.route('edit', { path: "/edit/:visit_id" });
    });
});

export default Router;
