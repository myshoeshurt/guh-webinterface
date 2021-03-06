/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                                     *
 * Copyright (C) 2015 Lukas Mayerhofer <lukas.mayerhofer@guh.guru>                     *
 *                                                                                     *
 * Permission is hereby granted, free of charge, to any person obtaining a copy        *
 * of this software and associated documentation files (the "Software"), to deal       *
 * in the Software without restriction, including without limitation the rights        *
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell           *
 * copies of the Software, and to permit persons to whom the Software is               *
 * furnished to do so, subject to the following conditions:                            *
 *                                                                                     *
 * The above copyright notice and this permission notice shall be included in all      *
 * copies or substantial portions of the Software.                                     *
 *                                                                                     *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR          *
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,            *
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE         *
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER              *
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,       *
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE       *
 * SOFTWARE.                                                                           *
 *                                                                                     *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


/*
 * Plugins
 */

var gulp = require('gulp');
var runSequence = require('run-sequence');
var browserSyncApp = require('browser-sync').create('app-server');
var argsParser = require('../utils/args-parser');


/*
 * Configuration
 */

var pathConfig = require('../config/gulp').paths;
var browserSyncConfig = require('../config/gulp').browserSync.app;


/*
 * Methods
 */

// Get pretty print version from array
var getPrettyFromArray = function(array) {
  return array.join('\n');
};

// Get pretty print version from object
var getPrettyFromObject = function(object) {
  var array = Object.keys(object).map(function(key) {
    return object[key];
  });

  return getPrettyFromArray(array);
};


/*
 * Task
 * 
 */

gulp.task('app-server', function(done) {
  var proxyServer = argsParser.getProxyServer();

  // Set proxy server (Default set inside config/gulp.js)
  browserSyncConfig.proxy = proxyServer;

  browserSyncApp.init(null, browserSyncConfig);

  done();
});
