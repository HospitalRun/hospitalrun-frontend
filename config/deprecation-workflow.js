window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: "silence", matchId: "ember-application.injected-container" },
    { handler: "silence", matchId: "ember-views.render-double-modify" },
    { handler: "silence", matchId: "ember-metal.binding" },
    { handler: "silence", matchId: "ember-views.did-init-attrs" }
  ]
};
