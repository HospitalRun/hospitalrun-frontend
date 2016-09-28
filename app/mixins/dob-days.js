import Ember from 'ember';
export default Ember.Mixin.create({
  convertDOBToText: function(birthDate, shortFormat, omitDays) {
    var today = new Date(),
      years = 0,
      months = 0,
      days = 0;

    if (birthDate) {
      if (birthDate.getFullYear === undefined) {
        birthDate = moment(birthDate, 'l').toDate();
      }
      if (birthDate.getFullYear !== undefined) {
        years = today.getFullYear() - birthDate.getFullYear();
        if (today.getMonth() < birthDate.getMonth() ||
          (today.getMonth() === birthDate.getMonth() &&
          today.getDate() < birthDate.getDate())) {
          years--;
        }
      }

      if (birthDate.getMonth) {
        months = today.getMonth() - birthDate.getMonth();
        days = today.getDate() - birthDate.getDate();
        if (months <= 0) {
          if (days < 0) {
            months += 11;
          } else if (months < 0) {
            months += 12;
          }
        } else {
          if (days < 0) {
            months = months - 1;
          }
        }
      }

      if (birthDate.getDate) {
        days = today.getDate() - birthDate.getDate();
        if (days < 0) {
          days += 30;
        }
      }
    }

    var formatString = '';
    let options = {
      years: years,
      days: days,
      months: months
    };
    let t = this.get('i18n').t;
    if (shortFormat) {
      if (years > 0) {
        formatString = t('dates.short', options);
      } else {
        formatString = t('dates.shortOmitYears', options);
      }
    } else if (omitDays) {
      if (years > 1) {
        formatString = t('dates.longOmitDaysPlural', options);
      } else if (years === 1) {
        formatString = t('dates.longOmitDays', options);
      } else {
        formatString = t('dates.longOmitDaysYears', options);
      }
    } else {
      if (years > 1) {
        formatString = t('dates.longPlural', options);
      } else if (years === 1) {
        formatString = t('dates.long', options);
      } else {
        formatString = t('dates.longOmitYears', options);
      }
    }
    return formatString;

  }
});
