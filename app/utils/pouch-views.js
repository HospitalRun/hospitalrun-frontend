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
            emit([startDate, endDate]);
        }
    }
}

var designDocs = [{
    name: 'appointments_by_date',
    function: appointmentsByDate
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