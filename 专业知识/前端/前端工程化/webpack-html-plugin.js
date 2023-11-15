// HtmlWebpackPluginAfterHtmlProcessing

// 扩展 HtmlwebpackPlugin 插入自定义的内容

/**
所有的插件定义在 plugins 中，插件组成的一个数组，每个元素是一个插件的对象实例，具体传递什么参数，是你自己定义的。

从使用方式中可以看出，其实我们需要一个 JavsScript 的类函数，也就是说，写 webpack 插件就是定义一个这样的函数，这个函数需要接收参数。

webpack 还要求这个对象提供一个名为 apply 的函数，这个函数定义在插件的原型上，webpack 会调用插件实例的这个方法，在调用的时候还会传递一个参数，以便我们访问 webpack 的上下文信息
 */

/** 自定义插件，插入打包日期版本号 */
const needToRelacePath = "/web-eoms/js/app.js";

class SelfHtmlWebpackPlugin {
  constructor(options) {
    this.options = options || {};
  }

  getJsFilePath() {
    return this.options.assetsDir + "/js/app";
  }

  apply(compiler) {
    const pluginName = "SelfHtmlWebpackPlugin";

    if (compiler.hooks) {
      // webpack 4 support
      compiler.hooks.compilation.tap(pluginName, (compilation) => {
        // 开始生成html之前勾子
        // compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tapAsync(
        //   pluginName,
        //   (htmlPluginData, callback) => {
        //     // htmlWebpackPluginBeforeHtmlGeneration 返回 HtmlWebpackPlugin对象
        //     // {
        //     // 	assets
        //     // 	outputName
        //     // 	plugin
        //     // }
        //     // console.log(htmlPluginData);
        //     callback(null, htmlPluginData);
        //   }
        // );

        // 在html开始处理之前勾子
        // compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync(
        //   pluginName,
        //   (htmlPluginData, callback) => {
        //     // htmlWebpackPluginBeforeHtmlProcessing 返回 HtmlWebpackPlugin对象
        //     // {
        //     // 	html
        //     // 	assets
        //     // 	outputName
        //     // 	plugin
        //     // }
        //     // console.log(htmlPluginData);
        //     callback(null, htmlPluginData);
        //   }
        // );

        // 添加资源处理HTML勾子
        // compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(
        //   pluginName,
        //   (htmlPluginData, callback) => {
        //     // htmlWebpackPluginAlterAssetTags 返回 HtmlWebpackPlugin对象
        //     // {
        //     // 	head
        //     //  body
        //     //  chunks
        //     // 	outputName
        //     // 	plugin
        //     // }
        //     // console.log(htmlPluginData);
        //     callback(null, htmlPluginData);
        //   }
        // );

        // HTML处理完毕勾子
        compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync(
          pluginName,
          (htmlPluginData, callback) => {
            // 生成格式化后时间截
            const injectStr = this.getInjectContent();
            htmlPluginData.html = htmlPluginData.html.replace(
              "</html>",
              injectStr
            );

            const { assets } = htmlPluginData;
            const { js = [] } = assets;
            const pathPrefix = this.getJsFilePath();
            const realPath =
              js.filter((path) => path.includes(pathPrefix))[0] || "";

            htmlPluginData.html = htmlPluginData.html.replace(
              needToRelacePath,
              realPath
            );

            // htmlWebpackPluginAfterHtmlProcessing 返回 HtmlWebpackPlugin对象
            // {
            // 	html 字符串
            // 	assets
            // 	plugin
            // 	childCompilerHash
            // 	childCompilationOutputName
            // 	assetJson
            //  outputName
            // }
            console.log("htmlPluginData", htmlPluginData);
            callback(null, htmlPluginData);
          }
        );

        // 勾子任务处理完毕发送事件时
        compilation.hooks.htmlWebpackPluginAfterEmit.tapAsync(
          pluginName,
          (htmlPluginData, callback) => {
            // htmlWebpackPluginAfterEmit 返回 HtmlWebpackPlugin对象
            // {
            // 	html 简化对象 { source, size }
            // 	outputName
            // 	plugin
            // 	childCompilerHash
            // 	childCompilationOutputName
            // 	assetJson
            // }
            // console.log(htmlPluginData);
            callback(null, htmlPluginData);
          }
        );
      });
    }
  }

  /** 格式化小于10数字 */
  getAbsValue(value) {
    if (value < 10) {
      return `0${value.toString()}`;
    } else {
      return value.toString();
    }
  }

  /** 生成格式化后时间截 */
  getInjectContent() {
    const dateVal = new Date();
    const versionNum =
      dateVal.getFullYear() +
      "/" +
      this.getAbsValue(dateVal.getMonth() + 1) +
      "/" +
      this.getAbsValue(dateVal.getDate()) +
      " " +
      this.getAbsValue(dateVal.getHours()) +
      ":" +
      this.getAbsValue(dateVal.getMinutes());
    const injectStr = `
			<script type="text/javascript">console.log("当前版本: ${versionNum}");</script></html>
			`;

    return injectStr;
  }
}

module.exports = SelfHtmlWebpackPlugin;

// htmlWebpackPlugin写变量
// <% var pathPreix=process.env.NODE_ENV==='development' ? '' : '/web-eoms' ; %>
//         <script src="<%= pathPreix %>/static/runtime.js"></script>
