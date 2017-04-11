import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('admin', function() {
    this.route('address');
    this.route('print-header');
    this.route('custom-forms', function() {
      this.route('edit', { path: '/edit/:custom-form_id' });
    });
    this.route('loaddb');
    this.route('inc-category', {
      resetNamespace: true
    }, function() {
      this.route('edit', { path: '/edit/:inc-category_id' });
    });
    this.route('lookup', { path: '/' });
    this.route('users', {
      resetNamespace: true
    }, function() {
      this.route('edit', { path: '/edit/:user_id' });
    });
    this.route('roles');
    this.route('query');
    this.route('visit-forms');
    this.route('workflow');
  });

  this.route('appointments', function() {
    this.route('edit', { path: '/edit/:appointment_id' });
    this.route('search');
    this.route('today');
    this.route('calendar');
    this.route('theater');
  });

  this.route('finishgauth', { path: '/finishgauth/:s1/:s2/:k/:t/:i/:p' });

  this.route('index', { path: '/' });

  this.route('imaging', function() {
    this.route('completed');
    this.route('edit', { path: '/edit/:imaging_id' });
  });

  this.route('inventory', function() {
    this.route('barcode', { path: '/barcode/:inventory_id' });
    this.route('edit', { path: '/edit/:inventory_id' });
    this.route('batch', { path: '/batch/:inventory-batch_id' });
    this.route('listing');
    this.route('reports');
    this.route('request', { path: '/request/:inv-request_id' });
    this.route('search', { path: '/search/:search_text' });
  });

  this.route('incident', function() {
    this.route('completed');
    this.route('edit', { path: '/edit/:incident_id' });
    this.route('reports');
  });

  this.route('invoices', function() {
    this.route('cashier');
    this.route('edit', { path: '/edit/:invoice_id' });
    this.route('search', { path: '/search/:search_text' });
  });

  this.route('labs', function() {
    this.route('completed');
    this.route('edit', { path: '/edit/:lab_id' });
  });

  this.route('login');

  this.route('medication', function() {
    this.route('completed');
    this.route('edit', { path: '/edit/:medication_id' });
    this.route('return', { path: '/return/:inv-request_id' });
    this.route('search', { path: '/search/:search_text' });
  });

  this.route('patients', function() {
    this.route('edit', { path: '/edit/:patient_id' });
    this.route('reports');
    this.route('admitted');
    this.route('search', { path: '/search/:search_text' });
    this.route('operative-plan', { path: '/operative-plan/:operative-plan_id' });
    this.route('operation-report', { path: '/operation-report/:operation-report_id' });
    this.route('outpatient');
  });

  this.route('pricing', function() {
    this.route('imaging');
    this.route('lab');
    this.route('procedure');
    this.route('ward');
    this.route('edit', { path: '/edit/:pricing_id' });
    this.route('search', { path: '/search/:search_text' });
    this.route('profiles');
  });

  this.route('print', function() {
    this.route('invoice', { path: '/invoice/:invoice_id' });
  });

  this.route('visits', function() {
    this.route('edit', { path: '/edit/:visit_id' });
    this.route('procedures', {
      resetNamespace: true
    }, function() {
      this.route('edit', { path: '/edit/:procedure_id' });
    });
    this.route('reports', function() {
      this.route('edit', { path: '/edit/:report_id' });
    });

  });
});

export default Router;
