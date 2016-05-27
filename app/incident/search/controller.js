import IncidentSearchResultsController from 'hospitalrun/incident/index/controller';
export default IncidentSearchResultsController.extend({

  canSearch: function() {
    return this.currentUserCan('edit_others_incident');
  }.property()
});