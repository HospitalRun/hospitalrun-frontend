function Metric() {
  this.count = 0;
  this.time = 0;
  this.startTime = undefined;
}

Metric.prototype.start = function() {
  this.startTime = process.hrtime();
  this.count++;
};

Metric.prototype.stop = function() {
  var change = process.hrtime(this.startTime);

  this.time += change[0] * 1e9 + change[1];
  this.startTime = undefined;
};

Metric.prototype.toJSON = function() {
  return {
    count: this.count,
    time: this.time
  };
};

module.exports = Metric;
