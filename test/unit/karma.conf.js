module.exports = function(config) {
    config.set({
        browsers: [
            'PhantomJS',
            'Chrome',
        ],
        frameworks: [
            'jasmine',
            'sinon-chai',
            'phantomjs-shim',
        ],
        reporters: [
            'spec',
        ],
        files: [
            '../../node_modules/vue/dist/vue.js',
            '../../dist/models.js',
            './specs/**/*.spec.js',
        ],
        plugins: [
            'karma-jasmine',
            'karma-sinon-chai',
            'karma-phantomjs-shim',
            'karma-spec-reporter',
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
        ],
    });
}