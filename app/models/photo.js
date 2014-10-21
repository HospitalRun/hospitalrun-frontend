import AbstractModel from "hospitalrun/models/abstract";

export default AbstractModel.extend({
    _attachments: DS.attr(), //Temporarily store file as attachment until it gets uploaded to the server
    coverImage: DS.attr('boolean'),
    fileName: DS.attr('string'),
    localFile: DS.attr('boolean'),
    patient: DS.belongsTo('patient'),
    caption: DS.attr('string'),
    serverUrl: DS.attr('string'),
    url: DS.attr('string'),
        
    downloadImageFromServer: function(imageRecord) {
        var me = this,
            serverUrl = imageRecord.get('serverUrl'),
            xhr = new XMLHttpRequest();
        if (!Ember.isEmpty(serverUrl)) {
            //Make sure directory exists or is created before downloading.
            this.getPatientDirectory(imageRecord.get('patientId'));            
            xhr.open('GET', serverUrl, true);
            xhr.responseType = 'blob';
            xhr.onload = function() {  
                var file = new Blob([xhr.response]);
                me.addImageToFileStore(file, null, imageRecord);
            };
            xhr.send();
        }
    },
});
