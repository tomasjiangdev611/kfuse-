import transform from 'lodash.transform';
import isEqual from 'lodash.isequal';
import isArray from 'lodash.isarray';
import isObject from 'lodash.isobject';
import { inspect } from 'util';

const findDiffs = (origObj, newObj) => {
  function changes(newObj, origObj) {
    let arrayIndexCounter = 0;
    return transform(newObj, function (result, value, key) {
      if (!isEqual(value, origObj[key])) {
        let resultKey = isArray(origObj) ? arrayIndexCounter++ : key;
        result[resultKey] =
          isObject(value) && isObject(origObj[key])
            ? changes(value, origObj[key])
            : value;
      }
    });
  }
  return changes(newObj, origObj);
};

export default findDiffs;
