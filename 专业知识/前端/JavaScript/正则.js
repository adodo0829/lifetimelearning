// input只允许输入数字，保留小数点，不能0开头
function clearNoNum(obj) {
  console.log(obj.value);
  //先把非数字的都替换掉，除了数字和.
  obj.value = obj.value.replace(/[^\d.]/g, "");
  //保证只有出现一个.而没有多个.
  obj.value = obj.value.replace(/\.{2,}/g, ".");
  //必须保证第一个为数字而不是.
  obj.value = obj.value.replace(/^\./g, "");
  //保证.只出现一次，而不能出现两次以上
  obj.value = obj.value
    .replace(".", "$#$")
    .replace(/\./g, "")
    .replace("$#$", ".");
  //只能输入两个小数
  obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, "$1$2.$3");
  //如果没有小数点，首位不能为类似于 01、02的金额
  if (obj.value.indexOf(".") < 0 && obj.value != "") {
    obj.value = parseFloat(obj.value);
  }
  //如果第一位是0，第二位不是点，就用数字把点替换掉
  var len1 = obj.value.substr(0, 1);
  var len2 = obj.value.substr(1, 1);
  if (obj.value.length > 1 && len1 == 0 && len2 != ".") {
    obj.value = obj.value.substr(1, 1);
  }
}
