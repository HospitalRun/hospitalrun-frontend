import OperativePlanRoute from 'hospitalrun/patients/operative-plan/route';
import { translationMacro as t } from 'ember-intl';

export default OperativePlanRoute.extend({
  editTitle: t('operationReport.titles.editTitle'),
  modelName: 'operation-report',
  newTitle: t('operationReport.titles.newTitle')
});
