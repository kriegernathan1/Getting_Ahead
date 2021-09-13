// const { Module } = require("webpack");

module.exports = {

    // watch: true,

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 
                {
                    loader: 'babel-loader',
                    options: 
                    {
                        presets: ['@babel/preset-env', "@babel/preset-react"]
                    }
                },
            },
            {
                test: /\.(png|jp(e*)g|svg|gif)$/,

                loader: 'file-loader',
                options: {
                    name: 'images/[hash]-[name].[ext]',
                },
            }
        ]
    }

}