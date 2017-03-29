import PortMixin from 'ember-debug/mixins/port-mixin';
const Ember = window.Ember;
const { Object: EmberObject, computed, guidFor, A } = Ember;
const { alias } = computed;

export default EmberObject.extend(PortMixin, {
  init() {
    this._super();
    this.sentTypes = {};
    this.sentRecords = {};
  },

  sentTypes: {},
  sentRecords: {},

  releaseTypesMethod: null,
  releaseRecordsMethod: null,

  adapter: computed('application', function() {
    const container = this.get('application').__container__;

    // dataAdapter:main is deprecated
    let adapter = (this._resolve('data-adapter:main') && container.lookup('data-adapter:main'));
    // column limit is now supported at the inspector level
    adapter.set('attributeLimit', 100);
    return adapter;
  }),

  _resolve(name) {
    // Ember >= 2.1
    if (this.get('application').resolveRegistration) {
      return this.get('application').resolveRegistration(name);
    }
    let container = this.get('application').__container__;
    let registry = this.get('application.registry');
    if (registry) {
      // Ember >= 1.11
      return registry.resolve(name);
    } else if (container.resolve) {
      // Ember < 1.11
      return container.resolve(name);
    } else {
      // Ember >= 2.0 < 2.1
      return container.registry.resolve(name);
    }

  },

  namespace: null,

  port: alias('namespace.port'),
  application: alias('namespace.application'),
  objectInspector: alias('namespace.objectInspector'),

  portNamespace: 'data',

  modelTypesAdded(types) {
    let typesToSend;
    typesToSend = types.map(type => this.wrapType(type));
    this.sendMessage('modelTypesAdded', {
      modelTypes: typesToSend
    });
  },

  modelTypesUpdated(types) {
    let typesToSend = types.map(type => this.wrapType(type));
    this.sendMessage('modelTypesUpdated', {
      modelTypes: typesToSend
    });
  },

  wrapType(type) {
    const objectId = guidFor(type.object);
    this.sentTypes[objectId] = type;

    return {
      columns: type.columns,
      count: type.count,
      name: type.name,
      objectId
    };
  },


  recordsAdded(recordsReceived) {
    let records = recordsReceived.map(record => this.wrapRecord(record));
    this.sendMessage('recordsAdded', { records });
  },

  recordsUpdated(recordsReceived) {
    let records = recordsReceived.map(record => this.wrapRecord(record));
    this.sendMessage('recordsUpdated', { records });
  },

  recordsRemoved(index, count) {
    this.sendMessage('recordsRemoved', { index, count });
  },

  wrapRecord(record) {
    const objectId = guidFor(record.object);
    let columnValues = {};
    let searchKeywords = [];
    this.sentRecords[objectId] = record;
    // make objects clonable
    for (let i in record.columnValues) {
      columnValues[i] = this.get('objectInspector').inspect(record.columnValues[i]);
    }
    // make sure keywords can be searched and clonable
    searchKeywords = A(record.searchKeywords).filter(keyword =>
      (typeof keyword === 'string' || typeof keyword === 'number')
    );
    return {
      columnValues,
      searchKeywords,
      filterValues: record.filterValues,
      color: record.color,
      objectId
    };
  },

  releaseTypes() {
    if (this.releaseTypesMethod) {
      this.releaseTypesMethod();
      this.releaseTypesMethod = null;
      this.sentTypes = {};
    }
  },

  releaseRecords() {
    if (this.releaseRecordsMethod) {
      this.releaseRecordsMethod();
      this.releaseRecordsMethod = null;
      this.sentRecords = {};
    }
  },

  willDestroy() {
    this._super();
    this.releaseRecords();
    this.releaseTypes();
  },

  messages: {
    checkAdapter() {
      this.sendMessage('hasAdapter', { hasAdapter: !!this.get('adapter') });
    },

    getModelTypes() {
      this.releaseTypes();
      this.releaseTypesMethod = this.get('adapter').watchModelTypes(types => {
        this.modelTypesAdded(types);
      }, types => {
        this.modelTypesUpdated(types);
      });
    },

    releaseModelTypes() {
      this.releaseTypes();
    },

    getRecords(message) {
      const type = this.sentTypes[message.objectId];
      this.releaseRecords();

      let typeOrName;
      if (this.get('adapter.acceptsModelName')) {
        // Ember >= 1.3
        typeOrName = type.name;
      } else {
        // support for legacy Ember < 1.3
        typeOrName = type.object;
      }
      let releaseMethod = this.get('adapter').watchRecords(typeOrName,
        recordsReceived => {
          this.recordsAdded(recordsReceived);
        },
        recordsUpdated => {
          this.recordsUpdated(recordsUpdated);
        },
        () => {
          this.recordsRemoved(...arguments);
        }
      );
      this.releaseRecordsMethod = releaseMethod;
    },

    releaseRecords() {
      this.releaseRecords();
    },

    inspectModel(message) {
      this.get('objectInspector').sendObject(this.sentRecords[message.objectId].object);
    },

    getFilters() {
      this.sendMessage('filters', {
        filters: this.get('adapter').getFilters()
      });
    }
  }
});
