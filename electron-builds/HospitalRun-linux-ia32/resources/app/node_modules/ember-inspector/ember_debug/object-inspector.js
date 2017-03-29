import PortMixin from "ember-debug/mixins/port-mixin";
const Ember = window.Ember;
const { Object: EmberObject, inspect: emberInspect, meta: emberMeta, typeOf,
        Descriptor, computed, get, set, ComputedProperty, guidFor, isNone, removeObserver,
        Mixin, addObserver, cacheFor } = Ember;
const { oneWay } = computed;

const keys = Object.keys || Ember.keys;

function inspectValue(value) {
  let string;
  if (value instanceof EmberObject) {
    return { type: "type-ember-object", inspect: value.toString() };
  } else if (isComputed(value)) {
    string = "<computed>";
    return { type: "type-descriptor", inspect: string, computed: true };
  } else if (isDescriptor(value)) {
    return { type: "type-descriptor", inspect: value.toString(), computed: true };
  } else {
    return { type: `type-${typeOf(value)}`, inspect: inspect(value) };
  }
}

function isDescriptor(value) {
  // Ember < 1.11
  if (Descriptor !== undefined) {
    return value instanceof Descriptor;
  }
  // Ember >= 1.11
  return value && typeof value === 'object' && value.isDescriptor;
}

function inspect(value) {
  if (typeof value === 'function') {
    return "function() { ... }";
  } else if (value instanceof EmberObject) {
    return value.toString();
  } else if (typeOf(value) === 'array') {
    if (value.length === 0) {
      return '[]';
    } else if (value.length === 1) {
      return `[ ${inspect(value[0])} ]`;
    } else {
      return `[ ${inspect(value[0])}, ... ]`;
    }
  } else if (value instanceof Error) {
    return `Error: ${value.message}`;
  } else if (value === null) {
    return 'null';
  } else if (typeOf(value) === 'date') {
    return value.toString();
  } else if (typeof value === 'object') {
    // `Ember.inspect` is able to handle this use case,
    // but it is very slow as it loops over all props,
    // so summarize to just first 2 props
    let ret = [];
    let v;
    let count = 0;
    let broken = false;

    for (let key in value) {
      if (!('hasOwnProperty' in value) || value.hasOwnProperty(key)) {
        if (count++ > 1) {
          broken = true;
          break;
        }
        v = value[key];
        if (v === 'toString') { continue; } // ignore useless items
        if (typeOf(v) === 'function') { v = "function() { ... }"; }
        if (typeOf(v) === 'array') { v = `[Array : ${v.length}]`; }
        if (typeOf(v) === 'object') { v = '[Object]'; }
        ret.push(`${key}: ${v}`);
      }
    }
    let suffix = ' }';
    if (broken) {
      suffix = ' ...}';
    }
    return `{ ${ret.join(', ')}${suffix}`;
  } else {
    return emberInspect(value);
  }
}

