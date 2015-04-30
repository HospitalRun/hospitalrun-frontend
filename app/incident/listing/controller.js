import Ember from "ember";
import UserSession from "hospitalrun/mixins/user-session";
export default Ember.ObjectController.extend(UserSession,{
    
    //userList: Ember.computed.alias('controllers.incident.userList')

    /*filteredIncidentsByUser: function(){
        console.log("filtering  incidents");
        var currentUser = this.getUserName();
        var userList = this.get('userList');
        var userObject = userList.findBy('name', currentUser);
        var incidents = [];
            if (!Ember.isEmpty(userObject)) {
                var userRoles = userObject.get('roles');
                user
                if(userRoles.isAny('Quality',true) || userRoles.isAny('admin',true)){
                    console.log("yes we have an admin user or a Quality user");
                    return this.store.find('incident');
                }
                else{
                    console.log("need to filter by user");
                    this.store.find('incident').forEach(function(incident){
                        var reportedBy = incident.get('reportedBy');
                        if( reportedBy === currentUser){
                            incidents.add(incident);
                        }
                        var reviewers = incident.get('reviewers');
                        reviewers.forEach(function(reviewer) {
                            var email = reviewer.get('reviewerEmail'),
                                userObj = userList.findBy('email', email),
                                reviewerName = userObj.get('reviewerName');
                                if(reviewerName ===currentUser){
                                    incidents.add(incident);
                                }


                        });
                        return incidents;

                    });
            }
        }
      
    }.property('model.@each')*/

});