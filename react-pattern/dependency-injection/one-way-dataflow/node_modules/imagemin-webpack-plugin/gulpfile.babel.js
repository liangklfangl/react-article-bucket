import gulp from 'gulp'
import { resolve } from 'path'
import run from 'gulp-run-command'
import sync from 'gulp-npm-script-sync'

const SOURCEFILE = resolve('.', 'index.js')
const OUTFILE = resolve('.', 'index.es5.js')

gulp.task('clean', run(`rimraf ${OUTFILE}`))
gulp.task('test', run('standard ./index.js'))
gulp.task('build', ['clean'], run(`babel ${SOURCEFILE} --out-file ${OUTFILE}`))

sync(gulp)
