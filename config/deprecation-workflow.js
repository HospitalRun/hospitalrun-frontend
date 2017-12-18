window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: 'silence', matchId: 'ember-getowner-polyfill.import' },
    { handler: 'silence', matchId: 'ember-metal.binding' },
    { handler: 'silence', matchId: 'ember-views.did-init-attrs' },
    { handler: 'silence', matchId: 'ds.serializer.private-should-serialize-has-many' },
    { handler: 'silence', matchId: 'ember-inflector.globals' }
  ]
};
