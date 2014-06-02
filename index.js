'use strict';

// __Dependencies__
var deco = require('deco');
var sanitize = require('sanitize-html');

var plugin = module.exports = function (env, callback) {
  function findVariantPages (contents) {
    // TODO look through all files
    var pages = contents._.pages;
    return pages.filter(function (item) {
      return item.metadata && item.metadata.variants !== undefined;
    });
  };

  /* A page has a number and a list of articles */
  var VariantPage = deco(function (options) {
    this.canoniacal = options.canoniacal;
    this.code = options.code;
    this.metadata = options.merged || {};
    this.metadata.canoniacal = this.canoniacal.filename;
  });

  VariantPage.sanitize(function (canoniacal, merged, code) {
    return { canoniacal: canoniacal, merged: merged, code: code };
  });

  VariantPage.inherit(env.plugins.Page);

  VariantPage.prototype.getFilename = function() {
    var filename = this.canoniacal.filename;
    var parts = filename.split('.');
    parts.splice(-1, 0, this.code);
    return parts.join('.');
  };

  VariantPage.prototype.getView = function() {
    return function (env, locals, contents, templates, callback) {
      var templateName = this.canoniacal.template;
      var template = templates[templateName];

      if (!template) {
        callback(new Error('unknown variant template "' + templateName + '"'));
        return;
      }

      var context = deco.merge(locals, { page: this.metadata });
      console.log(context)

      return template.render(context, callback);
    };
  };

  env.registerGenerator('variants', function (contents, callback) {
    var pages = findVariantPages(contents);
    var files = { };

    pages.forEach(function (page, index) {
      Object.keys(page.metadata.variants).forEach(function (key) {
        var v = page.metadata.variants[key];
        var merged = deco.merge(page.metadata, v);
        delete merged.code;
        delete merged.variants;
        var variant = new VariantPage(page, merged, key);
        files[variant.getFilename() + '.page'] = variant;
      });
    });

    return callback(null, files);
  });

  return callback();
};
