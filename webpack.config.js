/*
* @Author: kai
* @Date:   2017-08-09 15:43:54
* @Last Modified by:   kai
* @Last Modified time: 2017-11-16 20:14:38
*/
// var path                = require('path')
var webpack             = require('webpack');
var ExtractTextPlugin   = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin   = require('html-webpack-plugin');
var OptimizeCSSPlugin   = require('optimize-css-assets-webpack-plugin');

// 环境变量配置，dev / online
var WEBPACK_ENV         = process.env.WEBPACK_ENV || 'dev';

// 获取html-webpack-plugin参数的方法 
var getHtmlConfig = function(name, title){
    return {
        template    : './src/view/' + name + '.html',
        filename    : 'view/' + name + '.html',
        title       : title,
        inject      : true,
        //hash        : true,
        chunks      : ['common', name]
        /*minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
        },*/
    };
};

/*function resolve (dir) {
  return path.join(__dirname, '..', dir)
}*/

// webpack config
var config = {
    entry: {
        'common'            : ['./src/page/common/index.js']
    },
    output: {
        path: './dist',
        publicPath : '/dist',
        filename: 'js/[name].js'
    },
    externals : {
        'jquery' : 'window.jQuery'
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader","css-loader") },
            {test: /\.scss$/,loader: ExtractTextPlugin.extract("style", 'css!sass')},
            {test: /\.(gif|png|jpg|woff|svg|eot|ttf)\??.*$/, loader: 'url-loader?limit=20480&name=images/[name].[ext]' },
            {test: /\.string$/, loader: 'html-loader'}
        ]
        /*rules: [
          {
            test: /\.(js|html)$/,
            loader: 'eslint-loader',
            enforce: 'pre',
            include: [resolve('src'), resolve('test')],
            options: {
              formatter: require('eslint-friendly-formatter')
            }
          }
        ]*/
    },
    resolve : {
        alias : {
            node_modules    : __dirname + '/node_modules',
            image           : __dirname + '/src/image',
            js              : __dirname + '/src/js',
            scss            : __dirname + '/src/scss',
            page            : __dirname + '/src/page'
        }
    },
    postcss: [
      require('autoprefixer') //调用autoprefixer插件,加入各个浏览器的前缀
    ],
    plugins: [
        // 独立通用模块到js/base.js
        new webpack.optimize.CommonsChunkPlugin({
            name : 'common',
            filename : 'js/base.js'
        }),

        // 把css单独打包到文件里
        new ExtractTextPlugin("css/[name].css"),

        // css压缩
       /* new OptimizeCSSPlugin({
          cssProcessorOptions: {
            safe: true
          }
        }),*/

        // js压缩
        /*new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          }
        }),*/

        // 热加载
        new webpack.HotModuleReplacementPlugin(),

        // html模板的处理
        new HtmlWebpackPlugin(getHtmlConfig('index', '首页')),
        new HtmlWebpackPlugin(getHtmlConfig('login', '登录')),
        new HtmlWebpackPlugin(getHtmlConfig('register', '注册')),
        new HtmlWebpackPlugin(getHtmlConfig('forgetPassword', '找回密码')),
        // new HtmlWebpackPlugin(getHtmlConfig('user-login', '用户登录')),
        // new HtmlWebpackPlugin(getHtmlConfig('user-register', '用户注册')),
        // new HtmlWebpackPlugin(getHtmlConfig('user-pass-reset', '找回密码')),
        // new HtmlWebpackPlugin(getHtmlConfig('user-center', '个人中心')),
        // new HtmlWebpackPlugin(getHtmlConfig('user-center-update', '修改个人信息')),
        // new HtmlWebpackPlugin(getHtmlConfig('user-pass-update', '修改密码')),
        // new HtmlWebpackPlugin(getHtmlConfig('result', '操作结果')),
        
        new webpack.NoErrorsPlugin()
    ]
};

if('dev' === WEBPACK_ENV){
    config.entry.common.push('webpack-dev-server/client?http://localhost:8088/');
}

module.exports = config;