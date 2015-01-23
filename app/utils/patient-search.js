export default {
    fields: ['externalPatientId','firstName','lastName'],
    filter: function (doc) {
        var uidx = doc._id.indexOf("_"),
            doctype = doc._id.substring(0, uidx);
        return (doctype === 'patient');
    }
};