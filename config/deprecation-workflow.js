window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: "silence", matchMessage: "Ember.create is deprecated in favor of Object.create" },
    { handler: "silence", matchMessage: "`lookup` was called on a Registry. The `initializer` API no longer receives a container, and you should use an `instanceInitializer` to look up objects from the container." },
    { handler: "silence", matchMessage: "The LoginControllerMixin is deprecated. Use the session's authenticate method directly instead." },
    { handler: "silence", matchMessage: "The AuthenticationControllerMixin is deprecated. Use the session's authenticate method directly instead." },
    { handler: "silence", matchMessage: "`Ember.ArrayController` is deprecated." },
    { handler: "silence", matchMessage: "ember-get-helper has been included in Ember 2.0. Use of this package is deprecated." },
    { handler: "silence", matchMessage: "Ember.ObjectController is deprecated, please use Ember.Controller and use `model.propertyName`." },
    { handler: "throw", matchMessage: "You attempted to access `patient` from `<hospitalrun@controller:appointments/edit::ember1760>`, but object proxying is deprecated. Please use `model.patient` instead." },
    { handler: "throw", matchMessage: "You attempted to access `id` from `<hospitalrun@controller:appointments/edit::ember1760>`, but object proxying is deprecated. Please use `model.id` instead." },
    { handler: "throw", matchMessage: "You attempted to access `isNew` from `<hospitalrun@controller:appointments/edit::ember1760>`, but object proxying is deprecated. Please use `model.isNew` instead." },
    { handler: "silence", matchMessage: "You tried to look up 'store:main', but this has been deprecated in favor of 'service:store'." },
    { handler: "silence", matchMessage: "Using store.getById() has been deprecated. Use store.peekRecord to get a record by a given type and ID without triggering a fetch." },
    { handler: "silence", matchMessage: "DS.Model#isDirty has been deprecated please use hasDirtyAttributes instead" }
  ]
};
