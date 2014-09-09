export default Ember.Mixin.create({
    /**
     * Calculate a new id based on time stamp and randomized number
     * @return a generated id in base 36 so that its a shorter barcode.
     */
        /**
     * Calculate a new id based on time stamp and randomized number
     * @return a generated id in base 36 so that its a shorter barcode.
     */
    generateId: function() {
        var min = 1,
            max = 999,
            part1 = new Date().getTime(),
            part2 = Math.floor(Math.random() * (max - min + 1)) + min;
        return part1.toString(36) +'_' + part2.toString(36);
    }
});