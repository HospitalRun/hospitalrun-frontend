import Ember from "ember";
export default Ember.Mixin.create({
    _idToPouchId: function(id, type){
        type = type.typeKey || type;
        return [type, id].join("_");
    },

    _pouchError: function(reject){
        return function(err){
            if (err.status === 401) {
                //User is unauthorized; reload to force login.                
                var session = this.get('session');
                if (!Ember.isEmpty(session)) {
                    session.invalidate();
                }
            }
            var errmsg = [  err["status"], 
                (err["name"] || err["error"])+":",
                (err["message"] || err["reason"])
               ].join(" ");
            Ember.run(null, reject, errmsg);
        }.bind(this);
    }
});