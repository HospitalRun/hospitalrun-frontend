import Ember from 'ember';
/* global req */
/* global compareStrings */
/* global getCompareDate */

function buildIndex(indexName, db) {
  return db.query(indexName, {
    limit: 0
  }).catch(function(err) {
    console.log(`index error: ${JSON.stringify(err, null, 2)}`);
  });
}

function createDesignDoc(item, rev) {
  let ddoc = {
    _id: `_design/${item.name}`,
    version: item.version,
    views: {
    }
  };
  if (rev) {
    ddoc._rev = rev;
  }
  ddoc.views[item.name] = { map: item.function.toString() };
  if (item.sort) {
    ddoc.lists = {
      sort: item.sort
    };
  }
  return ddoc;
}

function checkForUpdate(view, db, runningTest, testDumpFile) {
  return db.get(`_design/${view.name}`).then(function(doc) {
    if (doc.version !== view.version) {
      return updateDesignDoc(view, db, doc._rev, runningTest, testDumpFile);
    } else {
      if (runningTest) {
        // Indexes need to be built when running tests
        return buildIndex(view.name, db);
      } else {
        return Ember.RSVP.resolve();
      }
    }
  }, function() {
    return updateDesignDoc(view, db, null, runningTest, testDumpFile);
  });
}

function generateSortFunction(sortFunction, includeCompareDate, filterFunction) {
  let generatedFunction = 'function(head, req) {' +
    'function keysEqual(keyA, keyB) {' +
    'for (var i= 0; i < keyA.length; i++) {' +
    'if (keyA[i] !== keyB[i]) {' +
    'return false;' +
    '}' +
    '}' +
    'return true;' +
    '}';
  if (includeCompareDate) {
    generatedFunction += 'function getCompareDate(dateString) {' +
      'if (!dateString || dateString === "") {' +
      'return 0;' +
      '}' +
      'return new Date(dateString).getTime();' +
      '}';
  }
  generatedFunction += 'function compareStrings(aString, bString) {' +
    'if (!aString) {' +
    'aString = "";' +
    '}' +
    'if (!bString) {' +
    'bString = "";' +
    '}' +
    'if (aString < bString) {' +
    'return -1;' +
    '} else if (aString > bString) {' +
    'return 1;' +
    '} else {' +
    'return 0;' +
    '}' +
    '}' +
    'var row,' +
    'rows=[],' +
    'startingPosition = 0;' +
    'while(row = getRow()) {' +
    'rows.push(row);' +
    '}';
  if (filterFunction) {
    generatedFunction += `rows = rows.filter(${filterFunction});`;
  }
  generatedFunction += `rows.sort(${sortFunction});` +
    'if (req.query.sortDesc) {' +
    'rows = rows.reverse();' +
    '}' +
    'if (req.query.sortStartKey) {' +
    'var startKey = JSON.parse(req.query.sortStartKey);' +
    'for (var i=0; i<rows.length; i++) {' +
    'if (keysEqual(startKey, rows[i].key)) {' +
    'startingPosition = i;' +
    'break;' +
    '}' +
    '}' +
    '}' +
    'if (req.query.sortLimit) {' +
    'rows = rows.slice(startingPosition, parseInt(req.query.sortLimit)+startingPosition);' +
    '} else if (startingPosition > 0) {' +
    'rows = rows.slice(startingPosition);' +
    '}' +
    'send(JSON.stringify({"rows" : rows}));' +
    '}';
  return generatedFunction;
}

function generateView(viewDocType, viewBody) {
  return `function(doc) {
    var doctype, uidx;
    if (doc._id && (uidx = doc._id.indexOf('_')) > 0 && !doc.data.archived) {
      doctype = doc._id.substring(0, uidx);
      if (doctype === '${viewDocType}') {
        ${viewBody}
      }
    }
  }`;
}

function updateDesignDoc(item, db, rev, runningTest, testDumpFile) {
  let designDoc = createDesignDoc(item, rev);
  if (runningTest) {
    console.log(`WARNING: The view ${item.name} is out of date. Please update the pouch dump ${testDumpFile} to the latest version of ${item.name}`);
  }
  return db.put(designDoc).then(function() {
    // Update index
    return buildIndex(item.name, db);
  }, function(err) {
    console.log('ERR updating design doc:', JSON.stringify(err, null, 2));
    // ignored, design doc already exists
  });
}

