// 函数柯里化概念
// 柯里化（Currying）是把接受多个参数的函数转变为接受一个单一参数的函数，并且返回接受余下的参数且返回结果的新函数的技术。

function add(a) {
  return function (b) {
    return function (c) {
      return a + b + c;
    };
  };
}
console.log(add(1)(2)(3)); // 6

// 参数长度固定
const curry = (fn) =>
  (judge = (...args) =>
    args.length === fn.length
      ? fn(...args)
      : (...arg) => judge(...args, ...arg));
const add = (a, b, c) => a + b + c;
const curryAdd = curry(add);
console.log(curryAdd(1)(2)(3)); // 6

// 参数长度不固定
function add(...args) {
  // 求和
  return args.reduce((a, b) => a + b);
}
function currying(fn) {
  let args = [];
  return function temp(...newArgs) {
    if (newArgs.length) {
      args = [...args, ...newArgs];
      return temp;
    } else {
      let val = fn.apply(this, args);
      args = []; // 保证再次调用时清空
      return val;
    }
  };
}

let addCurry = currying(add);
console.log(addCurry(1)(2)(3)(4, 5)()); //15

function add(...args) {
  return args.reduce((prev, curr) => prev + curr, 0);
}

function curryFn(fn) {
  let tempArgs = [];
  return function callFn(...args) {
    if (args.length) {
      // collect参数
      tempArgs = [...tempArgs, ...args];
      return callFn;
    } else {
      // 直接调用了
      let v = fn.apply(this, args);
      tempArgs = [];
      return v;
    }
  };
}

// const curryAdd = curryFn(add);

//参数确定
let currying = (fn) => {
  let args = [];

  return function temp(...newArgs) {
    args.push(...newArgs);
    if (args.length === fn.length) {
      const val = fn.apply(this, args);
      args = [];
      return val;
    } else {
      return temp;
    }
  };
};
