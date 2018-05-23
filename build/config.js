const typescript = require('rollup-typescript');
const babel = require('rollup-plugin-babel');

module.exports = exports = [
    {
        input: './src/index.ts',
        output: {
            file: './dist/models.esm.js',
            format: 'es',
        },
        plugins: [
            typescript(),
            // babel({
            //     exclude: 'node_modules/**',
            // }),
        ],
    },
    {
        input: './src/index.ts',
        output: {
            file: './dist/models.cjs.js',
            format: 'cjs',
        },
        plugins: [
            typescript(),
            // babel({
            //     exclude: 'node_modules/**',
            // }),
        ],
    },
    {
        input: './src/index.ts',
        output: {
            file: './dist/models.js',
            name: 'Schema',
            format: 'umd',
        },
        plugins: [
            typescript(),
            // babel({
            //     exclude: 'node_modules/**',
            // }),
        ],
    },
];