window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: 'silence', matchId: 'ember-getowner-polyfill.import' },
    { handler: 'silence', matchId: 'ember-views.did-init-attrs' }
  ]
};
