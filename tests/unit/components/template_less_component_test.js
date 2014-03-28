import {
  test,
  moduleForComponent
} from 'hospitalrun/tests/helpers/module_for';

moduleForComponent('template-less');

test("template", function(){
  var component = this.subject();
  ok(this.$());
});
