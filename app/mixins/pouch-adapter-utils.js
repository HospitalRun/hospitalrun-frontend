export default Ember.Mixin.create({
    _idToPouchId: function(id, type){
        type = type.typeKey || type;
        return [type, id].join("_");
    },

    _pouchError: function(reject){
        return function(err){
            var errmsg = [  err["status"], 
                (err["name"] || err["error"])+":",
                (err["message"] || err["reason"])
               ].join(" ");
            Ember.run(null, reject, errmsg);
        };
    }
});