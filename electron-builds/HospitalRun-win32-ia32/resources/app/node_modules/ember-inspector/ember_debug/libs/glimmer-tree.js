/**
 * This class contains functionality related to for Ember versions
 * using Glimmer 2 (Ember >= 2.9):
 *
 * It has the following main responsibilities:
 *
 * - Building the view tree.
 * - Highlighting components/outlets when the view tree is hovered.
 * - Highlighting components/outlets when the views themselves are hovered.
 * - Finding the model of a specific outlet/component.
 *
 * The view tree is a hierarchy of nodes (optionally) containing the following info:
 * - name
 * - template
 * - id
 * - view class
 * - duration
 * - tag name
 * - model
 * - controller
 * - type
 *
 * Once the view tree is generated it can be sent to the Ember Inspector to be displayed.
 *
 * @class GlimmerTree
 */
const Ember = window.Ember;
import {
  modelName as getModelName,
  shortModelName as getShortModelName,
  controllerName as getControllerName,
  shortControllerName as getShortControllerName,
  viewName as getViewName,
  shortViewName as getShortViewName
} from 'ember-debug/utils/name-functions';

const { Object: EmberObject, typeOf, isNone, Controller, ViewUtils, get, A } = Ember;
const { getRootViews, getChildViews, getViewBoundingClientRect } = ViewUtils;

export default class {
  /**
   * Sets up the initial options.
   *
   * @method constructor
   * @param {Object} options
   *  - {Container}  container       The Ember app's container.
   *  - {Function}   retainObject    Called to retain an object for future inspection.
   *  - {Object}     options         Options whether to show components or not.
   *  - {Object}     durations       Hash containing time to render per view id.
   *  - {Function}   highlightRange  Called to highlight a range of elements.
   *  - {Object}     ObjectInspector Used to inspect models.
   *  - {Object}     viewRegistry    Hash containing all currently rendered components by id.
   */
  constructor({
    container,
    retainObject,
    options,
    durations,
    highlightRange,
    objectInspector,
    viewRegistry
  }) {
    this.container = container;
    this.retainObject = retainObject;
    this.options = options;
    this.durations = durations;
    this.highlightRange = highlightRange;
    this.objectInspector = objectInspector;
    this.viewRegistry = viewRegistry;
  }

  /**
   * @method updateOptions
   * @param {Object} options
   */
  updateOptions(options) {
    this.options = options;
  }

  /**
   * @method updateDurations
   * @param {Object} durations
   */
  updateDurations(durations) {
    this.duations = durations;
  }

  /**
   * Builds the view tree. The view tree may or may not contain
   * components depending on the current options.
   *
   * The view tree has the top level outlet as the root of the tree.
   * The format is:
   * {
   *   value: |hash of properties|,
   *   children: [
   *   {
   *     value: |hash of properties|,
   *     children: []
   *   },
   *   {
   *     value: |hash of properties|,
   *     children: [...]
   *   }]
   * }
   *
   * We are building the tree is by doing the following steps:
   * - Build the outlet tree by walking the outlet state.
   * - Build several component trees, each tree belonging to one controller.
   * - Assign each controller-specific component tree as a child of the outlet corresponding
   * to that specific controller.
   *
   * @method build
   * @return {Object}  The view tree
   */
  build() {
    if (this.getRoot()) {
      let outletTree = this.buildOutletTree();
      let componentTrees = this.options.components ? this.buildComponentTrees(outletTree) : [];
      return this.addComponentsToOutlets(outletTree, componentTrees);
    }
  }

  /**
   * Starts with the root and walks the tree till
   * the leaf outlets. The format is:
   * {
   *   value: |inspected outlet|,
   *   children:
   *   [
   *    {
   *      value: |inspected outlet|,
   *      children: [...]
   *    }
   *   ]
   * }
   *
   * @method buildOutletTree
   * @return {Object}  Tree of inspected outlets
   */
  buildOutletTree() {
    let outletTree = this.makeOutletTree(this.getApplicationOutlet());

    // set root element's id
    let rootElement = this.elementForRoot();
    outletTree.value.elementId = rootElement.getAttribute('id');
    outletTree.value.tagName = 'div';

    return outletTree;
  }

  /**
   * The recursive part of building the outlet tree.
   *
   * Return format:
   * {
   *   value: |inspected outlet|
   *   controller: |controller instance|
   *   children: [...]
   * }
   *
   * @method makeOutletTree
   * @param  {Object} outletState
   * @return {Object}             The inspected outlet tree
   */
  makeOutletTree(outletState) {
    let { render: { controller }, outlets } = outletState;
    let node = { value: this.inspectOutlet(outletState), controller, children: [] };
    for (let key in outlets) {
      node.children.push(this.makeOutletTree(outlets[key]));
    }
    return node;
  }

