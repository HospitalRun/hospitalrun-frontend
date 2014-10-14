function Logger(selector) {
  this.el = document.querySelector(selector);
}

Logger.prototype.log = function(msg) {
  this.el.innerHTML += msg
};

Logger.prototype.clear = function() {
  this.el.textContent = '';
};
