window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: 'silence', matchId: 'ember-getowner-polyfill.import' },
    { handler: 'silence', matchId: 'ember-views.lifecycle-hook-arguments' },
    { handler: 'throw', matchId: 'ember-rapid-forms.yielded-form' },
    { handler: 'silence', matchId: 'ember-metal.binding' },
    { handler: 'throw', matchId: 'ember-metal.ember-k' },
    { handler: 'silence', matchId: 'ember-views.did-init-attrs' }
  ]
};