  /**
   * Builds the component trees. Each tree corresponds to one controller.
   * A component's controller is determined by its target (or ancestor's target).
   *
   * Has the following format:
   * {
   *   controller: |The controller instance|,
   *   components: [|component tree|]
   * }
   *
   * @method buildComponentTrees
   * @param  {Object} outletTree
   * @return {Array}  The component tree
   */
  buildComponentTrees(outletTree) {
    let controllers = this.controllersFromOutletTree(outletTree);

    return controllers.map(controller => {
      let components = this.componentsForController(this.topComponents(), controller);
      return { controller, components };
    });
  }

  /**
   * Builds a tree of components that have a specific controller
   * as their target. If a component does not match the given
   * controller, we ignore it and move on to its children.
   *
   * Format:
   * [
   *   {
   *     value: |inspected component|,
   *     children: [...]
   *   },
   *   {
   *     value: |inspected component|
   *     children: [{
   *       value: |inspected component|
   *       children: [...]
   *     }]
   *   }
   * ]
   *
   * @method componentsForController
   * @param  {Array} components Subtree of components
   * @param  {Controller} controller
   * @return {Array}  Array of inspected components
   */
  componentsForController(components, controller) {
    let arr = [];
    components.forEach(component => {
      let currentController = this.controllerForComponent(component);
      if (!currentController) {
        return;
      }

      let children = this.componentsForController(this.childComponents(component), controller);
      if (currentController === controller) {
        arr.push({ value: this.inspectComponent(component), children });
      } else {
        arr = arr.concat(children);
      }
    });
    return arr;
  }

  /**
   * Given a component, return its children.
   *
   * @method childComponents
   * @param  {Component} component The parent component
   * @return {Array}  Array of components (children)
   */
  childComponents(component) {
    return getChildViews(component);
  }

  /**
   * Get the top level components.
   *
   * @method topComponents
   * @return {Array}  Array of components
   */
  topComponents() {
    return getRootViews(this.container.owner);
  }

  /**
   * Assign each component tree to it matching outlet
   * by comparing controllers.
   *
   * Return format:
   * {
   *   value: |inspected root outlet|
   *   children: [
   *     {
   *       value: |inspected outlet or component|
   *       chidren: [...]
   *     },
   *     {
   *       value: |inspected outlet or component|
   *       chidren: [...]
   *     }
   *   ]
   * }
   *
   * @method addComponentsToOutlets
   * @param {Object} outletTree
   * @param {Object} componentTrees
   */
  addComponentsToOutlets(outletTree, componentTrees) {
    let { value, controller, children } = outletTree;
    children = children.map(child => this.addComponentsToOutlets(child, componentTrees));
    let { components } = A(componentTrees).findBy('controller', controller) || { components: [] };
    return { value, children: children.concat(components) };
  }

  /**
   * @method controllersFromOutletTree
   *
   * @param  {Controller} inspectedOutlet
   * @return {Array} List of controllers
   */
  controllersFromOutletTree({ controller, children }) {
    return [controller].concat(...children.map(this.controllersFromOutletTree.bind(this)));
  }

  /**
   * @method getRouter
   * @return {Router}
   */
  getRouter() {
    return this.container.lookup('router:main');
  }

  /**
   * Returns the current top level view.
   *
   * @method getRoot
   * @return {OutletView}
   */
  getRoot() {
    return this.getRouter().get('_toplevelView');
  }

  /**
   * Returns the application (top) outlet.
   *
   * @return {Object} The application outlet state
   */
  getApplicationOutlet() {
    return this.getRoot().outletState.outlets.main;
  }

  /**
   * The root's DOM element. The root is the only outlet view
   * with a DOM element.
   *
   * @method elementForRoot
   * @return {Element}
   */
  elementForRoot() {
    let renderer = this.container.lookup('renderer:-dom');
    return renderer._roots && renderer._roots[0] && renderer._roots[0].result && renderer._roots[0].result.firstNode();
  }

  /**
   * Returns a component's template name.
   *
   * @method templateForComponent
   * @param  {Component} component
   * @return {String}              The template name
   */
  templateForComponent(component) {
    let template = component.get('layoutName');

    if (!template) {
      let layout = component.get('layout');
      if (layout) {
        layout = this.getGlimmerEnvironment().getTemplate(layout);
      } else {
        let componentName = component.get('_debugContainerKey');
        if (componentName) {
          let layoutName = componentName.replace(/component:/, 'template:components/');
          layout = this.container.lookup(layoutName);
        }
      }
      template = this.nameFromLayout(layout);
    }
    return template;
  }