export default EmberObject.extend(PortMixin, {
  namespace: null,

  adapter: oneWay('namespace.adapter'),

  port: oneWay('namespace.port'),

  application: oneWay('namespace.application'),

  init() {
    this._super();
    this.set('sentObjects', {});
    this.set('boundObservers', {});
  },

  willDestroy() {
    this._super();
    for (let objectId in this.sentObjects) {
      this.releaseObject(objectId);
    }
  },

  sentObjects: {},

  boundObservers: {},

  _errorsFor: computed(function() { return {}; }),

  portNamespace: 'objectInspector',

  messages: {
    digDeeper(message) {
      this.digIntoObject(message.objectId, message.property);
    },
    releaseObject(message) {
      this.releaseObject(message.objectId);
    },
    calculate(message) {
      let value;
      value = this.valueForObjectProperty(message.objectId, message.property, message.mixinIndex);
      if (value) {
        this.sendMessage('updateProperty', value);
        message.computed = true;
        this.bindPropertyToDebugger(message);
      }
      this.sendMessage('updateErrors', {
        objectId: message.objectId,
        errors: errorsToSend(this.get('_errorsFor')[message.objectId])
      });
    },
    saveProperty(message) {
      let value = message.value;
      if (message.dataType && message.dataType === 'date') {
        value = new Date(value);
      }
      this.saveProperty(message.objectId, message.mixinIndex, message.property, value);
    },
    sendToConsole(message) {
      this.sendToConsole(message.objectId, message.property);
    },
    sendControllerToConsole(message) {
      const container = this.get('application.__container__');
      this.sendValueToConsole(container.lookup(`controller:${message.name}`));
    },
    sendRouteHandlerToConsole(message) {
      const container = this.get('application.__container__');
      this.sendValueToConsole(container.lookup(`route:${message.name}`));
    },
    inspectRoute(message) {
      const container = this.get('application.__container__');
      this.sendObject(container.lookup('router:main').router.getHandler(message.name));
    },
    inspectController(message) {
      const container = this.get('application.__container__');
      this.sendObject(container.lookup(`controller:${message.name}`));
    },
    inspectById(message) {
      const obj = this.sentObjects[message.objectId];
      this.sendObject(obj);
    },
    inspectByContainerLookup(message) {
      const container = this.get('application.__container__');
      this.sendObject(container.lookup(message.name));
    },
    traceErrors(message) {
      let errors = this.get('_errorsFor')[message.objectId];
      toArray(errors).forEach(error => {
        let stack = error.error;
        if (stack && stack.stack) {
          stack = stack.stack;
        } else {
          stack = error;
        }
        this.get('adapter').log(`Object Inspector error for ${error.property}`, stack);
      });
    }
  },

  canSend(val) {
    return (val instanceof EmberObject) || typeOf(val) === 'array';
  },

  saveProperty(objectId, mixinIndex, prop, val) {
    let object = this.sentObjects[objectId];
    set(object, prop, val);
  },

  sendToConsole(objectId, prop) {
    let object = this.sentObjects[objectId];
    let value;

    if (isNone(prop)) {
      value = this.sentObjects[objectId];
    } else {
      value = get(object, prop);
    }

    this.sendValueToConsole(value);
  },

  sendValueToConsole(value) {
    window.$E = value;
    if (value instanceof Error) {
      value = value.stack;
    }
    this.get("adapter").log('Ember Inspector ($E): ', value);
  },

  digIntoObject(objectId, property) {
    let parentObject = this.sentObjects[objectId],
        object = get(parentObject, property);

    if (this.canSend(object)) {
      let details = this.mixinsForObject(object);

      this.sendMessage('updateObject', {
        parentObject: objectId,
        property,
        objectId: details.objectId,
        name: object.toString(),
        details: details.mixins,
        errors: details.errors
      });
    }
  },

  sendObject(object) {
    if (!this.canSend(object)) {
      throw new Error(`Can't inspect ${object}. Only Ember objects and arrays are supported.`);
    }
    let details = this.mixinsForObject(object);
    this.sendMessage('updateObject', {
      objectId: details.objectId,
      name: object.toString(),
      details: details.mixins,
      errors: details.errors
    });

  },


  retainObject(object) {
    let meta = emberMeta(object);
    let guid = guidFor(object);

    meta._debugReferences = meta._debugReferences || 0;
    meta._debugReferences++;

    this.sentObjects[guid] = object;

    if (meta._debugReferences === 1 && object.reopen) {
      // drop object on destruction
      let _oldWillDestroy = object._oldWillDestroy = object.willDestroy;
      let self = this;
      object.reopen({
        willDestroy() {
          self.dropObject(guid);
          return _oldWillDestroy.apply(this, arguments);
        }
      });
    }

    return guid;
  },

  releaseObject(objectId) {
    let object = this.sentObjects[objectId];
    if (!object) {
      return;
    }
    let meta = emberMeta(object);
    let guid = guidFor(object);

    meta._debugReferences--;

    if (meta._debugReferences === 0) {
      this.dropObject(guid);
    }

  },

  dropObject(objectId) {
    let object = this.sentObjects[objectId];

    if (object.reopen) {
      object.reopen({ willDestroy: object._oldWillDestroy });
      delete object._oldWillDestroy;
    }

    this.removeObservers(objectId);
    delete this.sentObjects[objectId];

    delete this.get('_errorsFor')[objectId];

    this.sendMessage('droppedObject', { objectId });
  },

  removeObservers(objectId) {
    let observers = this.boundObservers[objectId];
    let object = this.sentObjects[objectId];

    if (observers) {
      observers.forEach(observer => {
        removeObserver(object, observer.property, observer.handler);
      });
    }

    delete this.boundObservers[objectId];
  },

  mixinsForObject(object) {
    let mixins = Mixin.mixins(object);
    let mixinDetails = [];

    let ownProps = propertiesForMixin({ mixins: [{ properties: object }] });
    mixinDetails.push({ name: "Own Properties", properties: ownProps, expand: true });

    mixins.forEach(mixin => {
      let name = mixin[Ember.NAME_KEY] || mixin.ownerConstructor;
      if (!name) {
        name = 'Unknown mixin';
      }
      mixinDetails.push({ name: name.toString(), properties: propertiesForMixin(mixin) });
    });

    fixMandatorySetters(mixinDetails);
    applyMixinOverrides(mixinDetails);

    let propertyInfo = null;
    let debugInfo = getDebugInfo(object);
    if (debugInfo) {
      propertyInfo = getDebugInfo(object).propertyInfo;
      mixinDetails = customizeProperties(mixinDetails, propertyInfo);
    }

    let expensiveProperties = null;
    if (propertyInfo) {
      expensiveProperties = propertyInfo.expensiveProperties;
    }

    let objectId = this.retainObject(object);

    let errorsForObject = this.get('_errorsFor')[objectId] = {};
    calculateCPs(object, mixinDetails, errorsForObject, expensiveProperties);

    this.bindProperties(objectId, mixinDetails);

    let errors = errorsToSend(errorsForObject);
    return { objectId, mixins: mixinDetails, errors };
  },

  valueForObjectProperty(objectId, property, mixinIndex) {
    let object = this.sentObjects[objectId], value;

    if (object.isDestroying) {
      value = '<DESTROYED>';
    } else {
      value = calculateCP(object, property, this.get('_errorsFor')[objectId]);
    }

    if (!value || !(value instanceof CalculateCPError)) {
      value = inspectValue(value);
      value.computed = true;


      return { objectId, property, value, mixinIndex };
    }
  },

  bindPropertyToDebugger(message) {
    let objectId = message.objectId;
    let property = message.property;
    let mixinIndex = message.mixinIndex;
    let computed = message.computed;
    let object = this.sentObjects[objectId];

    let handler = () => {
      let value = get(object, property);
      value = inspectValue(value);
      value.computed = computed;

      this.sendMessage('updateProperty', { objectId, property, value, mixinIndex });
    };

    addObserver(object, property, handler);
    this.boundObservers[objectId] = this.boundObservers[objectId] || [];
    this.boundObservers[objectId].push({ property, handler });

  },

  bindProperties(objectId, mixinDetails) {
    mixinDetails.forEach((mixin, mixinIndex) => {
      mixin.properties.forEach(item => {
        if (item.overridden) {
          return true;
        }
        if (item.value.type !== 'type-descriptor' && item.value.type !== 'type-function') {
          let computed = !!item.value.computed;
          this.bindPropertyToDebugger({ objectId, property: item.name, mixinIndex, computed });
        }
      });
    });
  },

  inspect,
  inspectValue
});


