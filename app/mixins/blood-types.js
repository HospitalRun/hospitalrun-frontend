import Mixin from '@ember/object/mixin';
import SelectValues from 'hospitalrun/utils/select-values';
export default Mixin.create({
  bloodTypes: [
    'A+',
    'A1+ (A1 +ve)',
    'A-',
    'A1- (A1 −ve)',
    'A1B+ (A1B +ve)',
    'A1B- (A1B −ve)',
    'AB+',
    'AB1+ (AB1 +ve)',
    'AB1- (AB1 -ve)',
    'AB-',
    'A2+ (A2 +ve)',
    'A2- (A2 −ve)',
    'A2B+ (A2B +ve)',
    'A2B- (A2B −ve)',
    'AB2+ (AB2 +ve)',
    'AB2- (AB1 +ve)',
    'B+',
    'B+ (B +ve)',
    'B-',
    'B- (B −ve)',
    'B1+ (B1 +ve)',
    'O+',
    'O+ (O +ve)',
    'O- (O −ve)',
    'O-'
  ].map(SelectValues.selectValuesMap)
});
