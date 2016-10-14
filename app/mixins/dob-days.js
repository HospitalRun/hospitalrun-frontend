import Ember from 'ember';
export default Ember.Mixin.create({
  convertDOBToText: function(birthDate, shortFormat, omitDays) {
    let today = new Date();
    let years = 0;
    let months = 0;
    let days = 0;

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

    let formatString = '';
    let options = {
      years: years,
      days: days,
      months: months
    };
    let i18n = this.get('i18n');
    if (shortFormat) {
      if (years > 0) {
        formatString = i18n.t('dates.short', options);
      } else {
        formatString = i18n.t('dates.shortOmitYears', options);
      }
    } else if (omitDays) {
      if (years > 1) {
        formatString = i18n.t('dates.longOmitDaysPlural', options);
      } else if (years === 1) {
        formatString = i18n.t('dates.longOmitDays', options);
      } else {
        formatString = i18n.t('dates.longOmitDaysYears', options);
      }
    } else {
      if (years > 1) {
        formatString = i18n.t('dates.longPlural', options);
      } else if (years === 1) {
        formatString = i18n.t('dates.long', options);
      } else {
        formatString = i18n.t('dates.longOmitYears', options);
      }
    }
    return formatString;

  }
});
