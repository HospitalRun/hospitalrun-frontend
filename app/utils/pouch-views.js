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

function imagingByStatus(doc) {
    var doctype,
        uidx;    
    if (doc._id && (uidx = doc._id.indexOf("_")) > 0) {
        doctype = doc._id.substring(0, uidx);
        if(doctype === 'imaging') {
            emit([doc.status, doc._id]);
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

function inventoryRequestByStatus(doc) {
    var doctype,
        uidx;    
    if (doc._id && (uidx = doc._id.indexOf("_")) > 0) {
        doctype = doc._id.substring(0, uidx);
        if(doctype === 'inv-request') {
            emit([doc.status, doc._id]);
        }
    }    
}

var designDocs = [{
    name: 'appointments_by_date',
    function: appointmentsByDate    
}, {
    name: 'imaging_by_status',
    function: imagingByStatus
}, {
    name: 'inventory_purchase_by_expiration_date',
    function: inventoryPurchaseByExpirationDate
}, {
    name: 'inventory_request_by_status',
    function: inventoryRequestByStatus
}];

export default function(db) {
    var designDoc;
    designDocs.forEach(function(item) {
        designDoc = createDesignDoc(item.name, item.function);
        db.put(designDoc).then(function () {
            // design doc created!
            //Update index
            db.query(item.name, {stale: 'update_after'}); 
        });
    });
}