function propertiesForMixin(mixin) {
  let properties = [];

  mixin.mixins.forEach(mixin => {
    if (mixin.properties) {
      addProperties(properties, mixin.properties);
    }
  });

  return properties;
}

function addProperties(properties, hash) {
  for (let prop in hash) {
    if (!hash.hasOwnProperty(prop)) { continue; }
    if (prop.charAt(0) === '_') { continue; }

    // remove `fooBinding` type props
    if (prop.match(/Binding$/)) { continue; }

    // when mandatory setter is removed, an `undefined` value may be set
    if (hash[prop] === undefined) { continue; }
    let options = { isMandatorySetter: isMandatorySetter(hash, prop) };
    if (isComputed(hash[prop])) {
      options.readOnly = hash[prop]._readOnly;
    }
    replaceProperty(properties, prop, hash[prop], options);
  }
}

function replaceProperty(properties, name, value, options) {
  let found;

  let i, l;
  for (i = 0, l = properties.length; i < l; i++) {
    if (properties[i].name === name) {
      found = i;
      break;
    }
  }

  if (found) { properties.splice(i, 1); }

  let prop = { name, value: inspectValue(value) };
  prop.isMandatorySetter = options.isMandatorySetter;
  prop.readOnly = options.readOnly;
  properties.push(prop);
}

