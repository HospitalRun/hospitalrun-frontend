import DS from 'ember-data';

const { AdapterError } = DS;

let UnauthorizedError = function(errors, message = 'The adapter operation is unauthorized') {
  AdapterError.call(this, errors, message);
};

UnauthorizedError.prototype = Object.create(AdapterError.prototype);

export default UnauthorizedError;