  /**
   * Inspects and outlet state. Extracts the name, controller, template,
   * and model.
   *
   * @method inspectOutlet
   * @param  {Object} outlet The outlet state
   * @return {Object}        The inspected outlet
   */
  inspectOutlet(outlet) {
    let name = this.nameForOutlet(outlet);
    let template = this.templateForOutlet(outlet);
    let controller = this.controllerForOutlet(outlet);
    let value = {
      controller: this.inspectController(controller),
      template,
      name,
      isComponent: false,
      // Outlets (except root) don't have elements
      tagName: ''
    };

    let model = controller.get('model');
    if (model) {
      value.model = this.inspectModel(model);
    }
    return value;
  }

  /**
   * Represents the controller as a short and long name + guid.
   *
   * @method inspectController
   * @param  {Controller} controller
   * @return {Object}               The inspected controller.
   */
  inspectController(controller) {
    return {
      name: getShortControllerName(controller),
      completeName: getControllerName(controller),
      objectId: this.retainObject(controller)
    };
  }

  /**
   * Represent a component as a hash containing a template,
   * name, objectId, class, render duration, tag, model.
   *
   * @method inspectComponent
   * @param  {Component} component
   * @return {Object}             The inspected component
   */
  inspectComponent(component) {
    let viewClass = getShortViewName(component);
    let completeViewClass = getViewName(component);
    let tagName = component.get('tagName');
    let objectId = this.retainObject(component);
    let duration = this.durations[objectId];

    let name = getShortViewName(component);
    let template = this.templateForComponent(component);

    let value = {
      template,
      name,
      objectId,
      viewClass,
      duration,
      completeViewClass,
      isComponent: true,
      tagName: isNone(tagName) ? 'div' : tagName
    };

    let model = this.modelForComponent(component);
    if (model) {
      value.model = this.inspectModel(model);
    }

    return value;
  }

  /**
   * Simply returns the component's model if it
   * has one.
   *
   * @method modelForComponent
   * @param  {Component} component
   * @return {Any}            The model property
   */
  modelForComponent(component) {
    return component.get('model');
  }

  /**
   * Represent a model as a short name, long name,
   * guid, and type.
   *
   * @method inspectModel
   * @param  {Any} model
   * @return {Object}       The inspected model.
   */
  inspectModel(model) {
    if (EmberObject.detectInstance(model) || typeOf(model) === 'array') {
      return {
        name: getShortModelName(model),
        completeName: getModelName(model),
        objectId: this.retainObject(model),
        type: 'type-ember-object'
      };
    }
    return {
      name: this.objectInspector.inspect(model),
      type: `type-${typeOf(model)}`
    };
  }

  /**
   * Uses the module name that was set during compilation.
   *
   * @method nameFromLayout
   * @param  {Layout} layout
   * @return {String}        The layout's name
   */
  nameFromLayout(layout) {
    let moduleName = layout && get(layout, 'meta.moduleName');
    if (moduleName) {
      return moduleName.replace(/\.hbs$/, '');
    }
  }

  /**
   * Taekes an outlet state and extracts the controller from it.
   *
   * @method controllerForOutlet
   * @param  {Controller} outletState
   * @return {Controller}
   */
  controllerForOutlet(outletState) {
    return outletState.render.controller;
  }

  /**
   * The outlet's name.
   *
   * @method nameForOutlet
   * @param  {Object} outletState
   * @return {String}
   */
  nameForOutlet(outletState) {
    return outletState.render.name;
  }

  /**
   * The outlet's template name. Uses the module name attached during compilation.
   *
   * @method templateForOutlet
   * @param  {Object} outletState
   * @return {String}             The template name
   */
  templateForOutlet(outletState) {
    let template = outletState.render.template;
    return this.nameFromLayout(template);
  }

  /**
   * Returns a component's controller. The controller is either the component's
   * target object, or the target object of one of its ancestors. That is why
   * the method is recursive.
   *
   * @method controllerForComponent
   * @param  {Component} component
   * @return {Controller}           The target controller.
   */
  controllerForComponent(component) {
    let controller = component.get('_targetObject');
    if (!controller) {
      return null;
    }

    if (controller instanceof Controller) {
      return controller;
    } else {
      return this.controllerForComponent(controller);
    }
  }

  /**
   * The glimmer environment is needed for looking up templates.
   *
   * @method getGlimmerEnvironment
   * @return {Class} The glimmer environment
   */
  getGlimmerEnvironment() {
    return this.container.lookup('service:-glimmer-environment');
  }

