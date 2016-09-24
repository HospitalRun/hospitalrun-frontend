import buildRoutes from 'ember-engines/routes';

export default buildRoutes(function() {

  this.route('invoices', {
    resetNamespace: true
  }, function() {
    this.route('edit', { path: '/edit/:invoice_id' });
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

});
