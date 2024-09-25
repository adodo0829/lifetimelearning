let nestArray = [
  {
    id: 1,
    title: "节点1",
    children: [
      {
        id: 11,
        title: "节点11",
        children: [
          {
            id: 111,
            title: "节点111",
            children: [],
          },
        ],
      },
      {
        id: 12,
        title: "节点12",
        children: [],
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
        children: [],
      },
      {
        id: 22,
        title: "节点22",
        children: [],
      },
    ],
  },
];

// 提取出嵌套数据id为奇数的节点， 返回一个由于节点title组成的新数组
// 1.递归方式实现
function getOddNodesByRecursion(tree, res = []) {}
// 2.循环方式实现
function getOddNodesByTraversal(tree, res = []) {}

// ========== solve =======
function getOddNodesByRecursion(tree, res = []) {
  tree.forEach((node) => {
    if (node.id % 2 !== 0) {
      res.push(node.title);
    }
    if (node.children && node.children.length) {
      getOddNodesByRecursion(node.children, res);
    }
  });
  console.log("getOddNodesByRecursion", res);
}

function getOddNodesByTraversal(tree, res = []) {
  if (!tree.length) return res;

  let queue = tree;
  let currNode = queue.shift();

  while (currNode) {
    const { id, children, title } = currNode;
    if (id % 2 !== 0) {
      res.push(title);
    }
    currNode = queue.shift(); // 一边取，一遍存
    if (children && children.length) {
      queue.push(...children);
    }
  }

  console.log("getOddNodesByTraversal", res);
}
