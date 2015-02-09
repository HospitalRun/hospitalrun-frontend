import Ember from 'ember';
import PatientSearch from 'hospitalrun/utils/patient-search';
import PricingSearch from 'hospitalrun/utils/pricing-search';
import InventorySearch from 'hospitalrun/utils/inventory-search';
/* global emit */
function createDesignDoc(name, mapFunction) {
    var ddoc = {
        _id: '_design/' + name,
        views: {
        }
    };
    ddoc.views[name] = { map: mapFunction.toString() };
    return ddoc;
}


function appointmentsByDate(doc) {
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
}

function appointmentsByPatient(doc) {
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
}

function imagingByStatus(doc) {
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
}

function inventoryByType(doc) {
    var doctype,
        uidx;
    if (doc._id && (uidx = doc._id.indexOf("_")) > 0) {
        doctype = doc._id.substring(0, uidx);
        if (doctype === 'inventory') {
            emit([doc.type, doc._id]); 
        }   
    }    
}

function inventoryPurchaseByExpirationDate(doc) {
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
}
function inventoryPurchaseByDateReceived(doc) {
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
}


function inventoryRequestByStatus(doc) {
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
}

function labByStatus(doc) {
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
}

function medicationByStatus(doc) {
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
}

function photoByPatient(doc) {
    var doctype,
        uidx;
    if (doc._id && (uidx = doc._id.indexOf("_")) > 0) {
        doctype = doc._id.substring(0, uidx);
        if (doctype === 'photo') {
            emit([doc.patient, doc._id]); 
        }   
    }
}

function pricingByCategory(doc) {
    var doctype,
        uidx;
    if (doc._id && (uidx = doc._id.indexOf("_")) > 0) {
        doctype = doc._id.substring(0, uidx);
        if (doctype === 'pricing') {
            emit([doc.category, doc._id]); 
        }   
    }
}

function procedureByDate(doc) {
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
}


function sequenceByPrefix(doc) {
    var doctype,
        uidx;
    if (doc._id && (uidx = doc._id.indexOf("_")) > 0) {
        doctype = doc._id.substring(0, uidx);
        if (doctype === 'sequence') {
            emit(doc.prefix); 
        }   
    }
    
}

function visitByDate(doc) {
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
}

function visitByPatient(doc) {
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
}
    
var designDocs = [{
    name: 'appointments_by_date',
    function: appointmentsByDate    
}, {
    name: 'appointments_by_patient',
    function: appointmentsByPatient    
}, {
    name: 'imaging_by_status',
    function: imagingByStatus
}, {    
    name: 'inventory_by_type',
    function: inventoryByType
}, {    
    name: 'inventory_purchase_by_date_received',
    function: inventoryPurchaseByDateReceived
}, {    
    name: 'inventory_purchase_by_expiration_date',
    function: inventoryPurchaseByExpirationDate
}, {
    name: 'inventory_request_by_status',
    function: inventoryRequestByStatus    
}, {
    name: 'lab_by_status',
    function: labByStatus
}, {
    name: 'medication_by_status',
    function: medicationByStatus
}, {
    name: 'photo_by_patient',
    function: photoByPatient
}, {
    name: 'procedure_by_date',
    function: procedureByDate
}, {
    name: 'pricing_by_category',
    function: pricingByCategory
}, {
    name: 'sequence_by_prefix',
    function: sequenceByPrefix
}, {
    name: 'visit_by_date',
    function: visitByDate
}, {
    name: 'visit_by_patient',
    function: visitByPatient
}];

var searchIndexes = [
    InventorySearch,
    PatientSearch,
    PricingSearch
];

export default function(db) {
    searchIndexes.forEach(function(searchIndex) {
        var searchIndexBuild = Ember.copy(searchIndex);
        searchIndexBuild.build = true;
        db.search(searchIndexBuild).then(function (info) {
            console.log("Built search idx",info);
        }).catch(function (err) {
            console.log("ERROR Build search idx",err);
        });
    });
    
    var designDoc;
    designDocs.forEach(function(item) {
        designDoc = createDesignDoc(item.name, item.function);
        db.put(designDoc).then(function () {
            // design doc created!
            //Update index
            db.query(item.name, {stale: 'update_after'}); 
        }, function() {
            //ignored, design doc already exists
        });
    });
}