var gulp = require("gulp");
var rename = require("gulp-rename");
var sketch = require("gulp-sketch");
var iconfont = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');

var fontName = 'icons'; // set name of your symbol font
var template = 'brighttag-style'; // you can also choose 'foundation-style'

gulp.task('symbols', function(){
  gulp.src('../icons.sketch')
    .pipe(sketch({
      export: 'artboards',
      formats: 'svg'
    }))
    .pipe(iconfont({ fontName: fontName }))
    .on('glyphs', function(glyphs) {
      var options = {
        glyphs: glyphs.map(function(glyph) {
          // this line is needed because gulp-iconfont has changed the api from 2.0
          return { name: glyph.name, codepoint: glyph.unicode[0].charCodeAt(0) }
        }),
        fontName: fontName,
        fontPath: '/fonts/', // set path to font (from your CSS file if relative)
        className: 'icon' // set class name in your CSS
      };
      gulp.src('templates/' + template + '.css')
        .pipe(consolidate('lodash', options))
        .pipe(rename({ basename:fontName, extname:'_embed.scss' }))
        .pipe(gulp.dest('../../ui/public/scss/')); // set path to export your CSS
    })
    .pipe(gulp.dest('../../ui/public/fonts/')); // set path to export your fonts
});