function fixMandatorySetters(mixinDetails) {
  let seen = {};
  let propertiesToRemove = [];

  mixinDetails.forEach((detail, detailIdx) => {
    detail.properties.forEach(property => {
      if (property.isMandatorySetter) {
        seen[property.name] = {
          name: property.name,
          value: property.value.inspect,
          detailIdx,
          property
        };
      } else if (seen.hasOwnProperty(property.name) && seen[property.name] === property.value.inspect) {
        propertiesToRemove.push(seen[property.name]);
        delete seen[property.name];
      }
    });
  });

  propertiesToRemove.forEach(prop => {
    let detail = mixinDetails[prop.detailIdx];
    let index = detail.properties.indexOf(prop.property);
    if (index !== -1) {
      detail.properties.splice(index, 1);
    }
  });

}

function applyMixinOverrides(mixinDetails) {
  let seen = {};
  mixinDetails.forEach(detail => {
    detail.properties.forEach(property => {
      if (Object.prototype.hasOwnProperty(property.name)) { return; }

      if (seen[property.name]) {
        property.overridden = seen[property.name];
        delete property.value.computed;
      }

      seen[property.name] = detail.name;

    });
  });
}

function isMandatorySetter(object, prop) {
  let descriptor = Object.getOwnPropertyDescriptor(object, prop);
  if (descriptor.set && descriptor.set === Ember.MANDATORY_SETTER_FUNCTION) {
    return true;
  }
  return false;
}

function calculateCPs(object, mixinDetails, errorsForObject, expensiveProperties) {
  expensiveProperties = expensiveProperties || [];

  mixinDetails.forEach(mixin => {
    mixin.properties.forEach(item => {
      if (item.overridden) {
        return true;
      }
      if (item.value.computed) {
        let cache = cacheFor(object, item.name);
        if (cache !== undefined || expensiveProperties.indexOf(item.name) === -1) {
          let value = calculateCP(object, item.name, errorsForObject);
          if (!value || !(value instanceof CalculateCPError)) {
            item.value = inspectValue(value);
            item.value.computed = true;
          }
        }
      }
    });
  });
}

