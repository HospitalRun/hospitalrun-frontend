import { Option } from '../shared/components/input/SelectWithLableFormGroup'
import useTranslator from '../shared/hooks/useTranslator'

const MedicationFieldsOptions = () => {
  const { t } = useTranslator()

  const statusOptionsNew: Option[] = [
    { label: t('medications.status.draft'), value: 'draft' },
    { label: t('medications.status.active'), value: 'active' },
  ]

  const statusOptionsEdit: Option[] = [
    { label: t('medications.status.active'), value: 'active' },
    { label: t('medications.status.onHold'), value: 'on hold' },
    { label: t('medications.status.completed'), value: 'completed' },
    { label: t('medications.status.enteredInError'), value: 'entered in error' },
    { label: t('medications.status.canceled'), value: 'canceled' },
    { label: t('medications.status.unknown'), value: 'unknown' },
  ]

  const intentOptions: Option[] = [
    { label: t('medications.intent.proposal'), value: 'proposal' },
    { label: t('medications.intent.plan'), value: 'plan' },
    { label: t('medications.intent.order'), value: 'order' },
    { label: t('medications.intent.originalOrder'), value: 'original order' },
    { label: t('medications.intent.reflexOrder'), value: 'reflex order' },
    { label: t('medications.intent.fillerOrder'), value: 'filler order' },
    { label: t('medications.intent.instanceOrder'), value: 'instance order' },
    { label: t('medications.intent.option'), value: 'option' },
  ]

  const priorityOptions: Option[] = [
    { label: t('medications.priority.routine'), value: 'routine' },
    { label: t('medications.priority.urgent'), value: 'urgent' },
    { label: t('medications.priority.asap'), value: 'asap' },
    { label: t('medications.priority.stat'), value: 'stat' },
  ]

  return {
    statusNew: statusOptionsNew,
    statusEdit: statusOptionsEdit,
    intent: intentOptions,
    priority: priorityOptions,
  }
}

export default MedicationFieldsOptions
