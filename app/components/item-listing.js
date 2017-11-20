import Component from '@ember/component';
import PagingActions from 'hospitalrun/mixins/paging-actions';
export default Component.extend(PagingActions, {
  classNames: ['panel', 'panel-primary']
});