/**
  Customizes an object's properties
  based on the property `propertyInfo` of
  the object's `_debugInfo` method.

  Possible options:
    - `groups` An array of groups that contains the properties for each group
      For example:
      ```javascript
      groups: [
        { name: 'Attributes', properties: ['firstName', 'lastName'] },
        { name: 'Belongs To', properties: ['country'] }
      ]
      ```
    - `includeOtherProperties` Boolean,
      - `true` to include other non-listed properties,
      - `false` to only include given properties
    - `skipProperties` Array containing list of properties *not* to include
    - `skipMixins` Array containing list of mixins *not* to include
    - `expensiveProperties` An array of computed properties that are too expensive.
       Adding a property to this array makes sure the CP is not calculated automatically.

  Example:
  ```javascript
  {
    propertyInfo: {
      includeOtherProperties: true,
      skipProperties: ['toString', 'send', 'withTransaction'],
      skipMixins: [ 'Ember.Evented'],
      calculate: ['firstName', 'lastName'],
      groups: [
        {
          name: 'Attributes',
          properties: [ 'id', 'firstName', 'lastName' ],
          expand: true // open by default
        },
        {
          name: 'Belongs To',
          properties: [ 'maritalStatus', 'avatar' ],
          expand: true
        },
        {
          name: 'Has Many',
          properties: [ 'phoneNumbers' ],
          expand: true
        },
        {
          name: 'Flags',
          properties: ['isLoaded', 'isLoading', 'isNew', 'isDirty']
        }
      ]
    }
  }
  ```
*/
function customizeProperties(mixinDetails, propertyInfo) {
  let newMixinDetails = [];
  let neededProperties = {};
  let groups = propertyInfo.groups || [];
  let skipProperties = propertyInfo.skipProperties || [];
  let skipMixins = propertyInfo.skipMixins || [];

  if (groups.length) {
    mixinDetails[0].expand = false;
  }

  groups.forEach(group => {
    group.properties.forEach(prop => {
      neededProperties[prop] = true;
    });
  });

  mixinDetails.forEach(mixin => {
    let newProperties = [];
    mixin.properties.forEach(item => {
      if (skipProperties.indexOf(item.name) !== -1) {
        return true;
      }
      if (!item.overridden && neededProperties.hasOwnProperty(item.name) && neededProperties[item.name]) {
        neededProperties[item.name] = item;
      } else {
        newProperties.push(item);
      }
    });
    mixin.properties = newProperties;
    if (skipMixins.indexOf(mixin.name) === -1) {
      newMixinDetails.push(mixin);
    }
  });

  groups.slice().reverse().forEach(group => {
    let newMixin = { name: group.name, expand: group.expand, properties: [] };
    group.properties.forEach(function(prop) {
      // make sure it's not `true` which means property wasn't found
      if (neededProperties[prop] !== true) {
        newMixin.properties.push(neededProperties[prop]);
      }
    });
    newMixinDetails.unshift(newMixin);
  });

  return newMixinDetails;
}


function getDebugInfo(object) {
  let debugInfo = null;
  if (object._debugInfo && typeof object._debugInfo === 'function') {
    debugInfo = object._debugInfo();
  }
  debugInfo = debugInfo || {};
  let propertyInfo = debugInfo.propertyInfo || (debugInfo.propertyInfo = {});
  let skipProperties = propertyInfo.skipProperties = propertyInfo.skipProperties || (propertyInfo.skipProperties = []);

  skipProperties.push('isDestroyed', 'isDestroying', 'container');
  // 'currentState' and 'state' are un-observable private properties.
  // The rest are skipped to reduce noise in the inspector.
  if (Ember.View && object instanceof Ember.View) {
    skipProperties.push(
      'currentState',
      'state',
      'buffer',
      'outletSource',
      'lengthBeforeRender',
      'lengthAfterRender',
      'template',
      'layout',
      'templateData',
      'domManager',
      'states',
      'element'
    );
  }


  for (let prop in object) {
    // remove methods
    if (typeof object[prop] === 'function') {
      skipProperties.push(prop);
    }

  }
  return debugInfo;
}

function isComputed(value) {
  return value instanceof ComputedProperty;
}

function toArray(errors) {
  return keys(errors).map(key => errors[key]);
}

function calculateCP(object, property, errorsForObject) {
  delete errorsForObject[property];
  try {
    return get(object, property);
  } catch (error) {
    errorsForObject[property] = { property, error };
    return new CalculateCPError();
  }
}

function CalculateCPError() {}

function errorsToSend(errors) {
  return toArray(errors).map(error => ({ property: error.property }));
}
