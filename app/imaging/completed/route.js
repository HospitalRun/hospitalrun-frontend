import { t } from 'hospitalrun/macro';
import ImagingIndexRoute from 'hospitalrun/imaging/index/route';
export default ImagingIndexRoute.extend({
  pageTitle: t('imaging.titles.completedImaging'),
  searchStatus: 'Completed'
});
