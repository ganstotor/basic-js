const { NotImplementedError } = require('../extensions/index.js');

/**
 * Create transformed array based on the control sequences that original
 * array contains
 * 
 * @param {Array} arr initial array
 * @returns {Array} transformed array
 * 
 * @example
 * 
 * transform([1, 2, 3, '--double-next', 4, 5]) => [1, 2, 3, 4, 4, 5]
 * transform([1, 2, 3, '--discard-prev', 4, 5]) => [1, 2, 4, 5]
 * 
 */
function transform(arr) {
  if (!Array.isArray(arr)) {
      throw new Error("'arr' parameter must be an instance of the Array!");
  }

  const result = [];
  const controlSequences = {
      '--discard-next': (i, tempResult) => ({ skipNext: true, tempResult }),
      '--discard-prev': (i, tempResult) => {
          if (tempResult.length > 0 && !tempResult._skipNext) {
              tempResult.pop();
          }
          return { skipNext: false, tempResult };
      },
      '--double-next': (i, tempResult) => {
          if (i + 1 < arr.length) {
              tempResult.push(arr[i + 1]);
          }
          return { skipNext: false, tempResult };
      },
      '--double-prev': (i, tempResult) => {
          if (tempResult.length > 0 && !tempResult._skipNext) {
              tempResult.push(tempResult[tempResult.length - 1]);
          }
          return { skipNext: false, tempResult };
      }
  };

  let skipNext = false;

  for (let i = 0; i < arr.length; i++) {
      if (skipNext) {
          skipNext = false;
          continue;
      }

      const controlAction = controlSequences[arr[i]];
      if (controlAction) {
          const actionResult = controlAction(i, result);
          skipNext = actionResult.skipNext;
      } else {
          result.push(arr[i]);
      }

      result._skipNext = skipNext;
  }

  delete result._skipNext;

  return result;
}

module.exports = {
  transform
};
