/**
 * 实现一个chunk函数
 * 将一维数组转化二维分段数组
 * [1,2,3,4,5,6,7] => [[1,2,3], [4,5,6], [7]]
 */

let arr = [1, 2, 3, 4, 5, 6, 7];
// chunk(arr, 3); // [[1,2,3], [4,5,6], [7]]

function transformArray(arr) {
  if (!Array.isArray(arr)) return;
  const { length } = arr;
  let result = [];
  let endIndex;

  for (let i = 0; i < length; i++) {
    if ((i + 1) % 3 === 0) {
      endIndex = i;
      result.push(arr.slice(i - 2, i + 1));
    }
  }

  if (length % 3 !== 0) {
    result.push(arr.slice(endIndex + 1, length));
  }
  console.log(result);
}

let array = [1, 2, 3, 4, 5, 6, 7, 8];
transformArray(array);
