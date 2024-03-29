/**
 * 重复执行任务，即两种基本的程序控制结构：迭代、递归。
 */

// 1.迭代
// for 循环是最常见的迭代形式之一，适合在预先知道迭代次数时使用
function forLoop(n) {
  let res = 0;
  // 循环求和 1, 2, ..., n-1, n
  for (let i = 1; i <= n; i++) {
    res += i;
  }
  return res;
}

// 在 while 循环中，程序每轮都会先检查条件，如果条件为真，则继续执行，否则就结束循环。
function whileLoop(n) {
  let res = 0;
  let i = 1; // 初始化条件变量
  // 循环求和 1, 2, ..., n-1, n
  while (i <= n) {
    res += i;
    i++; // 更新条件变量
  }
  return res;
}
// while循环比 for循环的自由度更高。
// 在 while 循环中，我们可以自由地设计 条件变量的初始化和更新步骤
function whileLoopII(n) {
  let res = 0;
  let i = 1; // 初始化条件变量
  // 循环求和 1, 4, 10, ...
  while (i <= n) {
    res += i;
    /* while 循环（两次更新） */
    // 更新条件变量
    i++;
    i *= 2;
  }
  return res;
}
// 嵌套循环
function nestedForLoop(n) {
  let res = "";
  // 循环 i = 1, 2, ..., n-1, n
  for (let i = 1; i <= n; i++) {
    // 循环 j = 1, 2, ..., n-1, n
    for (let j = 1; j <= n; j++) {
      res += `(${i}, ${j}), `;
    }
  }
  return res;
}

// 2.递归 recursion 是一种算法策略，通过函数调用自身来解决问题
// 递：程序不断深入地调用自身，通常传入更小或更简化的参数，直到达到“终止条件”。
// 归：触发“终止条件”后，程序从最深层的递归函数开始逐层返回，汇聚每一层的结果。

/**
 * 而从实现的角度看，递归代码主要包含三个要素。
终止条件：用于决定什么时候由“递”转“归”。
递归调用：对应“递”，函数调用自身，通常输入更小或更简化的参数。
返回结果：对应“归”，将当前递归层级的结果返回至上一层。
 */
/* 递归 */
function recur(n) {
  // 终止条件
  if (n === 1) return 1;
  // 递：递归调用
  const res = recur(n - 1);
  // 归：返回结果
  return n + res;
}

// 迭代：“自下而上”地解决问题。从最基础的步骤开始，然后不断重复或累加这些步骤，直到任务完成。
// 递归：“自上而下”地解决问题。将原问题分解为更小的子问题，这些子问题和原问题具有相同的形式。接下来将子问题继续分解为更小的子问题，直到基本情况时停止（基本情况的解是已知的）

// ====== 调用栈 =======
// 递归函数每次调用自身时，系统都会为新开启的函数分配内存，以存储局部变量、调用地址和其他信息等。这将导致两方面的结果。
// 函数的上下文数据都存储在称为“栈帧空间”的内存区域中，直至函数返回后才会被释放。因此，递归通常比迭代更加耗费内存空间。
// 递归调用函数会产生额外的开销。因此递归通常比循环的时间效率更低。

// 尾递归：递归调用是函数返回前的最后一个操作，这意味着函数返回到上一层级后，无须继续执行其他操作，因此系统无须保存上一层函数的上下文
// 将上一次调用的结果 作为参数 传给下一次函数调用
/* 尾递归 */
function tailRecur(n, res) {
  // 终止条件
  if (n === 0) return res;
  // 尾递归调用
  return tailRecur(n - 1, res + n);
}

// ===== 递归树 =====
// 当处理与“分治”相关的算法问题时，递归往往比迭代的思路更加直观
/* 斐波那契数列：递归 */
function fib(n) {
  // 终止条件 f(1) = 0, f(2) = 1
  if (n === 1 || n === 2) return n - 1;
  // 递归调用 f(n) = f(n-1) + f(n-2)
  const res = fib(n - 1) + fib(n - 2);
  // 返回结果 f(n)
  return res;
}
// 函数内递归调用了两个函数，这意味着从一个调用产生了两个调用分支。 这样不断递归调用下去，最终将产生一棵层数为
// n 的「递归树 recursion tree」。

// 从算法角度看，搜索、排序、回溯、分治、动态规划等许多重要算法策略直接或间接地应用了这种思维方式。
// 从数据结构角度看，递归天然适合处理链表、树和图的相关问题，因为它们非常适合用分治思想进行分析。

// 事实上，“调用栈”和“栈帧空间”这类递归术语已经暗示了递归与栈之间的密切关系。
// 递：当函数被调用时，系统会在“调用栈”上为该函数分配新的栈帧，用于存储函数的局部变量、参数、返回地址等数据。
// 归：当函数完成执行并返回时，对应的栈帧会被从“调用栈”上移除，恢复之前函数的执行环境。

/* 使用迭代模拟递归 */
function forLoopRecur(n) {
  // 使用一个显式的栈来模拟系统调用栈
  const stack = [];
  let res = 0;
  // 递：递归调用
  for (let i = n; i > 0; i--) {
    // 通过“入栈操作”模拟“递”
    stack.push(i);
  }
  // 归：返回结果
  while (stack.length) {
    // 通过“出栈操作”模拟“归”
    res += stack.pop();
  }
  // res = 1+2+3+...+n
  return res;
}

// 复杂度
// 降低时间复杂度通常需要以提升空间复杂度为代价，反之亦然。我们将牺牲内存空间来提升算法运行速度的思路称为“以空间换时间”；反之，则称为“以时间换空间”。
// 选择哪种思路取决于我们更看重哪个方面。在大多数情况下，时间比空间更宝贵，因此“以空间换时间”通常是更常用的策略。当然，在数据量很大的情况下，控制空间复杂度也非常重要
// 暂存空间可分为暂存数据、栈帧空间和指令空间，其中栈帧空间通常仅在递归函数中影响空间复杂度

let tree = [
  {
    id: 1,
    title: "节点1",
    children: [
      {
        id: 11,
        title: "节点1-1",
        children: [
          {
            id: 111,
            title: "节点111",
          },
        ],
      },
      {
        id: 12,
        title: "节点12",
      },
    ],
  },
  {
    id: 2,
    title: "节点2",
    children: [
      {
        id: 21,
        title: "节点21",
      },
    ],
  },
];

function getOddNodes(tree, res = []) {
  if (!tree.length) return res;

  let queue = [...tree];
  let currNode = queue.shift();

  while (currNode) {
    const { id, children } = currNode;
    if (id % 2 !== 0) {
      res.push(id);
    }
    children.length && queue.push(...children);
  }
  console.log(res);
}

getOddNodes(tree);

// 非递归要用到栈这种数据结构，每个出栈的节点，要对其子节点按照后进先出的原则入栈：
function depthFirstTraversal(root, arr = []) {
  if (!root) return arr;
  let stack = [root],
    current;
  while ((current = stack.pop())) {
    const { element, children } = current;
    arr.push(element);
    for (let i = children.length - 1; i >= 0; i--) stack.push(children[i]);
  }
  return arr;
}

// 层序遍历，这里要用到队列这种数据结构，先进先出
function breadthFirstTraversal(root, arr = []) {
  if (!root) return;
  let queue = [root],
    current;
  while ((current = queue.shift())) {
    const { element, children } = current;
    arr.push(element);
    queue.push(...children);
  }
  return arr;
}
