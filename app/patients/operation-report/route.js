import OperativePlanRoute from 'hospitalrun/patients/operative-plan/route';
import { t } from 'hospitalrun/macro';

export default OperativePlanRoute.extend({
  editTitle: t('operationReport.titles.editTitle'),
  modelName: 'operation-report',
  newTitle: t('operationReport.titles.newTitle')
});
