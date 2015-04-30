import AbstractPagedController from 'hospitalrun/controllers/abstract-paged-controller';
import Ember from "ember";
import UserSession from "hospitalrun/mixins/user-session";
export default AbstractPagedController.extend(UserSession,{
    needs: ['incident','incident/edit','pouchdb'],
    addPermission: 'add_incident',
    deletePermission: 'delete_incident',
    incidentsList: [],

    userList: Ember.computed.alias('controllers.incident.userList'),


    getCurrentUserName: function(){
        return this.getUserName(true);
     }


});