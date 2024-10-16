// 链式调用的核心就在于调用完的方法将自身实例返回

class LinkCall {
  constructor(name) {
    this.name = name;
  }
  call(params) {
    console.log(params);
    this.params = params;
    // 核心点在于最后返回实例本身
    return this;
  }
}
const linkCall = new LinkCall("james");

linkCall.call("call one").call("call two").call("call three");

/**
 * 实现链式调用
 * 实例的方法返回实例本身就可以链式调用
 */
// 四则运算类
class ASMD {
  constructor(value) {
    this.value = value;
  }
  add(num) {
    console.log("add", num);
    this.value += num;
    return this;
  }
  subtract(num) {
    console.log("subtract", num);
    this.value -= num;
    return this;
  }
  multiply(num) {
    console.log("multiply", num);
    this.value *= num;
    return this;
  }
  divide(num) {
    console.log("divide", num);
    this.value /= num;
    return this;
  }
}

const num = new ASMD(0);
const result = num.add(10).subtract(2).divide(4).multiply(100).value;
console.log(result);
