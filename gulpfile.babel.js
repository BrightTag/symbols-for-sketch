const
  gulp = require('gulp'),
  rename = require('gulp-rename'),
  sketch = require('gulp-sketch'),
  iconfont = require('gulp-iconfont'),
  consolidate = require('gulp-consolidate'),
  gutil = require('gulp-util')

/**
 * Font settings
 */
const
  // set name of your symbol font
  fontName = 'icons',
  // set class name in your CSS
  className = 's',
  // you can also choose 'foundation-style'
  template = 'brighttag-style',
  // you can also choose 'symbol-font-16px.sketch'
  skethcFileName = '../icons.sketch'

/**
 * Recommended to get consistent builds when watching files
 * See https://github.com/nfroidure/gulp-iconfont
 */
const timestamp = Math.round(Date.now() / 1000)
gulp.task('symbols', () =>
  gulp.src(skethcFileName)
    .pipe(sketch({
      export: 'artboards',
      formats: 'svg'
    }))
    .pipe(iconfont({
      fontName,
      formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'],
      timestamp,
      log: () => {} // suppress unnecessary logging
    }))
    .on('glyphs', (glyphs) => {
       const options = {
         className: 'icon',
         fontName,
         fontPath: '/fonts/', // set path to font (from your CSS file if relative)
         glyphs: glyphs.map(mapGlyphs)
       }
       gulp.src(`templates/${ template }.css`)
         .pipe(consolidate('lodash', options))
         .pipe(rename({ basename: fontName, extname:'_embed.scss' }))
         .pipe(gulp.dest('../../ui/public/scss/')) // set path to export your CSS
         .on('end', function(){ gutil.log('Done exporting css!'); })
     })
    .pipe(gulp.dest('../../ui/public/fonts/')) // set path to export your fonts
    .on('end', function(){ gutil.log('Done exporting fonts!'); })
)

gulp.task('watch', () => gulp.watch('*.sketch', ['symbols']))

/**
 * This is needed for mapping glyphs and codepoints.
 */
function mapGlyphs(glyph) {
  return { name: glyph.name, codepoint: glyph.unicode[0].charCodeAt(0) }
}
