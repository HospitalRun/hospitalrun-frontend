import AbstractPagedController from 'hospitalrun/controllers/abstract-paged-controller';
import UserSession from 'hospitalrun/mixins/user-session';
export default AbstractPagedController.extend(UserSession, {
  addPermission: 'add_incident',
  deletePermission: 'delete_incident',
  startKey: [],

  actions: {
    showDeleteIncident: function(incident) {
      this.send('openModal', 'incident.delete', incident);
    }
  }
});
