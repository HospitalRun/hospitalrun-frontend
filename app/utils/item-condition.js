import Ember from 'ember';

const rankMultiplierValues = [
  {
    rank: 'A',
    value: 0.5
  },
  {
    rank: 'B',
    value: 1
  },
  {
    rank: 'C',
    value: 2
  }
];

export function rankToMultiplier(rank = 'B') {
  let rankModel = Ember.A(rankMultiplierValues).findBy('rank', rank);
  return rankModel.value;
}

export function getCondition(estimatedDaysOfStock, multiplier = 1) {
  estimatedDaysOfStock *= multiplier;

  if (estimatedDaysOfStock >= 14) {
    return 'good';
  } else if (estimatedDaysOfStock < 7) {
    return 'bad';
  } else {
    return 'average';
  }
}
