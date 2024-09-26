// 说一下以下代码执行后，输出的结果和顺序
setTimeout(function () {
  console.log("a");
});

new Promise(function (resolve) {
  console.log("b");
  for (let i = 1; i < 10; i++) {
    console.log(i);
    i === 10 && resolve();
  }
}).then(function () {
  console.log("c");
});

console.log("d");


