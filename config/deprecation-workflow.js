<<<<<<< HEAD
window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: 'silence', matchId: 'ember-getowner-polyfill.import' },
    { handler: 'silence', matchId: 'ember-metal.binding' },
    { handler: 'silence', matchId: 'ember-views.did-init-attrs' },
    { handler: 'silence', matchId: 'ds.serializer.private-should-serialize-has-many' }
  ]
};
=======
window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: 'silence', matchId: 'ember-getowner-polyfill.import' },
    { handler: 'silence', matchId: 'ember-views.did-init-attrs' }
  ]
};
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
