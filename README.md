wainwright-ab
=============

A collaboration between EngineApp &amp; Kun.io App Studio

If a wainwright page includes the `variants`
field in its metadata, the variant will be merged over
the page's metadata.  The variant's `code` field will
be used to create a new output file name.  If that field
is not present, the variant count will be used.  The new
file's `canoniacal` metadata field will be set to the
original file name.  Finally, wainwright templates are
applied.

Gulp task:

```javascript
var ab = require('wainwright-ab');

gulp.task('build-html', function () {
  // Process files with wainwright as usual.
  var wagon = wainwright();
  var templated = gulp.src('./content/**/*').pipe(wagon);
  templated.pipe(gulp.dest('./build'));
  // Generate the variant pages.  The `metadata` method returns a stream of
  // internal wainwright contexts.  Only pages with `variant` metadata
  // set are processed.
  wagon.metadata()
    .pipe(ab())
    .pipe(gulp.dest('./build'));
});
```

Content file `landing.json`:

```json
{
  "header": "original",
  "description": "greetings",
  "template": "landing.hogan",
  "variants": [
    { "code": "coupon", "header": "different" },
    { "code": "coupon2", "description": "yo" }
  ]
}
```

Template `landing.hogan`:

```html
<html>
  <head>
    {{#canonical}}
      <link rel="canoniacal" href="{{canoniacal}}">
    {{/canoniacal}}
  </head>
  <body>
    <h1>{{header}}</h1>
    <p>{{description}}</p>
  </body>
</html>
```

This would generate two additional files, besides the normal `landing.html`.

Output file `landing.html`:

```html
<html>
  <head>
  </head>
  <body>
    <h1>original</h1>
    <p>greetings</p>
  </body>
</html>
```

Output file `landing.coupon.html`:

```html
<html>
  <head>
    <link rel="canoniacal" href="/landing.html">
  </head>
  <body>
    <h1>different</h1>
    <p>greetings</p>
  </body>
</html>
```

Output file `landing.coupon2.html`:


```html
<html>
  <head>
    <link rel="canoniacal" href="/landing.html">
  </head>
  <body>
    <h1>original</h1>
    <p>yo</p>
  </body>
</html>
```


*Copyrights belong to their respective owners ©2014*
