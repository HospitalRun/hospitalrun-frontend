/* global emit */
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

    
var designDocs = [{
    name: 'appointments_by_date',
    function: function(doc) {
        var doctype,
            uidx;
        if (doc._id && (uidx = doc._id.indexOf("_")) > 0) {
            doctype = doc._id.substring(0, uidx);
            if(doctype === 'appointment') {
                var endDate = doc.endDate,
                    startDate = doc.startDate;
                if (endDate && endDate !== '') {
                    endDate = new Date(endDate);
                    if (endDate.getTime) {
                        endDate = endDate.getTime();
                    }
                }
                if (startDate && startDate !== '') {
                    startDate = new Date(startDate);
                    if (startDate.getTime) {
                        startDate = startDate.getTime(); 
                    }
                }
                emit([startDate, endDate, doc._id]);
            }
        }
    },
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
                var startDiff = getCompareDate(a.doc.startDate) -getCompareDate(b.doc.startDate);
                if (startDiff === 0) {
                    return getCompareDate(a.doc.endDate) -getCompareDate(b.doc.endDate);
                } else {
                    return startDiff;
                }
                break;
            }
            case 'status': {
                var aStatus = defaultStatus(a.doc[sortBy]),
                    bStatus = defaultStatus(b.doc[sortBy]);
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
    version: 3
}, {
    name: 'appointments_by_patient',
    function: function(doc) {
        var doctype,
            uidx;
        if (doc._id && (uidx = doc._id.indexOf("_")) > 0) {
            doctype = doc._id.substring(0, uidx);
            if(doctype === 'appointment') {
                var endDate = doc.endDate,
                    startDate = doc.startDate;
                if (endDate && endDate !== '') {
                    endDate = new Date(endDate);
                    if (endDate.getTime) {
                        endDate = endDate.getTime();
                    }
                }
                if (startDate && startDate !== '') {
                    startDate = new Date(startDate);
                    if (startDate.getTime) {
                        startDate = startDate.getTime(); 
                    }
                }
                emit([doc.patient, startDate, endDate,doc._id]);
            }
        }
    },
    version: 2
}, {
    name: 'imaging_by_status',
    function: function(doc) {
        var doctype,
            uidx;
        if (doc._id && (uidx = doc._id.indexOf("_")) > 0) {
            doctype = doc._id.substring(0, uidx);
            if(doctype === 'imaging') {
                var imagingDate = doc.imagingDate,
                    requestedDate = doc.requestedDate;
                if (imagingDate && imagingDate !== '') {
                    imagingDate = new Date(imagingDate);
                    if (imagingDate.getTime) {
                        imagingDate = imagingDate.getTime(); 
                    }
                }
                if (requestedDate && requestedDate !== '') {
                    requestedDate = new Date(requestedDate);
                    if (requestedDate.getTime) {
                        requestedDate = requestedDate.getTime(); 
                    }
                }            
                emit([doc.status, requestedDate, imagingDate, doc._id]);
            }
        }    
    },
    version: 2
}, {    
    name: 'inventory_by_name',
    function: function(doc) {
        var doctype,
            uidx;
        if (doc._id && (uidx = doc._id.indexOf("_")) > 0) {
            doctype = doc._id.substring(0, uidx);
            if (doctype === 'inventory') {
                emit([doc.name, doc._id]); 
            }   
        }    
    },
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
    version: 1
}, {    
    name: 'inventory_by_type',
    function: function(doc) {
        var doctype,
            uidx;
        if (doc._id && (uidx = doc._id.indexOf("_")) > 0) {
            doctype = doc._id.substring(0, uidx);
            if (doctype === 'inventory') {
                emit(doc.type); 
            }   
        }    
    },
    version: 2
}, {    
    name: 'inventory_purchase_by_date_received',
    function: function(doc) {
        var doctype,
            uidx;
        if (doc._id && (uidx = doc._id.indexOf("_")) > 0) {
            doctype = doc._id.substring(0, uidx);
            if (doctype === 'inv-purchase') {
                var dateReceived = doc.dateReceived;
                if (dateReceived && dateReceived !== '') {
                    dateReceived = new Date(dateReceived);
                    if (dateReceived.getTime) {
                        dateReceived = dateReceived.getTime();
                    }
                }
                emit([dateReceived, doc._id]); 
            }   
        }
    },
    version: 2
}, {    
    name: 'inventory_purchase_by_expiration_date',
    function: function(doc) {
        var doctype,
            uidx;
        if (doc._id && (uidx = doc._id.indexOf("_")) > 0) {
            doctype = doc._id.substring(0, uidx);
            if (doctype === 'inv-purchase') {
                var expirationDate = doc.expirationDate;
                if (expirationDate && expirationDate !== '') {
                    expirationDate = new Date(expirationDate);
                    if (expirationDate.getTime) {
                        expirationDate = expirationDate.getTime();
                    }
                }
                emit([expirationDate, doc._id]); 
            }   
        }
    },
    version: 2
}, {
    name: 'inventory_request_by_item',
    function: function(doc) {
        var doctype,
            uidx;    
        if (doc._id && (uidx = doc._id.indexOf("_")) > 0) {
            doctype = doc._id.substring(0, uidx);
            if(doctype === 'inv-request') {
                var dateCompleted = doc.dateCompleted;
                if (dateCompleted && dateCompleted !== '') {
                    dateCompleted = new Date(dateCompleted);
                    if (dateCompleted.getTime) {
                        dateCompleted = dateCompleted.getTime();
                    }
                }
                emit([doc.inventoryItem, doc.status, dateCompleted]);
            }
        }    
    },
    version: 2
}, {
    name: 'inventory_request_by_status',
    function: function(doc) {
        var doctype,
            uidx;    
        if (doc._id && (uidx = doc._id.indexOf("_")) > 0) {
            doctype = doc._id.substring(0, uidx);
            if(doctype === 'inv-request') {
                var dateCompleted = doc.dateCompleted;
                if (dateCompleted && dateCompleted !== '') {
                    dateCompleted = new Date(dateCompleted);
                    if (dateCompleted.getTime) {
                        dateCompleted = dateCompleted.getTime();
                    }
                }
                emit([doc.status, dateCompleted, doc._id]);
            }
        }    
    },
    version: 2
}, {
    name: 'invoice_by_status',
    function: function(doc) {
        var doctype,
            uidx;    
        if (doc._id && (uidx = doc._id.indexOf("_")) > 0) {
            doctype = doc._id.substring(0, uidx);
            if(doctype === 'invoice') {
                var billDate = doc.billDate;
                if (billDate && billDate !== '') {
                    billDate= new Date(billDate);
                    if (billDate.getTime) {
                        billDate = billDate.getTime();
                    }
                }
                emit([doc.status, billDate, doc._id]);
            }
        }    
    }, 
    version: 2
}, {
    name: 'lab_by_status',
    function: function(doc) {
        var doctype,
            uidx;
        if (doc._id && (uidx = doc._id.indexOf("_")) > 0) {
            doctype = doc._id.substring(0, uidx);
            if(doctype === 'lab') {
                var labDate = doc.labDate,
                    requestedDate = doc.requestedDate;            
                if (labDate && labDate !== '') {
                    labDate = new Date(labDate);
                    if (labDate.getTime) {
                        labDate = labDate.getTime(); 
                    }
                }
                if (requestedDate && requestedDate !== '') {
                    requestedDate = new Date(requestedDate);
                    if (requestedDate.getTime) {
                        requestedDate = requestedDate.getTime(); 
                    }
                }                 
                emit([doc.status, requestedDate, labDate, doc._id]);
            }
        }    
    },
    version: 2
}, {
    name: 'medication_by_status',
    function: function(doc) {
        var doctype,
            uidx;    
        if (doc._id && (uidx = doc._id.indexOf("_")) > 0) {
            doctype = doc._id.substring(0, uidx);
            if(doctype === 'medication') {
                var prescriptionDate = doc.prescriptionDate,
                    requestedDate = doc.requestedDate;
                if (prescriptionDate && prescriptionDate !== '') {
                    prescriptionDate = new Date(prescriptionDate);
                    if (prescriptionDate.getTime) {
                        prescriptionDate = prescriptionDate.getTime(); 
                    }
                }
                if (requestedDate && requestedDate !== '') {
                    requestedDate = new Date(requestedDate);
                    if (requestedDate.getTime) {
                        requestedDate = requestedDate.getTime(); 
                    }
                }              
                emit([doc.status, requestedDate, prescriptionDate, doc._id]);
            }
        }    
    },
    version: 2
}, {    
    name: 'patient_by_display_id',
    function: function(doc) {
        var doctype,
            uidx;
        if (doc._id && (uidx = doc._id.indexOf("_")) > 0) {
            doctype = doc._id.substring(0, uidx);
            if (doctype === 'patient') {
                if (doc.friendlyId) {
                    emit([doc.friendlyId, doc._id]);
                } else if (doc.externalPatientId) {
                    emit([doc.externalPatientId, doc._id]);
                } else {
                    emit([doc._id, doc._id]);
                }
            }   
        }
    },
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
                return compareStrings(a.doc[sortBy], b.doc[sortBy]);
            }
            case 'dateOfBirth': {
                return getCompareDate(a.doc.dateOfBirth) -getCompareDate(b.doc.dateOfBirth);
            }
            default: {
                return 0; //Don't sort
            }
        }
    }.toString(), true),
    version: 3
}, {    
    name: 'patient_by_status',
    function: function(doc) {
        var doctype,
            uidx;
        if (doc._id && (uidx = doc._id.indexOf("_")) > 0) {
            doctype = doc._id.substring(0, uidx);
            if (doctype === 'patient') {                
                emit(doc.status);
            }
        }
    },
    version: 1
}, {
    name: 'photo_by_patient',
    function: function(doc) {
        var doctype,
            uidx;
        if (doc._id && (uidx = doc._id.indexOf("_")) > 0) {
            doctype = doc._id.substring(0, uidx);
            if (doctype === 'photo') {
                emit(doc.patient); 
            }   
        }
    },
    version: 2
}, {
    name: 'procedure_by_date',
    function: function(doc) {
        var doctype,
            uidx;
        if (doc._id && (uidx = doc._id.indexOf("_")) > 0) {
            doctype = doc._id.substring(0, uidx);
            if(doctype === 'procedure') {
                var procedureDate = doc.procedureDate;
                if (procedureDate && procedureDate !== '') {
                    procedureDate = new Date(procedureDate);
                    if (procedureDate.getTime) {
                        procedureDate = procedureDate.getTime(); 
                    }
                }
                emit([procedureDate, doc._id]);
            }
        }
    },
    version: 2
}, {
    name: 'pricing_by_category',
    function: function(doc) {
        var doctype,
            uidx;
        if (doc._id && (uidx = doc._id.indexOf("_")) > 0) {
            doctype = doc._id.substring(0, uidx);
            if (doctype === 'pricing') {
                emit([doc.category, doc.name, doc.type, doc._id]); 
            }   
        }
    },
    version: 2
}, {
    name: 'sequence_by_prefix',
    function: function(doc) {
        var doctype,
            uidx;
        if (doc._id && (uidx = doc._id.indexOf("_")) > 0) {
            doctype = doc._id.substring(0, uidx);
            if (doctype === 'sequence') {
                emit(doc.prefix); 
            }   
        }
    },
    version: 2
}, {
    name: 'visit_by_date',
    function:  function(doc) {
        var doctype,
            uidx;
        if (doc._id && (uidx = doc._id.indexOf("_")) > 0) {
            doctype = doc._id.substring(0, uidx);
            if(doctype === 'visit') {
                var endDate = doc.endDate,
                    startDate = doc.startDate;
                if (endDate && endDate !== '') {
                    endDate = new Date(endDate);
                    if (endDate.getTime) {
                        endDate = endDate.getTime();
                    }
                }
                if (startDate && startDate !== '') {
                    startDate = new Date(startDate);
                    if (startDate.getTime) {
                        startDate = startDate.getTime(); 
                    }
                }
                emit([startDate, endDate, doc._id]);
            }
        }
    },
    version: 2
}, {
    name: 'visit_by_patient',
    function: function(doc) {
        var doctype,
            uidx;
        if (doc._id && (uidx = doc._id.indexOf("_")) > 0) {
            doctype = doc._id.substring(0, uidx);
            if(doctype === 'visit') {
                var endDate = doc.endDate,
                    startDate = doc.startDate;
                if (endDate && endDate !== '') {
                    endDate = new Date(endDate);
                    if (endDate.getTime) {
                        endDate = endDate.getTime();
                    }
                }
                if (startDate && startDate !== '') {
                    startDate = new Date(startDate);
                    if (startDate.getTime) {
                        startDate = startDate.getTime(); 
                    }
                }
                emit([doc.patient, startDate, endDate, doc.visitType, doc._id]);
            }
        }
    },
    version: 2
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