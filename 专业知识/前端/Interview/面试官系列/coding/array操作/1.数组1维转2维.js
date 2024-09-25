/**
 * 实现一个chunk函数, chunk(arr, n)
 * 将一维数组转化二维的分段数组, n为内层数组最大长度，不够长度时自动补到最后位
 * [1,2,3,4,5,6,7] => [[1,2,3], [4,5,6], [7]]
 */
function chunk(arr, n) {
  let res = [];
  // ===== TODO ======
  return res;
}
let arr = [1, 2, 3, 4, 5, 6, 7];
// 当n=3时
chunk(arr, 3); // [[1,2,3], [4,5,6], [7]]
// 当n=2时
chunk(arr, 2); // [[1,2], [3，4], [5,6], [7]]


// ===== array的slice切片用法
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

function chunk1(input, size) {
  size = Math.max(toInteger(size), 0);
  if (!Array.isArray(input)) {
    return [];
  }
  if (size < 1) {
    return [];
  }
  const n = input.length;
  const result = [];
  let start = 0; // 遍历自增+n
  while (start < n) {
    result.push(input.slice(start, start + size));
    start += size;
  }
  return result;
}
