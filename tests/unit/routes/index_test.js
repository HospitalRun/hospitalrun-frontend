import {
  test,
  moduleFor
} from 'hospitalrun/tests/helpers/module_for';

import Index from 'hospitalrun/routes/index';

moduleFor('route:index', "Unit - IndexRoute");

test("it exists", function(){
  ok(this.subject() instanceof Index);
});

test("#model", function(){
  deepEqual(this.subject().model(), ['red', 'yellow', 'blue']);
});
