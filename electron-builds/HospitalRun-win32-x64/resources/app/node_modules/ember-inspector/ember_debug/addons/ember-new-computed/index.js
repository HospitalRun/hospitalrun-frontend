import canUseNewSyntax from './utils/can-use-new-syntax';

const Ember = window.Ember;
const { computed } = Ember;

export default function() {
  let polyfillArguments = [];
  let config = arguments[arguments.length - 1];

  if (typeof config === 'function' || canUseNewSyntax) {
    return computed.apply(this, arguments);
  }

  for (let i = 0, l = arguments.length - 1; i < l; i++) {
    polyfillArguments.push(arguments[i]);
  }

  let func;
  if (config.set) {
    func = function(key, value) {
      if (arguments.length > 1) {
        return config.set.call(this, key, value);
      } else {
        return config.get.call(this, key);
      }
    };
  } else {
    func = function(key) {
      return config.get.call(this, key);
    };
  }

  polyfillArguments.push(func);

  return computed.apply(this, polyfillArguments);
}
