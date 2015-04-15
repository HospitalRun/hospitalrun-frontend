import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
    this.resource('admin', function() {
        this.route('address');
        this.route('lookup', { path: '/' });
        this.resource('users', function() {
            this.route('edit', { path: "/edit/:user_id" });
        }); 
         this.route('query');
    });
    
    this.resource('appointments', function() {
        //this.route('calendar'); //currently not working in prod build
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
        this.route('delivery', { path: "/delivery/:inv-request_id" });
        this.route('edit', { path: "/edit/:inventory_id" });
        this.route('invoice', { path: "/invoice/:inventory-invoice_id" });
        this.route('listing');
        this.route('reports');
        this.route('request', { path: "/request/:inv-request_id" });
        this.route('search', { path: "/search/:search_text" });
    });
    
    this.resource('invoices', function() {
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
        this.route('reports');
        this.route('search', { path: "/search/:search_text" });
    });
    
    this.resource('pricing', function() {
        this.route('imaging');
        this.route('lab');
        this.route('procedure');
        this.route('ward');
        this.route('edit', { path: "/edit/:pricing_id" });
        this.route('search', { path: "/search/:search_text" });
        this.route('profiles');
    });
    
    this.resource('print', function() {
        this.route('invoice', { path: "/invoice/:invoice_id" });
    });
        
    this.resource('visits', function() {
        this.route('edit', { path: "/edit/:visit_id" });
        this.resource('procedures', function() {
            this.route('edit', { path: "/edit/:procedure_id" });
        });
    });
});

export default Router;
