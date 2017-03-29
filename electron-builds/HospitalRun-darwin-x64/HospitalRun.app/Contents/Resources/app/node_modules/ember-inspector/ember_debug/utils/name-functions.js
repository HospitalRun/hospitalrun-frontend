/**
 * Returns a medium sized model name. Makes sure it's maximum 50 characters long.
 *
 * @method modelName
 * @param  {Any} model
 * @return {String}       The model name.
 */
export function modelName(model) {
  let name = '<Unknown model>';
  if (model.toString) {
    name = model.toString();
  }

  if (name.length > 50) {
    name = `${name.substr(0, 50)}...`;
  }
  return name;
}

/**
 * Takes an Ember Data model and strips out the extra noise from the name.
 *
 * @method shortModelName
 * @param  {DS.Model} model
 * @return {String}       The concise model name.
 */
export function shortModelName(model) {
  let name = modelName(model);
  // jj-abrams-resolver adds `app@model:`
  return name.replace(/<[^>]+@model:/g, '<');
}

/**
 * Returns the controller name. Strips out extra noise such as `subclass of`.
 *
 * @method controllerName
 * @param  {Controller} controller
 * @return {String}            The controller name
 */
export function controllerName(controller) {
  let className = controller.constructor.toString();
  let match = className.match(/^\(subclass of (.*)\)/);
  if (match) {
    className = match[1];
  }
  return className;
}

/**
 * Cleans up the controller name before returning it.
 *
 * @method shortControllerName
 * @param  {Controller} controller
 * @return {String}            The short controller name
 */
export function shortControllerName(controller) {
  let name = controllerName(controller);
  // jj-abrams-resolver adds `app@controller:` at the begining and `:` at the end
  return name.replace(/^.+@controller:/, '').replace(/:$/, '');
}

/**
 * Cleans up the view name before returning it.
 *
 * @method shortViewName
 * @param  {Component} view The component.
 * @return {String}      The short view name.
 */
export function shortViewName(view) {
  let name = viewName(view);
  // jj-abrams-resolver adds `app@view:` and `app@component:`
  // Also `_debugContainerKey` has the format `type-key:factory-name`
  return name.replace(/.*(view|component):(?!$)/, '').replace(/:$/, '');
}

/**
 * Returns the view name. Removes the `subclass` noise.
 *
 * @method viewName
 * @param  {Component} view The component.
 * @return {String}      The view name.
 */
export function viewName(view) {
  let name = view.constructor.toString();

  let match = name.match(/\(subclass of (.*)\)/);
  if (match) {
    name = match[1];
  }
  return name;
}
