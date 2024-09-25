/**
 * 实现一个函数 getItemOfString, 查找字符串中出现最多的项
 * 输入：'aswfswawbsdaawdaw'
 * 返回一个统计对象，key为字符，value为出现次数 { a: 5 }
 */
const s = "aswfswawbswdaawdaw";
console.log(getItemOfString(s));

function getItemOfString(str) {
  if (!str || typeof str !== "string") return;

  let obj = Object.create(null);
  let itemCount = 0;
  let itemStr;

  for (const item of str) {
    obj[item] = obj[item] ? ++obj[item] : 1;
  }

  Object.keys(obj).forEach((item) => {
    if (obj[item] > itemCount) {
      itemStr = item;
      itemCount = obj[item];
    }
  });

  return {
    [itemStr]: itemCount,
  };
}
