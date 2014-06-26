'use strict';

// ## Dependencies
var es = require('event-stream');
var deco = require('deco');
var wainwright = require('wainwright');
// ## Plugin Definition
var plugin = module.exports = function (options) {
  // A stream that creates new output files from wainwright
  // contexts.  If a wainwright page includes the `variants`
  // field in its metadata, the variant will be merged over
  // the page's metadata.  The variant's `code` field will
  // be used to create a new output file name.  If that field
  // is not present, the variant count will be used.  The new
  // file's `canoniacal` metadata field will be set to the
  // original file name.  Finally, wainwright templates are
  // applied.
  var stream = es.pipeline(
    es.through(
      function (page) {
        if (!page.variants) return;
        var that = this;
        var n = 0;
        var variants = [].concat(page.variants);
        variants.forEach(function (variant) {
          var parts = page.path.split('.');
          n += 1;
          parts.splice(-1, 0, variant.code || n);
          variant.path = parts.join('.');
          variant.canoniacal = page.path;
          that.emit('data', deco.merge(page, variant));
        });
      }
    ),
    wainwright.template(),
    wainwright.file()
  );
  return stream;
};
