import Ember from 'ember';
const { run, Test: { registerHelper } } = Ember;
export default registerHelper('triggerPort', async function t(app, ...args) {
  run(() => app.__container__.lookup('port:main').trigger(...args));
  await wait();
});