function generateDateForView(date1) {
  return `var ${date1} = doc.data.${date1};
    if (${date1} && ${date1} !== "") {
      ${date1} = new Date(${date1});
      if (${date1}.getTime) {
        ${date1} = ${date1}.getTime();
      }
    }`;
}

let patientListingKey = `if (doc.data.friendlyId) {
    emit([doc.data.friendlyId, doc._id]);
  } else if (doc.data.externalPatientId) {
    emit([doc.data.externalPatientId, doc._id]);
  } else {
    emit([doc._id, doc._id]);
 }`;

let patientListingSearch = generateSortFunction(function(a, b) {
  let sortBy = '';
  if (req.query && req.query.sortKey) {
    sortBy = req.query.sortKey;
  }
  switch (sortBy) {
    case 'firstName':
    case 'sex':
    case 'lastName':
    case 'status': {
      return compareStrings(a.doc.data[sortBy], b.doc.data[sortBy]);
    }
    case 'dateOfBirth': {
      return getCompareDate(a.doc.data.dateOfBirth) - getCompareDate(b.doc.data.dateOfBirth);
    }
    default: {
      return 0; // Don't sort
    }
  }
}.toString(), true);

let designDocs = [{
  name: 'appointments_by_date',
  function: generateView('appointment',
    `${generateDateForView('endDate')}
    ${generateDateForView('startDate')}
    emit([startDate, endDate, doc._id]);`
  ),
  sort: generateSortFunction(function(a, b) {
    function defaultStatus(value) {
      if (!value || value === '') {
        return 'Scheduled';
      } else {
        return value;
      }
    }
    let sortBy = '';
    if (req.query && req.query.sortKey) {
      sortBy = req.query.sortKey;
    }
    switch (sortBy) {
      case 'appointmentType':
      case 'location':
      case 'provider':
        return compareStrings(a.doc.data[sortBy], b.doc.data[sortBy]);
      case 'date': {
        let startDiff = getCompareDate(a.doc.data.startDate) - getCompareDate(b.doc.data.startDate);
        if (startDiff === 0) {
          return getCompareDate(a.doc.data.endDate) - getCompareDate(b.doc.data.endDate);
        } else {
          return startDiff;
        }
      }
      case 'status': {
        let aStatus = defaultStatus(a.doc.data[sortBy]);
        let bStatus = defaultStatus(b.doc.data[sortBy]);
        return compareStrings(aStatus, bStatus);
      }
      default: {
        return 0; // Don't sort
      }
    }
  }.toString(), true, function(row) {
    let filterBy = null;
    let includeRow = true;
    if (req.query && req.query.filterBy) {
      filterBy = JSON.parse(req.query.filterBy);
    }
    if (!filterBy) {
      return true;
    }
    for (let i = 0; i < filterBy.length; i++) {
      let currentValue = row.doc.data[filterBy[i].name];
      if (filterBy[i].name === 'status' && (!currentValue || currentValue === '')) {
        currentValue = 'Scheduled';
      }
      if (currentValue !== filterBy[i].value) {
        includeRow = false;
        break;
      }
    }
    return includeRow;
  }.toString()),
  version: 6
}, {
  name: 'appointments_by_patient',
  function: generateView('appointment',
    `${generateDateForView('endDate')}
    ${generateDateForView('startDate')}
    emit([doc.data.patient, startDate, endDate,doc._id]);`
  ),
  version: 4
}, {
  name: 'imaging_by_status',
  function: generateView('imaging',
    `${generateDateForView('imagingDate')}
    ${generateDateForView('requestedDate')}
    emit([doc.data.status, requestedDate, imagingDate, doc._id]);`
  ),
  version: 4
}, {
  name: 'inventory_by_name',
  function: generateView('inventory',
    'emit([doc.data.name, doc._id]);'
  ),
  sort: generateSortFunction(function(a, b) {
    let sortBy = '';
    if (req.query && req.query.sortKey) {
      sortBy = req.query.sortKey;
    }
    switch (sortBy) {
      case 'crossReference':
      case 'description':
      case 'friendlyId':
      case 'name':
      case 'price':
      case 'quantity':
      case 'inventoryType': {
        return compareStrings(a.doc.data[sortBy], b.doc.data[sortBy]);
      }
      default: {
        return 0; // Don't sort
      }
    }
  }.toString()),
  version: 5
}, {
  name: 'inventory_by_type',
  function: generateView('inventory',
    'emit(doc.data.inventoryType);'
  ),
  version: 5
}, {
  name: 'inventory_purchase_by_date_received',
  function: generateView('invPurchase',
    `${generateDateForView('dateReceived')}
    emit([dateReceived, doc._id]);`
  ),
  version: 5
}, {
  name: 'inventory_purchase_by_expiration_date',
  function: generateView('invPurchase',
    `${generateDateForView('expirationDate')}
    emit([expirationDate, doc._id]);`
  ),
  version: 5
}, {
  name: 'inventory_request_by_item',
  function: generateView('invRequest',
    `${generateDateForView('dateCompleted')}
    emit([doc.data.inventoryItem, doc.data.status, dateCompleted]);`
  ),
  version: 5
}, {
  name: 'inventory_request_by_status',
  function: generateView('invRequest',
    `${generateDateForView('dateCompleted')}
    emit([doc.data.status, dateCompleted, doc._id]);`
  ),
  version: 5
}, {
  name: 'invoice_by_patient',
  function: generateView('invoice',
    'emit(doc.data.patient);'
  ),
  version: 1
}, {
  name: 'invoice_by_status',
  function: generateView('invoice',
    `${generateDateForView('billDate')}
    emit([doc.data.status, billDate, doc._id]);`
  ),
  version: 4
}, {
  name: 'lab_by_status',
  function: generateView('lab',
    `${generateDateForView('labDate')}
    ${generateDateForView('requestedDate')}
    emit([doc.data.status, requestedDate, labDate, doc._id]);`
  ),
  version: 4
}, {
  name: 'medication_by_status',
  function: generateView('medication',
    `${generateDateForView('prescriptionDate')}
    ${generateDateForView('requestedDate')}
    emit([doc.data.status, requestedDate, prescriptionDate, doc._id]);`
  ),
  version: 4
}, {
  name: 'patient_by_display_id',
  function: generateView('patient', patientListingKey),
  sort: patientListingSearch,
  version: 7
}, {
  name: 'patient_by_status',
  function: generateView('patient',
    'emit(doc.data.status);'
  ),
  version: 3
}, {
  name: 'patient_by_admission',
  function: generateView('patient',
    `if (doc.data.admitted === true) {
      ${patientListingKey}
    }`
  ),
  sort: patientListingSearch,
  version: 4
}, {
  name: 'photo_by_patient',
  function: generateView('photo',
    'emit(doc.data.patient);'
  ),
  version: 4
}, {
  name: 'procedure_by_date',
  function: generateView('procedure',
    `${generateDateForView('procedureDate')}
    emit([procedureDate, doc._id]);`
  ),
  version: 4
}, {
  name: 'pricing_by_category',
  function: generateView('pricing',
    'emit([doc.data.category, doc.data.name, doc.data.pricingType, doc._id]);'
  ),
  version: 5
}, {
  name: 'sequence_by_prefix',
  function: generateView('sequence',
    'emit(doc.data.prefix);'
  ),
  version: 4
}, {
  name: 'visit_by_date',
  function: generateView('visit',
    `${generateDateForView('endDate')}
    ${generateDateForView('startDate')}
    emit([startDate, endDate, doc._id]);`
  ),
  version: 4
}, {
  name: 'visit_by_discharge_date',
  function: generateView('visit',
    `${generateDateForView('endDate')}
    emit([endDate, doc._id]);`
  ),
  version: 2
}, {
  name: 'visit_by_patient',
  function: generateView('visit',
    `${generateDateForView('endDate')}
    ${generateDateForView('startDate')}
    emit([doc.data.patient, startDate, endDate, doc.data.visitType, doc._id]);`
  ),
  version: 4
}];

export default function(db, runningTest, testDumpFile) {
  let viewUpdates = [];
  designDocs.forEach(function(item) {
    viewUpdates.push(checkForUpdate(item, db, runningTest, testDumpFile));
  });
  return Ember.RSVP.all(viewUpdates);
}
