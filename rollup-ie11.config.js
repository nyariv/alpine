import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';
import { terser } from "rollup-plugin-terser";
import resolve from "rollup-plugin-node-resolve"
import commonjs from '@rollup/plugin-commonjs'

export default {
    input: ['src/index.js'],
    output: {
        name: 'Alpine',
        file: 'dist/alpine-ie11.js',
        format: 'umd',
        sourcemap: true,
    },
    plugins: [
        resolve(),
        commonjs(),
        filesize(),
        terser({
            mangle: false,
            compress: {
                drop_debugger: false,
            }
        }),
        babel({
            babelrc: false,
            exclude: 'node_modules/**',
            runtimeHelpers: true,
            presets: [
                [
                    "@babel/preset-env",
                    {
                        targets: {
                            browsers: "> 0.5%, ie >= 11"
                        },
                        modules: false,
                        spec: true,
                        forceAllTransforms: true,
                    }
                ]
            ],
            plugins: [
                "@babel/plugin-transform-runtime"
            ]
        })
    ]
}
