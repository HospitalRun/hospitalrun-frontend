import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import UserSession from 'hospitalrun/mixins/user-session';
export default AbstractEditRoute.extend(UserSession, {
  editTitle: 'Edit Incident Category',
  modelName: 'inc-category',
  newTitle: 'New Incident Category'

});
