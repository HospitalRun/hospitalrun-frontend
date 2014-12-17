import Ember from "ember";
import UserRoles from 'hospitalrun/mixins/user-roles';
export default Ember.ObjectController.extend(UserRoles, {
    displayRole: function() {        
        var roles = this.get('roles');
        if (!Ember.isEmpty(roles)) {
            return roles[0];
        }
    }.property('roles')
});
