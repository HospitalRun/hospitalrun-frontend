/* eslint no-cond-assign:0 */
import PortMixin from 'ember-debug/mixins/port-mixin';
import GlimmerTree from 'ember-debug/libs/glimmer-tree';
import {
  modelName as getModelName,
  shortModelName as getShortModelName,
  controllerName as getControllerName,
  shortControllerName as getShortControllerName,
  viewName as getViewName,
  shortViewName as getShortViewName
} from 'ember-debug/utils/name-functions';

const Ember = window.Ember;

const {
  guidFor,
  $,
  computed,
  run,
  Object: EmberObject,
  typeOf,
  Component,
  Controller,
  ViewUtils,
  A
} = Ember;
const { later } = run;
const { readOnly } = computed;
const { getViewBoundingClientRect } = ViewUtils;

const keys = Object.keys || Ember.keys;

let layerDiv, previewDiv, highlightedElement;

export default EmberObject.extend(PortMixin, {

  namespace: null,

  application: readOnly('namespace.application'),
  adapter: readOnly('namespace.adapter'),
  port: readOnly('namespace.port'),
  objectInspector: readOnly('namespace.objectInspector'),

  retainedObjects: [],

  _durations: {},

  options: {},

  portNamespace: 'view',

  messages: {
    getTree() {
      this.sendTree();
    },
    hideLayer() {
      this.hideLayer();
    },
    previewLayer(message) {
      if (this.glimmerTree) {
        // >= Ember 2.9
        this.glimmerTree.highlightLayer(message.objectId || message.elementId, true);
      } else {
        // 1.13 >= Ember <= 2.8
        if (message.renderNodeId !== undefined) {
          this._highlightNode(this.get('_lastNodes').objectAt(message.renderNodeId), true);
        } else if (message.objectId) {
          this.highlightView(this.get('objectInspector').sentObjects[message.objectId], true);
        }
      }
    },
    hidePreview() {
      this.hidePreview();
    },
    inspectViews(message) {
      if (message.inspect) {
        this.startInspecting();
      } else {
        this.stopInspecting();
      }
    },
    inspectElement({ objectId, elementId }) {
      if (objectId) {
        this.inspectViewElement(objectId);
      } else {
        let element = $(`#${elementId}`)[0];
        this.inspectElement(element);
      }
    },
    setOptions({ options }) {
      this.set('options', options);
      if (this.glimmerTree) {
        this.glimmerTree.updateOptions(options);
      }
      this.sendTree();
    },
    sendModelToConsole(message) {
      let model;
      if (this.glimmerTree) {
        model = this.glimmerTree.modelForViewNodeValue(message);
      } else {
        let renderNode = this.get('_lastNodes').objectAt(message.renderNodeId);
        model = this._modelForNode(renderNode);
      }
      if (model) {
        this.get('objectInspector').sendValueToConsole(model);
      }
    }
  },

  init() {
    this._super(...arguments);

    this.viewListener();
    this.retainedObjects = [];
    this.options = {};

    layerDiv = $('<div>').appendTo('body').get(0);
    layerDiv.style.display = 'none';
    layerDiv.setAttribute('data-label', 'layer-div');

    previewDiv = $('<div>').appendTo('body').css('pointer-events', 'none').get(0);
    previewDiv.style.display = 'none';
    previewDiv.setAttribute('data-label', 'preview-div');

    $(window).on(`resize.${this.get('eventNamespace')}`, () => {
      if (this.glimmerTree) {
        this.hideLayer();
      } else {
        if (highlightedElement) {
          this.highlightView(highlightedElement);
        }
      }
    });

    if (this.isGlimmerTwo()) {
      this.glimmerTree = new GlimmerTree({
        container: this.getContainer(),
        retainObject: this.retainObject.bind(this),
        highlightRange: this._highlightRange.bind(this),
        options: this.get('options'),
        objectInspector: this.get('objectInspector'),
        durations: this._durations,
        viewRegistry: this.get('viewRegistry')
      });
    }
  },

  updateDurations(durations) {
    for (let guid in durations) {
      if (!durations.hasOwnProperty(guid)) {
        continue;
      }
      this._durations[guid] = durations[guid];
    }
    if (this.glimmerTree) {
      this.glimmerTree.updateDurations(this._durations);
    }
    this.sendTree();
  },

  retainObject(object) {
    this.retainedObjects.push(object);
    return this.get('objectInspector').retainObject(object);
  },

  releaseCurrentObjects() {
    this.retainedObjects.forEach(item => {
      this.get('objectInspector').releaseObject(guidFor(item));
    });
    this.retainedObjects = [];
  },

  eventNamespace: computed(function() {
    return `view_debug_${guidFor(this)}`;
  }),

  willDestroy() {
    this._super();
    $(window).off(this.get('eventNamespace'));
    $(layerDiv).remove();
    $(previewDiv).remove();
    this.get('_lastNodes').clear();
    this.releaseCurrentObjects();
    this.stopInspecting();
  },

  inspectViewElement(objectId) {
    let view = this.get('objectInspector').sentObjects[objectId];
    if (view && view.get('element')) {
      this.inspectElement(view.get('element'));
    }
  },

  /**
   * Opens the "Elements" tab and selects the given element. Doesn't work in all
   * browsers/addons (only in the Chrome and FF devtools addons at the time of writing).
   *
   * @method inspectElement
   * @param  {Element} element The element to inspect
   */
  inspectElement(element) {
    this.get('adapter').inspectElement(element);
  },

  sendTree() {
    run.scheduleOnce('afterRender', this, this.scheduledSendTree);
  },

  startInspecting() {
    let viewElem = null;
    this.sendMessage('startInspecting', {});

    // we don't want the preview div to intercept the mousemove event
    $(previewDiv).css('pointer-events', 'none');

    let pinView = () => {
      if (viewElem) {
        if (this.glimmerTree) {
          this.glimmerTree.highlightLayer(viewElem.attr('id'));
        } else {
          this.highlightView(viewElem[0]);
        }
        let view = this.get('objectInspector').sentObjects[viewElem.id];
        if (view instanceof Component) {
          this.get('objectInspector').sendObject(view);
        }
      }
      this.stopInspecting();
      return false;
    };

    $('body').on(`mousemove.inspect-${this.get('eventNamespace')}`, e => {
      viewElem = this.findNearestView($(e.target));
      if (viewElem) {
        if (this.glimmerTree) {
          this.glimmerTree.highlightLayer(viewElem.attr('id'), true);
        } else {
          this.highlightView(viewElem[0], true);
        }
      }
    })
    .on(`mousedown.inspect-${this.get('eventNamespace')}`, () => {
      // prevent app-defined clicks from being fired
      $(previewDiv).css('pointer-events', '')
      .one('mouseup', function() {
        // chrome
        return pinView();
      });
    })
    .on(`mouseup.inspect-${this.get('eventNamespace')}`, () => /* firefox */ pinView())
    .css('cursor', '-webkit-zoom-in');
  },

  findNearestView(elem) {
    if (!elem || elem.length === 0) { return null; }
    if (elem.hasClass('ember-view')) {
      return elem;
    }
    return this.findNearestView($(elem).parents('.ember-view:first'));
  },

  stopInspecting() {
    $('body')
    .off(`mousemove.inspect-${this.get('eventNamespace')}`)
    .off(`mousedown.inspect-${this.get('eventNamespace')}`)
    .off(`mouseup.inspect-${this.get('eventNamespace')}`)
    .off(`click.inspect-${this.get('eventNamespace')}`)
    .css('cursor', '');

    this.hidePreview();
    this.sendMessage('stopInspecting', {});
  },

  scheduledSendTree() {
    // Send out of band
    later(() => {
      if (this.isDestroying) {
        return;
      }
      this.releaseCurrentObjects();
      let tree = this.viewTree();
      if (tree) {
        this.sendMessage('viewTree', { tree });
      }
    }, 50);
  },

  viewListener() {
    this.viewTreeChanged = () => {
      this.sendTree();
      this.hideLayer();
    };
  },

  viewTree() {
    let tree;
    let emberApp = this.get('application');
    if (!emberApp) {
      return false;
    }

    let applicationViewId = $(emberApp.rootElement).find('> .ember-view').attr('id');
    let rootView = this.get('viewRegistry')[applicationViewId];
    // In case of App.reset view is destroyed
    if (this.glimmerTree) {
      // Glimmer 2
      tree = this.glimmerTree.build();
    } else if (rootView) {
      let children = [];
      this.get('_lastNodes').clear();
      let renderNode = rootView._renderNode;
      tree = { value: this._inspectNode(renderNode), children };
      this._appendNodeChildren(renderNode, children);
    }
    return tree;
  },

  getContainer() {
    return this.get('application.__container__');
  },

  isGlimmerTwo() {
    return this.get('application').hasRegistration('service:-glimmer-environment');
  },

  modelForView(view) {
    const controller = view.get('controller');
    let model = controller.get('model');
    if (view.get('context') !== controller) {
      model = view.get('context');
    }
    return model;
  },

  shouldShowView(view) {
    if (view instanceof Component) {
      return this.options.components;
    }
    return (this.hasOwnController(view) || this.hasOwnContext(view)) &&
        (!view.get('isVirtual') || this.hasOwnController(view) || this.hasOwnContext(view));
  },

  hasOwnController(view) {
    return view.get('controller') !== view.get('_parentView.controller') &&
    ((view instanceof Component) || !(view.get('_parentView.controller') instanceof Component));
  },

  hasOwnContext(view) {
    // Context switching is deprecated, we will need to find a better way for {{#each}} helpers.
    return view.get('context') !== view.get('_parentView.context') &&
      // make sure not a view inside a component, like `{{yield}}` for example.
      !(view.get('_parentView.context') instanceof Component);
  },

  highlightView(element, isPreview) {
    let view, rect;

    if (!isPreview) {
      highlightedElement = element;
    }

    if (!element) { return; }

    // element && element._renderNode to detect top view (application)
    if (element instanceof Component || (element && element._renderNode)) {
      view = element;
    } else {
      view = this.get('viewRegistry')[element.id];
    }

    rect = getViewBoundingClientRect(view);

    let templateName = view.get('templateName') || view.get('_debugTemplateName');
    let controller = view.get('controller');
    let model = controller && controller.get('model');
    let modelName;

    let options = {
      isPreview,
      view: {
        name: getViewName(view),
        object: view
      }
    };

    if (controller) {
      options.controller = {
        name: getControllerName(controller),
        object: controller
      };
    }

    if (templateName) {
      options.template = {
        name: templateName
      };
    }

    if (model) {
      modelName = this.get('objectInspector').inspect(model);
      options.model = {
        name: modelName,
        object: model
      };
    }

    this._highlightRange(rect, options);
  },

  // TODO: This method needs a serious refactor/cleanup
  _highlightRange(rect, options) {
    let div;
    let isPreview = options.isPreview;

    // take into account the scrolling position as mentioned in docs
    // https://developer.mozilla.org/en-US/docs/Web/API/element.getBoundingClientRect
    rect = $.extend({}, rect);
    rect.top += window.scrollY;
    rect.left += window.scrollX;

    if (isPreview) {
      div = previewDiv;
    } else {
      this.hideLayer();
      div = layerDiv;
      this.hidePreview();
    }

    $(div).css(rect);
    $(div).css({
      display: "block",
      position: "absolute",
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      border: "2px solid rgb(102, 102, 102)",
      padding: "0",
      right: "auto",
      direction: "ltr",
      boxSizing: "border-box",
      color: "rgb(51, 51, 255)",
      fontFamily: "Menlo, sans-serif",
      minHeight: 63,
      zIndex: 10000
    });

    let output = "";

    if (!isPreview) {
      output = "<span class='close' data-label='layer-close'>&times;</span>";
    }

    let template = options.template;

    if (template) {
      output += `<p class='template'><span>template</span>=<span data-label='layer-template'>${escapeHTML(template.name)}</span></p>`;
    }
    let view = options.view;
    let controller = options.controller;
    if (!view || !(view.object instanceof Component)) {
      if (controller) {
        output += `<p class='controller'><span>controller</span>=<span data-label='layer-controller'>${escapeHTML(controller.name)}</span></p>`;
      }
      if (view) {
        output += `<p class='view'><span>view</span>=<span data-label='layer-view'>${escapeHTML(view.name)}</span></p>`;
      }
    } else {
      output += `<p class='component'><span>component</span>=<span data-label='layer-component'>${escapeHTML(view.name)}</span></p>`;
    }

    let model = options.model;
    if (model) {
      output += `<p class='model'><span>model</span>=<span data-label='layer-model'>${escapeHTML(model.name)}</span></p>`;
    }

    $(div).html(output);

    $('p', div).css({ float: 'left', margin: 0, backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '5px', color: 'rgb(0, 0, 153)' });
    $('p.model', div).css({ clear: 'left' });
    $('p span:first-child', div).css({ color: 'rgb(153, 153, 0)' });
    $('p span:last-child', div).css({ color: 'rgb(153, 0, 153)' });

    if (!isPreview) {
      $('span.close', div).css({
        float: 'right',
        margin: '5px',
        background: '#666',
        color: '#eee',
        fontFamily: 'helvetica, sans-serif',
        fontSize: '12px',
        width: 16,
        height: 16,
        lineHeight: '14px',
        borderRadius: 16,
        textAlign: 'center',
        cursor: 'pointer'
      }).on('click', () => {
        this.hideLayer();
        return false;
      }).on('mouseup mousedown', function() {
        // prevent re-pinning
        return false;
      });
    }

    $('p.view span:last-child', div).css({ cursor: 'pointer' }).click(() => {
      this.get('objectInspector').sendObject(view.object);
    });

    $('p.controller span:last-child', div).css({ cursor: 'pointer' }).click(() => {
      this.get('objectInspector').sendObject(controller.object);
    });

    $('p.component span:last-child', div).css({ cursor: 'pointer' }).click(() => {
      this.get('objectInspector').sendObject(view.object);
    });

    $('p.template span:last-child', div).css({ cursor: 'pointer' }).click(() => {
      if (view) {
        this.inspectViewElement(guidFor(view.object));
      } else if (options.element) {
        this.inspectElement(options.element);
      }
    });

    if (model && model.object && ((model.object instanceof EmberObject) || typeOf(model.object) === 'array')) {
      $('p.model span:last-child', div).css({ cursor: 'pointer' }).click(() => {
        this.get('objectInspector').sendObject(model.object);
      });
    }
  },

  hideLayer() {
    layerDiv.style.display = 'none';
    highlightedElement = null;
  },

  hidePreview() {
    previewDiv.style.display = 'none';
  },

  /**
   * List of render nodes from the last
   * sent view tree.
   *
   * @property lastNodes
   * @type {Array}
   */
  _lastNodes: computed(function() {
    return A([]);
  }),

  viewRegistry: computed('application', function() {
    return this.getContainer().lookup('-view-registry:main');
  }),

  /**
   * Walk the render node hierarchy and build the tree.
   *
   * @param  {Object} renderNode
   * @param  {Array} children
   */
  _appendNodeChildren(renderNode, children) {
    let childNodes = this._childrenForNode(renderNode);
    if (!childNodes) { return; }
    childNodes.forEach(childNode => {
      if (this._shouldShowNode(childNode, renderNode)) {
        let grandChildren = [];
        children.push({ value: this._inspectNode(childNode), children: grandChildren });
        this._appendNodeChildren(childNode, grandChildren);
      } else {
        this._appendNodeChildren(childNode, children);
      }
    });
  },

  /**
   * Gather the children assigned to the render node.
   *
   * @param  {Object} renderNode
   * @return {Array} children
   */
  _childrenForNode(renderNode) {
    if (renderNode.morphMap) {
      return keys(renderNode.morphMap).map(key => renderNode.morphMap[key]).filter(node => !!node);
    } else {
      return renderNode.childNodes;
    }
  },

  /**
   * Whether a render node is elligible to be included
   * in the tree.
   * Depends on whether the node is actually a view node
   * (as opposed to an attribute node for example),
   * and also checks the filtering options. For example,
   * showing Ember component nodes can be toggled.
   *
   * @param  {Object} renderNode
   * @param  {Object} parentNode
   * @return {Boolean} `true` for show and `false` to skip the node
   */
  _shouldShowNode(renderNode, parentNode) {

    // Filter out non-(view/components)
    if (!this._nodeIsView(renderNode)) {
      return false;
    }
    // Has either a template or a view/component instance
    if (!this._nodeTemplateName(renderNode) && !this._nodeHasViewInstance(renderNode)) {
      return false;
    }
    return this._nodeHasOwnController(renderNode, parentNode) &&
        (this.options.components || !(this._nodeIsEmberComponent(renderNode))) &&
        (this._nodeHasViewInstance(renderNode) || this._nodeHasOwnController(renderNode, parentNode));
  },

  /**
   * The node's model. If the view has a controller,
   * it will be the controller's `model` property.s
   *
   * @param  {Object} renderNode
   * @return {Object} the model
   */
  _modelForNode(renderNode) {
    let controller = this._controllerForNode(renderNode);
    if (controller) {
      return controller.get('model');
    }
  },

  /**
   * Not all nodes are actually views/components.
   * Nodes can be attributes for example.
   *
   * @param  {Object} renderNode
   * @return {Boolean}
   */
  _nodeIsView(renderNode) {
    if (renderNode.getState) {
      return !!renderNode.getState().manager;
    } else {
      return !!renderNode.state.manager;
    }
  },

  /**
   * Check if a node has its own controller (as opposed to sharing
   * its parent's controller).
   * Useful to identify route views from other views.
   *
   * @param  {Object} renderNode
   * @param  {Object} parentNode
   * @return {Boolean}
   */
  _nodeHasOwnController(renderNode, parentNode) {
    return this._controllerForNode(renderNode) !== this._controllerForNode(parentNode);
  },

  /**
   * Check if the node has a view instance.
   * Virtual nodes don't have a view/component instance.
   *
   * @param  {Object} renderNode
   * @return {Boolean}
   */
  _nodeHasViewInstance(renderNode) {
    return !!this._viewInstanceForNode(renderNode);
  },


  /**
   * Returns the nodes' controller.
   *
   * @param  {Object} renderNode
   * @return {Ember.Controller}
   */
  _controllerForNode(renderNode) {
    // If it's a component then return the component instance itself
    if (this._nodeIsEmberComponent(renderNode)) {
      return this._viewInstanceForNode(renderNode);
    }
    if (renderNode.lastResult) {
      let scope = renderNode.lastResult.scope;
      let controller;
      if (scope.getLocal) {
        controller = scope.getLocal('controller');
      } else {
        controller = scope.locals.controller.value();
      }
      if ((!controller || !(controller instanceof Controller)) && scope.getSelf) {
        // Ember >= 2.2 + no ember-legacy-controllers addon
        controller = scope.getSelf().value();
        if (!(controller instanceof Controller)) {
          controller = controller._controller;
        }
      }
      return controller;
    }
  },

  /**
   * Inspect a node. This will return an object with all
   * the required properties to be added to the view tree
   * to be sent.
   *
   * @param  {Object} renderNode
   * @return {Object} the object containing the required values
   */
  _inspectNode(renderNode) {
    let name, viewClassName, completeViewClassName, tagName, viewId, timeToRender;

    let viewClass = this._viewInstanceForNode(renderNode);

    if (viewClass) {
      viewClassName = getShortViewName(viewClass);
      completeViewClassName = getViewName(viewClass);
      tagName = viewClass.get('tagName') || 'div';
      viewId = this.retainObject(viewClass);
      timeToRender = this._durations[viewId];
    }

    name = this._nodeDescription(renderNode);

    let value = {
      template: this._nodeTemplateName(renderNode) || '(inline)',
      name,
      objectId: viewId,
      viewClass: viewClassName,
      duration: timeToRender,
      completeViewClass: completeViewClassName,
      isComponent: this._nodeIsEmberComponent(renderNode),
      tagName,
      isVirtual: !viewClass
    };


    let controller = this._controllerForNode(renderNode);
    if (controller && !(this._nodeIsEmberComponent(renderNode))) {
      value.controller = {
        name: getShortControllerName(controller),
        completeName: getControllerName(controller),
        objectId: this.retainObject(controller)
      };

      let model = this._modelForNode(renderNode);
      if (model) {
        if (EmberObject.detectInstance(model) || typeOf(model) === 'array') {
          value.model = {
            name: getShortModelName(model),
            completeName: getModelName(model),
            objectId: this.retainObject(model),
            type: 'type-ember-object'
          };
        } else {
          value.model = {
            name: this.get('objectInspector').inspect(model),
            type: `type-${typeOf(model)}`
          };
        }
      }
    }

    value.renderNodeId = this.get('_lastNodes').push(renderNode) - 1;

    return value;
  },

  /**
   * Get the node's template name. Relies on an htmlbars
   * feature that adds the module name as a meta property
   * to compiled templates.
   *
   * @param  {Object} renderNode
   * @return {String} the template name
   */
  _nodeTemplateName(renderNode) {
    let template = renderNode.lastResult && renderNode.lastResult.template;
    if (template && template.meta && template.meta.moduleName) {
      return template.meta.moduleName.replace(/\.hbs$/, '');
    }
  },

  /**
   * The node's name. Should be anything that the user
   * can use to identity what node we are talking about.
   *
   * Usually either the view instance name, or the template name.
   *
   * @param  {Object} renderNode
   * @return {String}
   */
  _nodeDescription(renderNode) {
    let name;

    let viewClass = this._viewInstanceForNode(renderNode);

    if (viewClass) {
      //. Has a view instance - take the view's name
      name = viewClass.get('_debugContainerKey');
      if (name) {
        name = name.replace(/.*(view|component):/, '').replace(/:$/, '');
      }
    } else {
      // Virtual - no view instance
      let templateName = this._nodeTemplateName(renderNode);
      if (templateName) {
        return templateName.replace(/^.*templates\//, '').replace(/\//g, '.');
      }
    }

    // If application view was not defined, it uses a `toplevel` view
    if (name === 'toplevel') {
      name = 'application';
    }
    return name;
  },

  /**
   * Return a node's view instance.
   *
   * @param  {Object} renderNode
   * @return {Ember.View|Ember.Component} The view or component instance
   */
  _viewInstanceForNode(renderNode) {
    return renderNode.emberView;
  },

  /**
   * Returns whether the node is an Ember Component or not.
   *
   * @param  {Object} renderNode
   * @return {Boolean}
   */
  _nodeIsEmberComponent(renderNode) {
    let viewInstance = this._viewInstanceForNode(renderNode);
    return !!(viewInstance && (viewInstance instanceof Component));
  },

  /**
   * Highlight a render node on the screen.
   *
   * @param  {Object} renderNode
   * @param  {Boolean} isPreview (whether to pin the layer or not)
   */
  _highlightNode(renderNode, isPreview) {
    let modelName;
    // Todo: should be in Ember core
    let range = document.createRange();
    range.setStartBefore(renderNode.firstNode);
    range.setEndAfter(renderNode.lastNode);
    let rect = range.getBoundingClientRect();

    let options = { isPreview };

    let controller = this._controllerForNode(renderNode);
    if (controller) {
      options.controller = {
        name: getControllerName(controller),
        object: controller
      };
    }

    let templateName = this._nodeTemplateName(renderNode);
    if (templateName) {
      options.template = {
        name: templateName
      };
    }

    let model;
    if (controller) {
      model = controller.get('model');
    }
    if (model) {
      modelName = this.get('objectInspector').inspect(model);
      options.model = {
        name: modelName,
        object: model
      };
    }

    let view = this._viewInstanceForNode(renderNode);

    if (view) {
      options.view = {
        name: getViewName(view),
        object: view
      };
    }

    this._highlightRange(rect, options);
  }
});

function escapeHTML(string) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(string));
  return div.innerHTML;
}
