import Ember from "ember";
import TabRoute from "ember-inspector/routes/tab";
const $ = Ember.$;

export default TabRoute.extend({
  setupController() {
    this.get('port').on('route:currentRoute', this, this.setCurrentRoute);
    this.get('port').send('route:getCurrentRoute');
    this.get('port').on('route:routeTree', this, this.setTree);
    this.get('port').send('route:getTree');
  },

  deactivate() {
    this.get('port').off('route:currentRoute');
    this.get('port').off('route:routeTree', this, this.setTree);
  },

  setCurrentRoute(message) {
    this.get('controller').set('currentRoute', message.name);
  },

  setTree(options) {
    let routeArray = topSort(options.tree);
    this.set('controller.model', routeArray);
  }
});


function topSort(tree, list) {
  list = list || [];
  let route = $.extend({}, tree);
  delete route.children;
  // Firt node in the tree doesn't have a value
  if (route.value) {
    route.parentCount = route.parentCount || 0;
    list.push(route);
  }
  tree.children = tree.children || [];
  tree.children.forEach(child => {
    child.parentCount = route.parentCount + 1;
    topSort(child, list);
  });
  return list;
}
