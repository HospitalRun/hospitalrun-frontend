/* global req */
/* global compareStrings */
/* global getCompareDate */

function createDesignDoc(item, rev) {
    var ddoc = {
        _id: '_design/' + item.name,
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

function generateSortFunction(sortFunction, includeCompareDate, filterFunction) {
    var generatedFunction = 'function(head, req) {' +
        'function keysEqual(keyA, keyB) {' +
            'for (var i= 0; i < keyA.length; i++) {' +
                'if (keyA[i] !== keyB[i]) {'+
                    'return false;'+
                '}'+
            '}'+
            'return true;'+
        '}';
    if (includeCompareDate) {
        generatedFunction += 'function getCompareDate(dateString) {'+
            'if (!dateString || dateString === "") {'+
                'return 0;'+
            '}'+
            'return new Date(dateString).getTime();'+
        '}';
    }
    generatedFunction += 'function compareStrings(aString, bString) {'+
            'if (!aString) {'+
                'aString = "";'+
            '}'+
            'if (!bString) {'+
                'bString = "";'+
            '}'+
            'if (aString < bString) {'+
                'return -1;'+
            '} else if (aString > bString) {'+
                'return 1;'+
            '} else {'+
                'return 0;'+
            '}'+
        '}'+
        'var row,'+
            'rows=[],'+
            'startingPosition = 0;'+
        'while(row = getRow()) {'+
            'rows.push(row);'+
        '}';
    if (filterFunction) {
        generatedFunction += 'rows = rows.filter('+filterFunction+');';
    }
    generatedFunction += 'rows.sort('+sortFunction+');'+
        'if (req.query.sortStartKey) {'+
            'var startKey = JSON.parse(req.query.sortStartKey);'+
            'for (var i=0; i<rows.length; i++) {'+
                'if (keysEqual(startKey, rows[i].key)) {'+
                    'startingPosition = i;'+
                    'break;'+
                '}'+
            '}'+
        '}'+
        'if (req.query.sortDesc) {'+
            'rows = rows.reverse();'+
        '}'+
        'if (req.query.sortLimit) {'+
            'rows = rows.slice(startingPosition, parseInt(req.query.sortLimit)+startingPosition);'+
        '} else if (startingPosition > 0) {'+
            'rows = rows.slice(startingPosition);'+
        '}'+
        'send(JSON.stringify({"rows" : rows}));'+
    '}';
    return generatedFunction;
}

function generateView(viewDocType, viewBody) {
    return 'function(doc) {'+
        'var doctype,'+
            'uidx;'+
        'if (doc._id && (uidx = doc._id.indexOf("_")) > 0) {'+
            'doctype = doc._id.substring(0, uidx);'+            
            'if(doctype === "'+viewDocType+'") {'+
                viewBody+
            '}'+
        '}'+
    '}';
}

function updateDesignDoc(item, db, rev) {
    var designDoc = createDesignDoc(item, rev);
    db.put(designDoc).then(function () {
        // design doc created!
        //Update index
        db.query(item.name, {stale: 'update_after'}); 
    }, function(err) {
        console.log("ERR updateDesignDoc:",err);
        //ignored, design doc already exists
    });   
}

function generateDateForView(date1) {
    return 'var '+date1+' = doc.data.'+date1+';'+
    'if ('+date1+' && '+date1+' !== "") {'+
        date1+' = new Date('+date1+');'+
        'if ('+date1+'.getTime) {'+
            date1+' = '+date1+'.getTime();'+
        '}'+
    '}';
    
}

    
var designDocs = [{
    name: 'appointments_by_date',
    function: generateView('apppointment',
        generateDateForView('endDate')+
        generateDateForView('startDate')+
        'emit([startDate, endDate, doc._id]);'                            
    ),
    sort: generateSortFunction(function(a,b) {
        function defaultStatus(value) {
            if (!value || value === '') {
                return 'Scheduled';
            } else {
                return value;
            }
        }
        var sortBy = '';
        if (req.query && req.query.sortKey) {
            sortBy = req.query.sortKey;
        }
        switch(sortBy) {
            case 'appointmentType':
            case 'location':
            case 'provider':
                return compareStrings(a.doc[sortBy], b.doc[sortBy]);
            case 'date': {
                var startDiff = getCompareDate(a.doc.data.startDate) -getCompareDate(b.doc.data.startDate);
                if (startDiff === 0) {
                    return getCompareDate(a.doc.data.endDate) -getCompareDate(b.doc.data.endDate);
                } else {
                    return startDiff;
                }
                break;
            }
            case 'status': {
                var aStatus = defaultStatus(a.doc.data[sortBy]),
                    bStatus = defaultStatus(b.doc.data[sortBy]);
                return compareStrings(aStatus, bStatus);
            }
            default: {
                return 0; //Don't sort
            }
        }
    }.toString(), true, function(row) {
        var i, 
            filterBy = null,
            includeRow = true;
        if (req.query && req.query.filterBy) {
            filterBy = JSON.parse(req.query.filterBy);
        }
        if (!filterBy) {
            return true;
        }
        for (i=0; i < filterBy.length; i++) {
            var currentValue = row.doc[filterBy[i].name];
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
    version: 4
}, {
    name: 'appointments_by_patient',
    function: generateView('apppointment',
        generateDateForView('endDate')+
        generateDateForView('startDate')+
        'emit([doc.data.patient, startDate, endDate,doc._id]);'
    ),
    version: 3
}, {
    name: 'imaging_by_status',
    function: generateView('imaging',
        generateDateForView('imagingDate')+
        generateDateForView('requestedDate')+
        'emit([doc.data.status, requestedDate, imagingDate, doc._id]);'
    ),
    version: 3
}, {    
    name: 'inventory_by_name',
    function: generateView('inventory',
        'emit([doc.data.name, doc._id]);'
    ),
    sort: generateSortFunction(function(a,b) {
        var sortBy = '';
        if (req.query && req.query.sortKey) {
            sortBy = req.query.sortKey;
        }
        switch(sortBy) {
            case 'crossReference':
            case 'description':
            case 'friendlyId':
            case 'name':
            case 'price':
            case 'quantity':
            case 'type': {
                return compareStrings(a.doc[sortBy], b.doc[sortBy]);
            }
            default: {
                return 0; //Don't sort
            }
        }
    }.toString()),    
    version: 2
}, {    
    name: 'inventory_by_type',
    function: generateView('inventory',
        'emit(doc.data.type);'
    ),
    version: 3
}, {    
    name: 'inventory_purchase_by_date_received',
    function: generateView('inv-purchase',
        generateDateForView('dateReceived')+
        'emit([dateReceived, doc._id]);'
    ),
    version: 3
}, {    
    name: 'inventory_purchase_by_expiration_date',
    function: generateView('inv-purchase',
        generateDateForView('expirationDate')+
        'emit([expirationDate, doc._id]);'
    ),
    version: 3
}, {
    name: 'inventory_request_by_item',
    function: generateView('inv-request',
        generateDateForView('dateCompleted')+
        'emit([doc.data.inventoryItem, doc.data.status, dateCompleted]);'
    ),
    version: 3
}, {
    name: 'inventory_request_by_status',
    function: generateView('inv-request',
        generateDateForView('dateCompleted')+
        'emit([doc.data.status, dateCompleted, doc._id]);'
    ),
    version: 3
}, {
    name: 'invoice_by_status',
    function: generateView('invoice',
        generateDateForView('billDate')+
        'emit([doc.data.status, billDate, doc._id]);'
    ), 
    version: 3
}, {
    name: 'lab_by_status',
    function: generateView('lab',
        generateDateForView('labDate')+
        generateDateForView('requestedDate')+
        'emit([doc.data.status, requestedDate, labDate, doc._id]);'
    ),
    version: 3
}, {
    name: 'medication_by_status',
    function: generateView('medication',
        generateDateForView('prescriptionDate')+
        generateDateForView('requestedDate')+
        'emit([doc.data.status, requestedDate, prescriptionDate, doc._id]);'
    ),
    version: 3
}, {    
    name: 'patient_by_display_id',
    function: generateView('patient',
        'if (doc.data.friendlyId) {'+
            'emit([doc.data.friendlyId, doc._id]);'+
        '} else if (doc.data.externalPatientId) {'+
            'emit([doc.data.externalPatientId, doc._id]);'+
        '} else {'+
            'emit([doc._id, doc._id]);'+
        '}'
    ),
    sort: generateSortFunction(function(a,b) {
        var sortBy = '';
        if (req.query && req.query.sortKey) {
            sortBy = req.query.sortKey;
        }
        switch(sortBy) {
            case 'firstName':
            case 'gender':
            case 'lastName':
            case 'status': {
                return compareStrings(a.doc.data[sortBy], b.doc.data[sortBy]);
            }
            case 'dateOfBirth': {
                return getCompareDate(a.doc.data.dateOfBirth) -getCompareDate(b.doc.data.dateOfBirth);
            }
            default: {
                return 0; //Don't sort
            }
        }
    }.toString(), true),
    version: 4
}, {    
    name: 'patient_by_status',
    function: generateView('patient',
        'emit(doc.data.status);'
    ),
    version: 2
}, {
    name: 'photo_by_patient',
    function: generateView('photo',
        'emit(doc.data.patient);'
    ),
    version: 3
}, {
    name: 'procedure_by_date',
    function: generateView('procedure',
        generateDateForView('procedureDate')+        
        'emit([procedureDate, doc._id]);'
    ),
    version: 3
}, {
    name: 'pricing_by_category',
    function: generateView('pricing',
        'emit([doc.data.category, doc.data.name, doc.data.type, doc._id]);'
    ),
    version: 3
}, {
    name: 'sequence_by_prefix',
    function: generateView('sequence',
        'emit(doc.data.prefix);'
    ),
    version: 3
}, {
    name: 'visit_by_date',
    function: generateView('visit',
        generateDateForView('endDate')+
        generateDateForView('startDate')+
        'emit([startDate, endDate, doc._id]);'
    ),
    version: 3
}, {
    name: 'visit_by_discharge_date',
    function: generateView('visit',
        generateDateForView('endDate')+
        'emit([endDate, doc._id]);'
    ),
    version: 1
}, {
    name: 'visit_by_patient',
    function: generateView('visit',
        generateDateForView('endDate')+
        generateDateForView('startDate')+
        'emit([doc.data.patient, startDate, endDate, doc.data.visitType, doc._id]);'
    ),
    version: 3
}];

export default function(db) {
    designDocs.forEach(function(item) {
        db.get('_design/' + item.name).then(function(doc) {
            if (doc.version !== item.version) {
                updateDesignDoc(item, db, doc._rev);
            }
        }, function() {
            updateDesignDoc(item, db);
        });
    });
}