  /**
   * Renders a rectangle around a component's element. This happens
   * when the user either hovers over the view tree components
   * or clicks on the "inspect" magnifying glass and starts
   * hovering over the components themselves.
   *
   * Pass `isPreview` if you want the highlight to be hidden
   * when the mouse leaves the component. Set `isPreview` to false
   * to render a [permanent] rectangle until the (x) button is clicked.
   *
   *
   * @method highlightComponent
   * @param  {Element}  element   The element to highlight
   * @param  {Boolean} isPreview Whether it's a preview or not
   */
  highlightComponent(component, isPreview = false) {

    let rect = getViewBoundingClientRect(component);

    let options = {
      isPreview,
      view: {
        name: getViewName(component),
        object: component
      }
    };

    let templateName = this.templateForComponent(component);
    if (templateName) {
      options.template = {
        name: templateName
      };
    }

    this.highlightRange(rect, options);
  }

  /**
   * Renders a rectangle around the top level outlet's element. This happens
   * when the user either hovers over the view tree root outlets
   * or clicks on the "inspect" magnifying glass and starts
   * hovering over the application template.
   *
   * Pass `isPreview` if you want the highlight to be hidden
   * when the mouse leaves the root. Set `isPreview` to false
   * to render a [permanent] rectangle until the (x) button is clicked.
   *
   * @method highlightRoot
   * @param  {Boolean} isPreview
   */
  highlightRoot(isPreview = false) {
    let applicationOutlet = this.getApplicationOutlet();
    let element = this.elementForRoot();

    if (!element) { return; }

    let options = {
      isPreview,
      element,
      template: {
        name: this.templateForOutlet(applicationOutlet)
      }
    };

    let controller = this.controllerForOutlet(applicationOutlet);
    if (controller) {
      options.controller = {
        name: getControllerName(controller),
        object: controller
      };

      let model = controller.get('model');
      if (model) {
        let modelName = this.objectInspector.inspect(model);
        options.model = {
          name: modelName,
          object: model
        };
      }
    }

    let rect = this.getBoundingClientRect(element);
    this.highlightRange(rect, options);
  }

  /**
   * Same as `ViewUtils.getBoundingClientRect` except this applies to
   * HTML elements instead of components.
   *
   * @method getBoundingClientRect
   * @param  {Element} element
   * @return {DOMRect
   */
  getBoundingClientRect(element) {
    let range = document.createRange();
    range.setStartBefore(element);
    range.setEndAfter(element);

    return range.getBoundingClientRect();
  }

  /**
   * Highlight an element only if it is a root.
   *
   * @method highlightIfRoot
   * @param  {String} elementId
   * @param isPreview
   */
  highlightIfRoot(elementId, isPreview = false) {
    let element = document.getElementById(elementId);
    if (this.isRootElement(element)) {
      this.highlightRoot(isPreview);
    }
  }

  /**
   * Call this method when you have the id of an element you want
   * to highlight but are unsure if that element represents a component
   * or the root outlet.
   *
   * @method highlightLayer
   * @param  {String}  elementId         The element to highlight's id
   * @param  {Boolean} [isPreview=false] Preview/Fixed
   */
  highlightLayer(elementId, isPreview = false) {
    let component = this.componentById(elementId);
    if (component) {
      this.highlightComponent(component, isPreview);
    } else {
      this.highlightIfRoot(elementId, isPreview);
    }
  }

  /**
   * Test if an element is the root outlet element.
   *
   * @method isRootElement
   * @param  {Element}  element
   * @return {Boolean}
   */
  isRootElement(element) {
    return this.elementForRoot() === element;
  }

  /**
   * Turn the outlet tree into an array. Useful when searching for a specific
   * outlet.
   *
   * Return format:
   * [
   *   {
   *     value: |inspected root outlet|,
   *     controller: |application controller instance|
   *   },
   *   {
   *     value: |inspected outlet|,
   *     contorller: |controller instance|
   *   }
 *   ]
   *
   * @method outletArray
   * @param  {Object} outletTree
   * @return {Array}            The array of inspected outlets
   */
  outletArray(outletTree) {
    if (!outletTree) {
      outletTree = this.buildOutletTree(this.getRoot().outletState);
    }
    let { value, controller, children } = outletTree;
    return [{ value, controller }].concat(...children.map(this.outletArray.bind(this)));
  }

  /**
   * Returns a component when provided by its guid.
   *
   * @method componentById
   * @param  {String} id  The component's guid.
   * @return {Component}  The component.
   */
  componentById(id) {
    return this.viewRegistry[id];
  }

  /**
   * @method modelForViewNodeValue
   * @param  {Boolean} isComponent
   * @param  {Object}  inspectedNodeValue
   * @return {Any}     The inspected node's model (if it has one)
   */
  modelForViewNodeValue({ isComponent, objectId, name }) {
    if (isComponent) {
      return this.modelForComponent(this.componentById(objectId));
    } else {
      let { controller } = A(this.outletArray()).findBy('value.name', name);
      return controller.get('model');
    }
  }
}
