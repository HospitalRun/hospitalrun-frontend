import { module } from 'qunit';
import { resolve } from 'rsvp';
import { setContext, unsetContext } from '@ember/test-helpers';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

export default function(name, options = {}) {
  module(name, {
    beforeEach() {
      this.application = startApp();

      setContext(this);

      if (options.beforeEach) {
        return options.beforeEach.apply(this, arguments);
      }
    },

    afterEach() {
      let afterEach = options.afterEach && options.afterEach.apply(this, arguments);
      return resolve(afterEach).then(() => {
        unsetContext();
        return destroyApp(this.application);
      });
    }
  });
}
