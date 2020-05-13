const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const helpers = require('./helpers');
const path = require('path');

module.exports = {
    entry: {
        'polyfills': './app/polyfills.ts',
        'vendor': './app/vendor.ts',
        'app': './app/main.ts'
    },

    resolveLoader: {
        alias: {
            "license-check": path.resolve(__dirname, "./loaders/license-check")
        }
    },

    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                include: [helpers.root('app'), helpers.root('../alfresco-ng2-components/ng2-components')],
                loader: 'source-map-loader',
                exclude: [/node_modules/, /public/, /resources/, /dist/]
            },
            {
                enforce: 'pre',
                test: /\.ts$/,
                loader: 'tslint-loader',
                include: [helpers.root('app')],
                options: {
                    emitErrors: true
                },
                exclude: [/node_modules/, /public/, /resources/, /dist/]
            },
            {
                enforce: 'pre',
                test: /\.ts$/,
                include: [helpers.root('app'), helpers.root('../alfresco-ng2-components/ng2-components')],
                use: 'source-map-loader',
                exclude: [/public/, /resources/, /dist/]
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                exclude: [/node_modules/, /public/, /resources/, /dist/]
            },
            {
                test: /\.css$/,
                exclude: [helpers.root('app'), helpers.root('../alfresco-ng2-components/ng2-components')],
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader?sourceMap'
                })
            },
            {
                test: /\.css$/,
                include: [helpers.root('app'), helpers.root('../alfresco-ng2-components/ng2-components')],
                loader: 'raw-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file-loader?name=assets/[name].[hash].[ext]'
            },
            {
                enforce: 'pre',
                test: /\.ts$/,
                loader: 'license-check',
                include: helpers.root('app'),
                options: {
                    emitErrors: true,
                    licenseFile: path.resolve(__dirname, '../assets/license_header.txt')
                },
                exclude: [/node_modules/, /bundles/, /dist/, /demo/],
            }
        ]
    },

    plugins: [
         new webpack.ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)@angular/,
            helpers.root('./app'), // location of your src
            {} // a map of your routes
        ),
        new HtmlWebpackPlugin({
            template: './index.html'
        }),

        new CopyWebpackPlugin([
            {
                from: './custom-translation/**/*.json',
            },
            {
                from: 'node_modules/ng2-alfresco-upload/bundles/assets/ng2-alfresco-upload/**/*.json',              
            },
            {
                from: 'node_modules/ng2-alfresco-login/bundles/assets/ng2-alfresco-login/**/*.json',
            },
            {
                from: 'node_modules/ng2-activiti-processlist/bundles/assets/ng2-activiti-processlist/**/*.json',              
            },
            {
                from: 'node_modules/ng2-activiti-tasklist/bundles/assets/ng2-activiti-tasklist/**/*.json',              
            },
           
           
           {
                context: 'node_modules',
                from: 'intl/dist/Intl.min.js',
                to: 'js/Intl.min.js',
                flatten: true
            },
             {
                context: 'node_modules',
                from: 'pdfmake/build/pdfmake.min.js',
                to: 'js/pdfmake.min.js',
                flatten: true
            },
             {
                context: 'node_modules',
                from: 'pdfmake/build/vfs_fonts.js',
                to: 'js/vfs_fonts.js',
                flatten: true
            },
            // ,{
            //     context: 'node_modules',
            //     from:  'systemjs/dist/system-polyfills.js',
            //     to: 'js/system-polyfills.js',
            //     flatten: true
            // }, 
            {
                context: 'node_modules',
                from:  'material-design-lite/material.min.js',
                to: 'js/material.min.js',
                flatten: true
            },
            {
                context: 'public',
                from: 'css/material.orange-blue.min.css',
                to: 'css/material.orange-blue.min.css',
                flatten: true
            },  {
                context: 'node_modules',
                from: 'material-design-icons/iconfont/',
                to: 'css/iconfont/',
                flatten: true
            },
             {
                context: 'public',
                from: 'css/muli-font.css',
                to: 'css/muli-font.css',
                flatten: true
            },
            {
                from: 'app.config-dev.json'
            },
            {
                from: 'app.config-prod.json'
            },
            {
                from: 'favicon-96x96.png'
            },
            {
                from: 'assets/accounting-background.jpg'
            },
            {
                from: 'node_modules/pdfjs-dist/build/pdf.worker.js',
                to: 'pdf.worker.js'
            }
            
        ]),

        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor', 'polyfills']
        })
    ],

    devServer: {
        contentBase: helpers.root('dist'),
        compress: true,
        port: 3000,
        historyApiFallback: true,
        host: '0.0.0.0',
        inline: true,
        proxy: {
            '/ecm': {
                target: {
                    host: "0.0.0.0",
                    protocol: 'http:',
                    port: 8080
                },
                pathRewrite: {
                    '^/ecm': ''
                }
            },
            '/bpm': {
                target: {
                    host: "0.0.0.0",
                    protocol: 'http:',
                    port: 9999
                },
                pathRewrite: {
                    '^/bpm': ''
                }
            }
        }
    },

    node: {
        fs: 'empty'
    }
};
