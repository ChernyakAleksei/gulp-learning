#Сборка javascript, `gulp.watch()`, работа с изображениями, `browser-sync`

###Сборка javascript
Перейдем к javascript и напишем простую задачу для сборки javascript файлов. В папке `src/js/lib` находится библиотека `jquery`, а в папке `src/js` файлик с нашим javascript. Создадим задачу `js`:
```js
...
// 'js' task будет собирать javascript из папки 'src'
// сперва обрабатывая папку 'lib', затем наши js файлы
// нашего проекта
gulp.task('js', () => {
  gulp.src(['src/js/lib/*.js', 'src/js/*.js'])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('public/js'))
});
```
Подключим `main.js` в самый конец `index.html`:
```html
...
  <script src="js/main.js" type="text/javascript"></script>
...
```
И запустим задачу. На выходе получим в папке `public/js` готовый javascript файл.

###Минификация javascript
За минификацию javascript отвечает плагин [gulp-uglify](https://www.npmjs.com/package/gulp-uglify).
Установим его, подключим и добавим в задачу:
```sh
$ npm i -D gulp-uglify
```

```js
...
// подключаем минификатор для javascript
const uglify = require('gulp-uglify');

...

gulp.task('js', () => {
  gulp.src(['src/js/lib/*.js', 'src/js/*.js'])
    .pipe(concat('main.js'))
    // сжимаем javascript
    .pipe(uglify())
    .pipe(gulp.dest('public/js'))
});
```
Абсолютно также, как и для сборки стилей, мы можем воспользоваться генератором **sourcemaps** и задействовать `gulp-if` для сборки javascript - отдельно для 'девелопмента' и 'продакшна'.

###`gulp.watch()`
Для еще большей автоматизации и облегчения разработки, добавим вотчер за нашими less и js файлами. Создадим новую задачу:
```js
...
// будет наблюдать за файлами стилей и javascript
gulp.task('watch', () => {
  gulp.watch('src/less/*.less', ['style']);
  gulp.watch('src/js/*.js', ['js']);
});
```
И запустим ее:
```sh
$ gulp build watch
[00:28:38] Using gulpfile ~/projects/gulp-learning/04-watch-incremental-build/gulpfile.js
[00:28:38] Starting 'build'...
[00:28:38] Starting 'clean'...
[00:28:38] Starting 'watch'...
[00:28:38] Finished 'watch' after 13 ms
[00:28:38] Finished 'clean' after 26 ms
[00:28:38] Starting 'style'...
[00:28:38] Finished 'style' after 16 ms
[00:28:38] Starting 'images'...
[00:28:38] Finished 'images' after 1.64 ms
[00:28:38] Finished 'build' after 46 ms
```
Как видно сборка собралась, но выполнение `gulp` не завершилось - `gulp.watch()` начал наблюдать за файлами стилей. И при изменении любого из файлов, он перезапустит задачу `style`.

###`ESLint` - проверка качества кода
[`ESlint`](http://eslint.org/) - один из самых популярных инструментов, который служит для проверки качества кода javascript (походжие имеются и для файлов стилей и для html). Давайте посмотрим, как он работает. Установим плагин [`gulp-eslint`](https://www.npmjs.com/package/gulp-eslint):
```sh
$ npm i -D gulp-eslint
```
Подключим и напишем задачу:
```js
...
// подключаем линтер для javascript
const eslint = require('gulp-eslint');

...

// задача для проверки качества кода
gulp.task('lint', () => {
  gulp.src('src/js/l*.js')
    // проверяем javascript
    .pipe(eslint())
    // выводим ошибки, если есть
    .pipe(eslint.format())
});
```
Добавим ее сразу в таск `build` и `watch`:
```js
gulp.task('build', sequence('clean', ['style', 'images', 'js'], 'lint', 'watch'));

gulp.task('watch', () => {
     gulp.watch('src/less/*.less', ['style']);
     gulp.watch('src/js/*.js', ['js', 'lint']); // линтинг после сборки js
   });
```
Несколько оговорок, для корректной работы `eslint` необходим файл конфигурации - [`.eslintrc`](http://eslint.org/docs/user-guide/configuring), который можно гибко настроить по себя и стиль написания кода команды. Также существую уже готовые стайлгайды, например [Airbnb](https://github.com/airbnb/javascript).

###Современный стандарт ES-2015 и Babel
 Как и со стилями с javascript такая же история. Стандарт очень быстро развивается и разработчики браузеров не успевают внедрять новые возможности. И тут нам на помощь приходит [Babel](https://babeljs.io/) - это транспиллер javascript кода из современного (или очень современного) стандарта в код понятный браузерам. Давайте посмотрим как это работает.
 Установим `babel` и плагин `gulp-babel`:
```sh
$ npm i -D gulp-babel babel-preset-es2015
```
Подключим и опишем задачу:
```js
...
const babel = require('gulp-babel');
...

// опишем задачу для babel
gulp.task('js', () => {
  gulp.src(['src/js/lib/*.js', 'src/js/*.js'])
    // подключим babel
    .pipe(babel({
      compact: false,
      ignore: 'src/js/lib/*.js',
      presets: ['es2015']
    }))
    .pipe(concat('main.js'))
    // .pipe(uglify()) // отключим для большей ясности минификацию
    .pipe(gulp.dest('public/js'))
});
```

###Работа с изображениями
Для работы с изображениями будем использовать плагин [`gulp-imagemin`](https://www.npmjs.com/package/gulp-imagemin). Давайте установим его и создадим задачу:
```sh
$ npm i -D gulp-imagemin
```

```js
...
const imagemin = require('gulp-imagemin');
...

// опишем задачу для обработки изображений
gulp.task('images', () => {
  gulp.src('src/images/*.*')
    .pipe(imagemin())
    .pipe(gulp.dest('public/images'))
});
```

###Вишенка на торте - `browser-sync`
[`Browsersync`](https://www.browsersync.io/docs/gulp) - это очень мощный инструмент, для работы с браузером, синхронизации данных и автоматической перезагрузки страницы. Давайте посмотрим, как это работает.
Установим плагин:
```sh
$ npm i -D browser-sync
```
Подключим и настроим:
```js
...
const browserSync = require('browser-sync').create();
...

// опишем задачу для browserSync
gulp.task('serve', () => {
  browserSync.init({
    server: 'public'
  });

  browserSync.watch('public/**/*.*').on('change', browserSync.reload);
});

// добавим ее в таск build
gulp.task('build', sequence('clean', ['style', 'images', 'serve']));
```
Запустим.
