export default {
    fields: ['friendlyId','reportedBy','locationOfIncident','categoryName'],
    filter: function (doc) {
        var uidx = doc._id.indexOf("_"),
            doctype = doc._id.substring(0, uidx);
        return (doctype === 'incident');
    }
};