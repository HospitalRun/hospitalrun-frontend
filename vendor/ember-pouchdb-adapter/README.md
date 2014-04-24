
PouchDB 2.1 adapter for Ember Data 1.0.0
========================================

This Ember-Data adapter allows an Ember.js app with Ember-Data model
layer to store its data in PouchDB databases.

PouchDB makes it possible to synchronize the data with CouchDB and 
keep the data on the client-side persistently, i.e. surviving browser refreshes
and restarts. PouchDB automatically detects available backends on the client, e.g.
IndexedDB, WebSQL or even LocalStorage and more.


Ember Data 1.0.0 is still not released [(and probably won't)](http://emberjs.com/blog/2014/03/18/the-road-to-ember-data-1-0.html),
so this project is aimed at supporting the latest beta release until
there is a stable branch.

This project supports PouchDB 2.1, it may work with previous versions, though.
The main focus is to use all the latest features of PouchDB to enhance performance,
therefore this may break the backwards compatibility.

Usage
-----

```javascript
App = Ember.Application.create();

App.ApplicationAdapter = DS.PouchDBAdapter.extend({
  databaseName: 'myapp'
});
```

Future Plans
------------

* use strict jshint
* Support interoperability between many pouchdb databases and
  records in different adapters having the PouchDB serializer
* remove sideloading (when Ember-Data supports truly async relationships)
* add batch save (when Ember-Data supports it)
* support Ember-Data SSOT, allowing to remove redundant both-sided relationship keys 
  and expensive consistency keeping on writes

Author
------

Paul Koch (kulpae)

http://uraniumlane.net





