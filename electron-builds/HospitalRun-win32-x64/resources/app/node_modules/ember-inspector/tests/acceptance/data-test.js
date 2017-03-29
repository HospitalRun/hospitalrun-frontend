import Ember from "ember";
import { test } from 'ember-qunit';
import { module } from 'qunit';
import startApp from '../helpers/start-app';
const { run } = Ember;
let App;

let port, name;

module('Data Tab', {
  beforeEach() {
    App = startApp({
      adapter: 'basic'
    });
    port = App.__container__.lookup('port:main');
    port.reopen({
      init() {},
      send(n, m) {
        name = n;
        if (name === 'data:getModelTypes') {
          this.trigger('data:modelTypesAdded', { modelTypes: modelTypes() });
        }
        if (name === 'data:getRecords') {
          this.trigger('data:recordsAdded', { records: records(m.objectId) });
        }
        if (name === 'data:getFilters') {
          this.trigger('data:filters', { filters: getFilters() });
        }
      }
    });
  },
  afterEach() {
    name = null;
    run(App, App.destroy);
  }
});

function modelTypeFactory(options) {
  return {
    name: options.name,
    count: options.count,
    columns: options.columns,
    objectId: options.name
  };
}

function getFilters() {
  return [{ name: 'isNew', desc: 'New' }];
}

function modelTypes() {
  return [
    modelTypeFactory({
      name: 'App.Post',
      count: 2,
      columns: [{ name: 'id', desc: 'Id' }, { name: 'title', desc: 'Title' }, { name: 'body', desc: 'Body' }]
    }),
    modelTypeFactory({
      name: 'App.Comment',
      count: 1,
      columns: [{ name: 'id', desc: 'Id' }, { name: 'title', desc: 'Title' }, { name: 'content', desc: 'Content' }]
    })
  ];
}

function recordFactory(attr, filterValues) {
  filterValues = filterValues || { isNew: false };
  let searchKeywords = [];
  for (let i in attr) {
    searchKeywords.push(attr[i]);
  }
  let object = Ember.Object.create();
  return {
    columnValues: attr,
    objectId: attr.objectId || Ember.guidFor(object),
    filterValues,
    searchKeywords
  };
}

function records(type) {
  if (type === 'App.Post') {
    return [
      recordFactory({ id: 1, title: 'My Post', body: 'This is my first post' }),
      recordFactory({ id: 2, title: 'Hello', body: '' }, { isNew: true })
    ];
  } else if (type === 'App.Comment') {
    return [
      recordFactory({ id: 2, title: 'I am confused', content: 'I have no idea what im doing' })
    ];
  }
}

test("Model types are successfully listed and bound", async function t(assert) {
  await visit('/data/model-types');

  assert.equal(find('.js-model-type').length, 2);
  // they should be sorted alphabetically
  assert.equal(find('.js-model-type-name').eq(0).text().trim(), 'App.Comment');
  assert.equal(find('.js-model-type-name').eq(1).text().trim(), 'App.Post');

  assert.equal(find('.js-model-type-count').eq(0).text().trim(), 1);
  assert.equal(find('.js-model-type-count').eq(1).text().trim(), 2);

  await triggerPort('data:modelTypesUpdated', {
    modelTypes: [
      modelTypeFactory({ name: 'App.Post', count: 3 })
    ]
  });
  assert.equal(find('.js-model-type-count').eq(1).text().trim(), 3);
});

test("Records are successfully listed and bound", async function t(assert) {
  await visit('/data/model-types');

  await click(find('.js-model-type').find('a').eq(1));

  let columns = find('.js-header-column');
  assert.equal(columns.eq(0).text().trim(), 'Id');
  assert.equal(columns.eq(1).text().trim(), 'Title');
  assert.equal(columns.eq(2).text().trim(), 'Body');

  let recordRows = find('.js-record-list-item');
  assert.equal(recordRows.length, 2);

  let firstRow = recordRows.eq(0);
  assert.equal(find('.js-record-column', firstRow).eq(0).text().trim(), 1);
  assert.equal(find('.js-record-column', firstRow).eq(1).text().trim(), 'My Post');
  assert.equal(find('.js-record-column', firstRow).eq(2).text().trim(), 'This is my first post');

  let secondRow = recordRows.eq(1);
  assert.equal(find('.js-record-column', secondRow).eq(0).text().trim(), 2);
  assert.equal(find('.js-record-column', secondRow).eq(1).text().trim(), 'Hello');
  assert.equal(find('.js-record-column', secondRow).eq(2).text().trim(), '');

  await triggerPort('data:recordsAdded', {
    records: [recordFactory({ objectId: 'new-post', id: 3, title: 'Added Post', body: 'I am new here' })]
  });

  let row = find('.js-record-list-item').eq(2);
  assert.equal(find('.js-record-column', row).eq(0).text().trim(), 3);
  assert.equal(find('.js-record-column', row).eq(1).text().trim(), 'Added Post');
  assert.equal(find('.js-record-column', row).eq(2).text().trim(), 'I am new here');

  await triggerPort('data:recordsUpdated', {
    records: [recordFactory({ objectId: 'new-post', id: 3, title: 'Modified Post', body: 'I am no longer new' })]
  });

  row = find('.js-record-list-item').last();
  assert.equal(find('.js-record-column', row).eq(0).text().trim(), 3);
  assert.equal(find('.js-record-column', row).eq(1).text().trim(), 'Modified Post');
  assert.equal(find('.js-record-column', row).eq(2).text().trim(), 'I am no longer new');

  await triggerPort('data:recordsRemoved', {
    index: 2,
    count: 1
  });
  await wait();

  assert.equal(find('.js-record-list-item').length, 2);
  let lastRow = find('.js-record-list-item').last();
  assert.equal(find('.js-record-column', lastRow).eq(0).text().trim(), 2, "Records successfully removed.");
});

test("Filtering records", async function t(assert) {
  await visit('/data/model-types');

  await click(find('.js-model-type').find('a').eq(1));

  let rows = find('.js-record-list-item');
  assert.equal(rows.length, 2);
  let filters = find('.js-filter');
  assert.equal(filters.length, 2);
  let newFilter = filters.filter(':contains(New)');
  await click(newFilter);

  rows = find('.js-record-list-item');
  assert.equal(rows.length, 1);
  assert.equal(find('.js-record-column', rows[0]).first().text().trim(), '2');
});

test("Searching records", async function t(assert) {
  await visit('/data/model-types');

  await click(find('.js-model-type').find('a').eq(1));

  let rows = find('.js-record-list-item');
  assert.equal(rows.length, 2);

  await fillIn('.js-records-search input', 'Hello');

  rows = find('.js-record-list-item');
  assert.equal(rows.length, 1);
  assert.equal(find('.js-record-column', rows[0]).first().text().trim(), '2');

  await fillIn('.js-records-search input', 'my first post');

  rows = find('.js-record-list-item');
  assert.equal(rows.length, 1);
  assert.equal(find('.js-record-column', rows[0]).first().text().trim(), '1');

  await fillIn('.js-records-search input', '');

  rows = find('.js-record-list-item');
  assert.equal(rows.length, 2);
});

test("Columns successfully updated when switching model types", async function t(assert) {
  await visit('/data/model-types/App.Post/records');
  assert.equal(find('.js-header-column:last').text().trim(), 'Body');
  await visit('/data/model-types/App.Comment/records');
  assert.equal(find('.js-header-column:last').text().trim(), 'Content');
});
