// webpack做的事情，仅仅是分析出各种模块的依赖关系，然后形成资源列表，最终打包生成到指定的文件中

// ====== loader ======
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
          { loader: "sass-loader" },
        ],
      },
    ],
  },
};

// webpack 只能理解 JavaScript 和 JSON 文件。
// loader 让 webpack 能够去处理其他类型的文件，并将它们转换为有效模块，以供应用程序使用，以及被添加到依赖图中
// 一个 Loader 其实就是一个 Node.js 模块，这个模块需要导出一个函数。
// 这个导出的函数的工作就是获得处理前的原内容，对原内容执行处理后，返回处理后的内容。

// 在处理css模块的时候，use属性中配置了三个loader分别处理css文件
// 因为loader支持链式调用，链中的每个loader会处理之前已处理过的资源，最终变为js代码。
// 顺序为相反的顺序执行，即上述执行方式为sass-loader、css-loader、style-loader

// loader 可以是同步的，也可以是异步的
// loader 运行在 Node.js 中，并且能够执行任何操作
// 除了常见的通过 package.json 的 main 来将一个 npm 模块导出为 loader，还可以在 module.rules 中使用 loader 字段直接引用一个模块
// 插件(plugin)可以为 loader 带来更多特性
// loader 能够产生额外的任意文件
// 可以通过 loader 的预处理函数，为 JavaScript 生态系统提供更多能力。用户现在可以更加灵活地引入细粒度逻辑，例如：压缩、打包、语言翻译和更多其他特性

// 可以简单通过在 rule 对象设置 path.resolve 指向这个本地文件

// {
//   test: /\.js$/
//   use: [
//     {
//       loader: path.resolve('path/to/loader.js'),
//       options: {/* ... */}
//     }
//   ]
// }

// ================ plugin ==================

// Plugin（Plug-in）是一种计算机应用程序，它和主应用程序互相交互，以提供特定的功能
// 是一种遵循一定规范的应用程序接口编写出来的程序，只能运行在程序规定的系统下，因为其需要调用原纯净系统提供的函数库或者数据

// plugin赋予其各种灵活的功能，例如打包优化、资源管理、环境变量注入等，它们会运行在 webpack 的不同阶段（钩子 / 生命周期），贯穿了webpack整个编译周期
// 解决loader不能做的事情

// 其本质是一个具有apply方法javascript对象
// apply 方法会被 webpack compiler调用，并且在整个编译生命周期都可以访问 compiler对象

// 关于整个编译生命周期钩子，有如下：

// entry-option ：初始化 option
// run
// compile： 真正开始的编译，在创建 compilation 对象之前
// compilation ：生成好了 compilation 对象
// make 从 entry 开始递归分析依赖，准备对每个模块进行 build
// after-compile： 编译 build 过程结束
// emit ：在将内存中 assets 内容写到磁盘文件夹之前
// after-emit ：在将内存中 assets 内容写到磁盘文件夹之后
// done： 完成所有的编译过程
// failed： 编译失败的时候

// 区别
// 1.设计上
// loader 是文件加载器，能够加载资源文件，并对这些文件进行一些处理，诸如编译、压缩等，最终一起打包到指定的文件中,
// 其本质为函数，函数中的 this 作为上下文会被 webpack 填充

// plugin 赋予了 webpack 各种灵活的功能，例如打包优化、资源管理、环境变量注入等，目的是解决 loader 无法实现的其他事
// 由于webpack基于发布订阅模式，在运行的生命周期中会广播出许多事件，插件通过监听这些事件，就可以在特定的阶段执行自己的插件任务

// 2.生命周期
// loader 运行在打包文件之前
// plugins 在整个编译周期都起作用
// 在Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过Webpack提供的 API改变输出结果
// 对于loader，实质是一个转换器，将A文件进行编译形成B文件，操作的是文件，比如将A.scss或A.less转变为B.css，单纯的文件转换过程

// compiler：包含了 webpack 环境的所有的配置信息，包括 options，loader 和 plugin，和 webpack 整个生命周期相关的钩子
// compilation：作为 plugin 内置事件回调函数的参数，包含了当前的模块资源、编译生成资源、变化的文件以及被跟踪依赖的状态信息。当检测到一个文件变化，一次新的 Compilation 将被创建

class MyPlugin {
  // 插件必须是一个函数或者是一个包含 apply 方法的对象，这样才能访问compiler实例
  // 传给每个插件的 compiler 和 compilation 对象都是同一个引用，因此不建议修改
  // 异步的事件需要在插件处理完任务时调用回调函数通知 Webpack 进入下一个流程，不然会卡住

  // Webpack 会调用 MyPlugin 实例的 apply 方法给插件实例传入 compiler 对象
  apply(compiler) {
    // 找到合适的事件钩子，实现自己的插件功能
    compiler.hooks.emit.tap("MyPlugin", (compilation) => {
      // compilation: 当前打包构建流程的上下文
      console.log(compilation);

      // do something...
    });
  }
}
