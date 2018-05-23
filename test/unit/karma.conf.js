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