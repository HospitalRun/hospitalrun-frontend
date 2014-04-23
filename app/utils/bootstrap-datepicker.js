Ember.EasyForm.TextField.reopen({
    didInsertElement : function() {
        var wrapperElement = this.$().closest('div.input');
        if (wrapperElement.hasClass('datetime')) {
            this.renderDatetime();
            return;
        }

        if (wrapperElement.hasClass('date')) {
            this.renderDate();
            return;
        }
    },
    renderDatetime : function() {
        this.renderDatePicker({
            format : 'd.m.Y H:i',
            lang : 'en',
            step : 15,
            closeOnWithoutClick : true
        });
    },
    renderDate : function() {
        this.renderDatePicker({
            format : 'd.m.Y',
            lang : 'en',
            timepicker : false
        });
    },
    renderDatePicker : function(pickerOptions) {
        var picker = this.$().datetimepicker(pickerOptions);

        this.$().unbind().blur(function() {
            picker.datetimepicker('hide');
        });

        var pickButton = $(
                '<span class="input-group-btn"><button id="image_button" class="btn btn-default" type="button"><span class="glyphicon glyphicon-calendar"></button></span></span>')
                .click(function() {
                    picker.datetimepicker('show');
                });
        var inputGroupDiv = $('<div class="input-group"/>');
        var containerDiv = this.$().closest('div');
        inputGroupDiv.append(pickButton);
        containerDiv.find('input').appendTo(inputGroupDiv);
        containerDiv.prepend(inputGroupDiv);
    }
});