#Работа с файлами стилей

###Плагин `gulp-less`
В папке `src/less` находятся стили для нашего проекта, написанные на препроцессоре `less`, также можно использовать `sass`, `stylus` и собственно любой другой по Вашему выбору. Результат работы less плагина, а именно готовый `css`, будет находится в папке `public/css`. Давайте найдем плагин для работы с [`less`](https://www.npmjs.com/package/gulp-less/), сделать это можно на страничке [плагинов](http://gulpjs.com/plugins/) для `gulp`, набрав в поле поиска 'less'.
Установка:
```sh
$ npm i -D gulp-less
```
Теперь подключим его и напишем таск для обработки стилей:
```js
// Подключаем gulp
const gulp = require('gulp');
// Подключаем gulp-less
const less = require('gulp-less');

// Задача для обработки стилей
gulp.task('style', () => {
 // путь к папке с less файлами1
 gulp.src('src/less/**/*.less')
   // передаем на обработку less
   .pipe(less())
   // пишем в конечную директорию
   .pipe(gulp.dest('public/css'))
});
```
Запустим задачу:
```sh
$ gulp style
[19:23:44] Using gulpfile ~/projects/gulp-learning/03-styles/gulpfile.js
[19:23:44] Starting 'style'...
[19:23:44] Finished 'style' after 12 ms
```
Если сейчас заглянуть в папочку `public/css`, то мы увидим 3 обычных `css` файла.

### Плагин `gulp-concat`
Если все оставить как есть, нам придется подключить 3 css файла в `index.html`, но думаю Вы догадываетесь, что подобное нас мало устроит. Пришло время задейсвовать еще один плагин - [`gulp-concat`](https://www.npmjs.com/package/gulp-concat/). Давайте его установим, подключим и добавим в задачу:
```sh
$ npm i -D gulp-concat
```

```js
...
// Подключаем gulp-concat
const concat = require('gulp-concat');

// Задача для обработки стилей
gulp.task('style', () => {
 // путь к папке с less файлами1
 gulp.src('src/less/**/*.less')
   // передаем на обработку less
   .pipe(less())
   // обьединяем в один файл стилей
   .pipe(concat('style.css'))
   // пишем в конечную директорию
   .pipe(gulp.dest('public/css'))
});
```
Запустим задачу:
```sh
$ gulp style
[19:37:14] Using gulpfile ~/projects/gulp-learning/03-styles/gulpfile.js
[19:37:14] Starting 'style'...
[19:37:14] Finished 'style' after 14 ms
```
И вуаля, в папке `public/css` один сконкатенированый файл `style.css`, со всеми стилями нашего проекта. Важно заметить, что `concat` не будет сразу отдавать данные дальше по цепочке методу `dest()`, он будет ждать события, которое просигнализирует об окончания чтения всех файлов, затем только обединит полученные данные в один результирующий файл и только после этого передаст их дальше на обработку методу `dest()`.
Если внимательно посмотреть на результирующий файл `style.css`, то можно заметить, что стили там не совсем в том порядке, в котором, может быть нам хотелось бы. Сначала идет описание стилей для контента страницы0 потом для хедера и в самом конце для главного контейнера. Давайте исправим это. Во-первых, созданим еще один файл `index.less` в папке `src/less`, с импортами всех файлов стилей в нужном нам порядке, вот его содержание:
```less
@import "main";
@import "header";
@import "content";
```
И немного подкорректируем нашу задачу:
```js
...
 // путь к папке с less файлами1
 gulp.src('src/less/index.less')
...
```
Запустим и увидим, что теперь в `public/css/style.css` стили именно в том порядке, в котором нам необходимо.

###Плагин `gulp-sourcemaps`
Для отладки и поиска ошибок бывает полезно знать, из какого файла пришел тот или иной кусок кода, неважно это стили или javascript. В этом нам на помощь приходят **sourcemaps**. Без них, конечно, мы тоже можем увидеть ошибки и даже посмотреть результирующий файл, но когда проект большой и файлов много, куда более удобно знать, что к чему и где искать. Давайте становим плагин [`gulp-sourcemaps`](https://www.npmjs.com/package/gulp-sourcemaps/) и добавим его в наш таск.
```sh
$ npm i -D gulp-sourcemaps
```
Перед тем, как подключить `gulp-sourcemaps`, нужно отметить, что все самые нужные и часто используемые плагины для `gulp`, которые изменяют содержимое файла, знают и умеют работать с `gulp-sourcemaps`. Это обязательное требование. Список плагинов для `gulp` поддерживающих **sourcemaps** можно найти на [wiki](https://github.com/floridoo/gulp-sourcemaps/wiki/Plugins-with-gulp-sourcemaps-support). Далее, для создания 'карты стилей' окружаем весь код между `gulp.src()` и `gulp.dest()` двумя 'пайпами' - `sourcemap.init()` и `sourcemap.write()`.
```js
...
// Подключаем gulp-sourcemaps
const sourcemap = require('gulp-sourcemaps');

// Задача для обработки стилей
gulp.task('style', () => {
 // путь к папке с less файлами
 gulp.src('src/less/**/*.less')
   // инициализируем sourcemap
   // sourcemap.init() - добавляет специальное свойство 'sourseMap' (file.sourseMap)
   // в которое остальные плагины будут записывать изменения
   // происходящие с файлом
   .pipe(sourcemap.init())
   // передаем на обработку less
   .pipe(less())
   // обьединяем в один файл стилей
   .pipe(concat('style.css'))
   // пишем sourcemap в результирующий файл
   .pipe(sourcemap.write())
   // пишем в конечную директорию
   .pipe(gulp.dest('public/css'))
});
```
Запускам задачу и в самом конце результирующего файлы стилей видем строку с **sourcemaps***:
```sourceMap
/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4ubGVzcyIsImhlYWRlci5sZXNzIiwiY29udGVudC5sZXNzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsY0FBQTtFQUNBLGFBQUE7O0FDRkY7RUFDRSxlQUFBO0VBQ0EsWUFBQTs7QUFGRixZQUlFO0VBQ0UscUJBQUE7RUFDQSxTQUFBO0VBQ0EsZUFBQTtFQUNBLHlCQUFBO0VBQ0EsY0FBQTs7QUFUSixZQVlFO0VBQ0UscUJBQUE7RUFDQSxrQkFBQTtFQUNBLFVBQUE7RUFDQSxnQkFBQTs7QUFoQkosWUFZRSxXQU1FO0VBQ0UscUJBQUE7RUFDQSxhQUFBOztBQXBCTixZQVlFLFdBTUUsaUJBSUU7RUFDRSxxQkFBQTtFQUNBLGVBQUE7RUFDQSxjQUFBOztBQUVBLFlBZk4sV0FNRSxpQkFJRSxzQkFLRztFQUNDLDBCQUFBOztBQzVCVjtFQUNFLGNBQUE7O0FBREYsYUFHRTtFQUNFLFNBQUE7RUFDQSxtQkFBQSIsImZpbGUiOiJzdHlsZS5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIucGFnZS13cmFwcGVyIHtcbiAgbWFyZ2luOiAwIGF1dG87XG4gIHdpZHRoOiAxMDAwcHg7XG59XG4iLCIucGFnZS1oZWFkZXIge1xuICBwYWRkaW5nOiAyMHB4IDA7XG4gIGZvbnQtc2l6ZTogMDtcblxuICAucGFnZS1oZWFkZXJfX2hlYWQge1xuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICBtYXJnaW46IDA7XG4gICAgZm9udC1zaXplOiAxOHB4O1xuICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gICAgY29sb3I6ICM1MTQwZmY7XG4gIH1cblxuICAubWFpbi1tZW51IHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgbWFyZ2luOiAwIDAgMCA1MHB4O1xuICAgIHBhZGRpbmc6IDA7XG4gICAgbGlzdC1zdHlsZTogbm9uZTtcblxuICAgIC5tYWluLW1lbnVfX2l0ZW0ge1xuICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgcGFkZGluZzogMTBweDtcblxuICAgICAgLm1haW4tbWVudV9faXRlbS1saW5rIHtcbiAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgIGNvbG9yOiAjMDAwMDAwO1xuXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCIucGFnZS1jb250ZW50IHtcbiAgbWFyZ2luOiAwIDIwcHg7XG5cbiAgLnBhZ2UtY29udGVudF9fdGV4dCB7XG4gICAgbWFyZ2luOiAwO1xuICAgIHRleHQtYWxpZ246IGp1c3RpZnk7XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ== */
```
Можно сгенерировать **sourcemap** не в самом файле стилей, а отдельно, указав методу `sourcemap.write()` путь для сохранения.
```js
.pipe(sourcemap.write('.'))
```
Запустив задачу, найдем рядом с файлом стилей еще один файл `style.css.map` - это и есть наши 'карты', а в самом конце файла стилей теперь просто лежить путь к **sourcemaps**:
```sourceMap
/*# sourceMappingURL=style.css.map */
```

###Минификация сss и `gulp-cssnano`
В процессе разработки нам незачем минифицировать стили, а вот для продакшн - это очень очень необходимо. Воспользуемся простым плагином [`gulp-cssnano`](https://www.npmjs.com/package/gulp-cssnano). Установим его:
```sh
$ npm i -D gulp-cssnano
```
И подключим:
```js
...
// Подключаем gulp-cssnano
const minifyCss = require('gulp-cssnano');

// Задача для обработки стилей
gulp.task('style', () => {
 // путь к папке с less файлами
 gulp.src('src/less/**/*.less')
   // инициализируем sourcemap
   .pipe(sourcemap.init())
   // передаем на обработку less
   .pipe(less())
   // обьединяем в один файл стилей
   .pipe(concat('style.css'))
   // после обработки всеми плагинами, минифицируем
   .pipe(minifyCss())
   // пишем sourcemap в результирующий файл
   .pipe(sourcemap.write())
   // пишем в конечную директорию
   .pipe(gulp.dest('public/css'))
});
```
Запускаем задачу - получаем минифицированный файл с сохраненной, благодаря **sourcemaps**, для отладки структурой.

###Плагин `gulp-autoprefixer`
В современном мире IT технологии развиваются очень быстро и не всегда разработчики браузеров за ними успевают (или хотят успевать). Для обеспечения поддержки последних веяний css в современных и не очень браузерах воспользуемся `gulp-autoprefixer`. Как обычно уставновим его, подключим и используем.
Установка:
```sh
$ npm i -D gulp-autoprefixer
```
Подключение:
```js
...
// Подключаем gulp-autoprefixer
const autoprefixer = require('gulp-autoprefixer');
```
Для демонстрации работы `gulp-autoprefixer` - немного изменим `src/less/main.less` файл:
```less
.page-wrapper {
  display: flex; /* добавим fleх контейнер */
  margin: 0 auto;
  width: 1000px;
}
```
и `src/less/header.less`:
```less
.page-header {
  padding: 0; /* уберем верхний padding */
  font-size: 0;
...
  .main-menu {
    display: inline-block;
    margin: 0 0 0 50px;
    padding: 20px 0 0; /* добавим отступ для красоты */
...
```
и сам `gulpfile.js` - отключим минификацию:
```js
// Задача для обработки стилей
gulp.task('style', () => {
 // путь к папке с less файлами
 gulp.src('src/less/**/*.less')
   // инициализируем sourcemap
   .pipe(sourcemap.init())
   // передаем на обработку less
   .pipe(less())
   // пропускаем поток стилей через autoprefixer
   .pipe(autoprefixer({ browsers: 'last 5 versions' }))
   // обьединяем в один файл стилей
   .pipe(concat('style.css'))
   // после обработки всеми плагинами, минифицируем
   // .pipe(minifyCss())
   // пишем sourcemap в результирующий файл
   .pipe(sourcemap.write())
   // пишем в конечную директорию
   .pipe(gulp.dest('public/css'))
});
```
Запускаем. Поверяем. Видно, что **autoprefixer** добавил подддержку для:
```css
  display: -webkit-flex;
  display: -ms-flexbox;
```
С настройками **autoprefixer** можно ознакомиться в официальном [репозитории](https://github.com/postcss/autoprefixer#options) или в репозитории [Browserslist](https://github.com/ai/browserslist#queries). Двигаемся дальше...

###Плагин `gulp-if`
Бывает необходимость запускать те или иные потоки, в зависимости от тех или иных условий или задач разработки. В этом случае можно воспользоваться стандартным javascript условием `if/else`, но куда более элегантно можно решить данную проблему через плагин [`gulp-if`](https://www.npmjs.com/package/gulp-if/), в документации очень красиво показано, как строить цепочки преобразования, а мы остановимся на простой задаче. А именно, для разработки нам вовсе не нужно минифицировать файлы, а в свою очередь на продакш нам не нужны **sourcemaps**. Давайте попробуем решить данную проблему с помощью `gulp-if`.
Установка:
```sh
$ npm i -D gulp-if
```
Подключение:
```js
...
// Подключаем gulp-if
const gulpIf = require('gulp-if');
```
Немного изменим `gulpfile.js` добавив в него переменную окружения NODE_ENV, с ее помощью мы будем понимать 'продакшн' у нас сейчас или 'девелопмент' и `gulp-if`:
```js
...
const gulpIf = require('gulp-if');

// если переменная окружения не задана или равна 'development':
// генерируем - 'sourcemaps' и не минифицируем код
const development = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

gulp.task('style', () => {
  gulp.src('src/less/index.less')
    .pipe(gulpIf(development, sourcemap.init()))
    .pipe(less())
    .pipe(autoprefixer({ browsers: 'last 5 versions' }))
    .pipe(concat('style.css'))
    .pipe(gulpIf(!development, minifyCss()))
    .pipe(gulpIf(development, sourcemap.write()))
    .pipe(gulp.dest('public/css'))
});
```
Запускаем как для 'девелопмента':
```sh
$ gulp style
```
На выходе сохранены **sourcemaps** и код не минифицирован. А теперь так:
```sh
$ NODE_ENV='production' gulp style
```
Получаем файл без **sourcemaps** и минифицированный код. Все просто.

###Запуск нескольких задач, копирование, удаление файлов и паралленьное выполнение
Давайте наведем порядок в нашем `gulpfile.js` и еще немного поэкспериментируем. Во-первых, оживим нашу страничку котиком, для этого добавим картинку и стили для нее. В файле `index.html`:
```html
    <main class="page-content">
      <p class="page-content__text">
        <img class="page-content__image" src="images/cat.jpg" alt="shocked cat"> <!-- добавим тег <img> с картинкой -->
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla odio nunc, faucibus a justo ac, varius condimentum nulla.
...
```
И стили для него в файле `src/less/content.less`:
```css
...
  .page-content__image {
    float: left;
    padding: 10px;
    width: 300px;
  }
...
```
Во-вторых, будем копировать каждый раз при билде содержимое папки `src/images` в папку `public/images`, для этого добавим еще один таск:
```js
...
// задача которая будет копировать содержимое папки src/images в public/images
gulp.task('images', () => {
  gulp.src('src/images/*.*')
    .pipe(gulp.dest('public/images'))
});
```
Далее, хорошо бы автоматически удалять папки `images` и `css` из директории `public` при повторной сборке, нет проблем, еще одна задача. Установим модуль [`del`](https://github.com/sindresorhus/del), это не модуль `gulp`, это модуль **Node.js**. Нам ничего не мешает использовать модули **Node.js** в связке с `gulp`, если они отлично решают необходимые задачи:
```sh
$ npm i -D del
```
Подключим его и опишем задачу:
```js
...
// подключаем модуль Node.js 'del'
const del = require('del');
...
// задача которая будет удалять папки public/css и public/images
// при повторной сборке
gulp.task('clean', () => {
  return del(['public/css', 'public/images']);
});
```
И наконец, воспользуемся еще одним плагином [gulp-sequence](https://www.npmjs.com/package/gulp-sequence) для организации всех задач в одну.
Установка:
```sh
$ npm i -D gulp-sequence
```
Подключение и новый таск:
```js
...
// подключаем плагин gulp-sequence
const sequence = require('gulp-sequence');
...
// задача которая будет выполнять билд нашего проекта:
// удалять папки из директории public, работать со стилями
// и копировать картинки
gulp.task('build', sequence('clean', ['style', 'images']));
```
Запускаем:
```sh
$ gulp build
[23:24:34] Using gulpfile ~/projects/gulp-learning/03-styles/gulpfile.js
[23:24:34] Starting 'build'...
[23:24:34] Starting 'clean'...
[23:24:34] Finished 'clean' after 8.17 ms
[23:24:34] Starting 'style'...
[23:24:34] Finished 'style' after 15 ms
[23:24:34] Starting 'images'...
[23:24:34] Finished 'images' after 1.74 ms
[23:24:34] Finished 'build' after 28 ms
```
Важно заметить, порядок указания аргументов функции `sequence('clean', ['style', 'images'])`, сначала запускается задача `clean`, а затем, параллельно `style` и `images`. Более подробно об этом можно прочитать в документации к плагину.

###Плагин `gulp-debug`
Простой плагин для отображения информации о процессе выполнения задач [`gulp-debug`](https://www.npmjs.com/package/gulp-debug/)
