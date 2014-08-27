import UserSession from "hospitalrun/mixins/user-session";
export default Ember.Controller.extend(UserSession, {
    indexLinks: [
        'Appointments',
        'Labs',
        'Imaging',
        'Inventory',
        'Medication',
        'Patients',
        'Users'
    ],
    
    activeLinks: function() {
        var activeLinks = [],
            indexLinks = this.get('indexLinks');
        indexLinks.forEach(function(link) {
            var action = link.toLowerCase();
            if (this.currentUserCan(action)) {
                activeLinks.push({
                    action: action,
                    text: link
                });
            }
        }.bind(this));
        return activeLinks;
    }.property('indexLinks')

});