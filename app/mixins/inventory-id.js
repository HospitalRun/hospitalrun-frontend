import Ember from 'ember';
export default Ember.Mixin.create({
  /**
   * Calculate a new id based on time stamp and randomized number
   * @return a generated id in base 36 so that its a shorter barcode.
   */
  generateId: function() {
    let min = 1;
    let max = 999;
    let part1 = new Date().getTime();
    let part2 = Math.floor(Math.random() * (max - min + 1)) + min;
    return Ember.RSVP.resolve(`${part1.toString(36)}_${part2.toString(36)}`);
  }
});
