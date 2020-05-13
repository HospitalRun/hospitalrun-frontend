import actions from './actions'
import dashboard from './dashboard'
import patient from './patient'
import patients from './patients'
import scheduling from './scheduling'
import states from './states'
import sex from './sex'
import labs from './labs'
import incidents from './incidents'

export default {
  ...actions,
  ...dashboard,
  ...patient,
  ...patients,
  ...scheduling,
  ...states,
  ...sex,
  ...labs,
  ...incidents,
}
