const gulp = require('gulp')
const browserSync = require('browser-sync').create()//实时更新

//browserSync 启动一个静态服务器
gulp.task('server', function(){
	browserSync.init({
		files:'**',
		server:{
			baseDir:'.'
		}
	})
})
//default 默认的任务
gulp.task('dev', gulp.series("server" , function(){
	console.log('go start');
}))
