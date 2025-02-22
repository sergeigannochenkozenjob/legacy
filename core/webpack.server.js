const path = require('path');
const nodeExternals = require('webpack-node-externals');
const PeerDepsExternalsPlugin = require('peer-deps-externals-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {
    env = env || {};
    const development =
        argv.mode === 'development' || env.NODE_ENV === 'development';

    return {
        entry: path.join(__dirname, 'src/server.js'),
        target: 'node',
        node: {
            __filename: true,
            __dirname: true,
        },
        externals: [nodeExternals()],
        mode: development ? 'development' : 'production',
        output: {
            filename: 'server.js',
            path: path.join(__dirname, 'build'),
            libraryTarget: 'commonjs',
        },
        resolve: {
            extensions: ['.ts', '.js'],
            symlinks: false,
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    [
                                        '@babel/env',
                                        {
                                            targets: { node: '8.10' },
                                        },
                                    ],
                                ],
                                plugins: [
                                    '@babel/plugin-proposal-object-rest-spread',
                                    '@babel/plugin-proposal-class-properties',
                                ],
                            },
                        },
                    ],
                },
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
        },
        plugins: [
            new webpack.ProvidePlugin({
                // varname: path.join(__dirname, `src/lib/module.js`),
            }),
            new PeerDepsExternalsPlugin(),
            new webpack.DefinePlugin({
                __DEV__: development,
                __TEST__: false,
            }),
        ],
    };
};
