module.exports = {
    entry: "./app.ts",
    output: {
        path: __dirname,
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
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            }
        ]
    }
}