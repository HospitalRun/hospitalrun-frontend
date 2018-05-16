<<<<<<< HEAD
import Ember from 'ember';

export default function destroyApp(application) {
  Ember.run(application, 'destroy');
}
=======
import { run } from '@ember/runloop';

export default function destroyApp(application) {
  run(application, 'destroy');
}
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
