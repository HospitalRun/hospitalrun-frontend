import Mixin from '@ember/object/mixin';
import moment from 'moment';
export default Mixin.create({
  convertDOBToText(birthDate, shortFormat, omitDays) {
    let today = new Date();
    let years = 0;
    let months = 0;
    let days = 0;

    if (birthDate) {
      if (birthDate.getFullYear === undefined) {
        birthDate = moment(birthDate, 'LLL').toDate();
      }

      birthDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (birthDate.getFullYear !== undefined) {
        years = today.getFullYear() - birthDate.getFullYear();
        if (today.getMonth() < birthDate.getMonth()
          || (today.getMonth() === birthDate.getMonth()
          && today.getDate() < birthDate.getDate())) {
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
      years,
      days,
      months
    };
    let intl = this.get('intl');
    if (shortFormat) {
      if (years > 0) {
        formatString = intl.t('dates.short', options);
      } else {
        formatString = intl.t('dates.shortOmitYears', options);
      }
    } else if (omitDays) {
      if (years > 1) {
        formatString = intl.t('dates.longOmitDaysPlural', options);
      } else if (years === 1) {
        formatString = intl.t('dates.longOmitDays', options);
      } else {
        formatString = intl.t('dates.longOmitDaysYears', options);
      }
    } else {
      if (years > 1) {
        formatString = intl.t('dates.longPlural', options);
      } else if (years === 1) {
        formatString = intl.t('dates.long', options);
      } else {
        formatString = intl.t('dates.longOmitYears', options);
      }
    }
    return formatString;

  }
});
