import LabsIndexRoute from 'hospitalrun/labs/index/route';
import { t } from 'hospitalrun/macro';

export default LabsIndexRoute.extend({
  pageTitle: t('labs.completedTitle'),
  searchStatus: 'Completed'
});
