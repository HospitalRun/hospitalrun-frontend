import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('admin', {
    resetNamespace: true
  }, function() {
    this.route('address');
    this.route('loaddb');
    this.route('lookup', { path: '/' });
    this.route('users', {
      resetNamespace: true
    }, function() {
      this.route('edit', { path: '/edit/:user_id' });
    });
    this.route('roles');
    this.route('query');
    this.route('workflow');
  });

  this.route('appointments', {
    resetNamespace: true
  }, function() {
    this.route('edit', { path: '/edit/:appointment_id' });
    this.route('search');
    this.route('today');
    this.route('missed');
  });

  this.route('finishgauth', { path: '/finishgauth/:s1/:s2/:k/:t/:i/:p' });

  this.route('index', { path: '/' });

  this.route('imaging', {
    resetNamespace: true
  }, function() {
    this.route('completed');
    this.route('edit', { path: '/edit/:imaging_id' });
  });

  this.route('inventory', {
    resetNamespace: true
  }, function() {
    this.route('barcode', { path: '/barcode/:inventory_id' });
    this.route('edit', { path: '/edit/:inventory_id' });
    this.route('batch', { path: '/batch/:inventory-batch_id' });
    this.route('listing');
    this.route('reports');
    this.route('request', { path: '/request/:inv-request_id' });
    this.route('search', { path: '/search/:search_text' });
  });

  this.route('invoices', {
    resetNamespace: true
  }, function() {
    this.route('edit', { path: '/edit/:invoice_id' });
    this.route('search', { path: '/search/:search_text' });
  });

  this.route('labs', {
    resetNamespace: true
  }, function() {
    this.route('completed');
    this.route('edit', { path: '/edit/:lab_id' });
  });

  this.route('login');

  this.route('medication', {
    resetNamespace: true
  }, function() {
    this.route('completed');
    this.route('edit', { path: '/edit/:medication_id' });
    this.route('return', { path: '/return/:inv-request_id' });
    this.route('search', { path: '/search/:search_text' });
  });

  this.route('patients', {
    resetNamespace: true
  }, function() {
    this.route('edit', { path: '/edit/:patient_id' });
    this.route('reports');
    this.route('admitted');
    this.route('search', { path: '/search/:search_text' });
  });

  this.route('pricing', {
    resetNamespace: true
  }, function() {
    this.route('imaging');
    this.route('lab');
    this.route('procedure');
    this.route('ward');
    this.route('edit', { path: '/edit/:pricing_id' });
    this.route('search', { path: '/search/:search_text' });
    this.route('profiles');
  });

  this.route('print', {
    resetNamespace: true
  }, function() {
    this.route('invoice', { path: '/invoice/:invoice_id' });
  });

  this.route('visits', {
    resetNamespace: true
  }, function() {
    this.route('edit', { path: '/edit/:visit_id' });
    this.route('procedures', {
      resetNamespace: true
    }, function() {
      this.route('edit', { path: '/edit/:procedure_id' });
    });
  });
});

export default Router;
