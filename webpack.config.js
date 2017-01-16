module.exports = {
    entry: "./app.js",
    devtool: 'source-map',
    output: {
        path: __dirname+'/bin',
        filename: "bundle.js"
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
    },
    module: {
        loaders: [
            { 
                test: /\.css$/, 
                loader: "style!css" ,
                exclude: /node_modules/
            },
//            {
//                test: /\.ts$/,
//                loader: 'ts-loader'
//            },
            { 
                test: /\.js$/, 
                exclude: /node_modules/, 
                loader: "babel-loader" 
            }
        ]
    }
}