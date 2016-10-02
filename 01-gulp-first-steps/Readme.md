#Gulp - первые шаги
Gulp текущей стабильной версии 3.9.1 требует установки двух пакетов. Глобально - пакета `gulp-cli`, который представляет собой утилиту командной строки и локально (в проект) сам `gulp`. При этом необходимо, чтобы в системе уже были установлены **Node.js** и пакетный менеджер **npm**.

Проверить это можно с помощью двух команд:
```sh
$ node -v
v6.7.0
```
покажет текущую установленную в системе версию **Node.js**, а
```sh
$ npm -v
3.10.3
```
покажет текущую установленную версию пакетного менеджера **npm**.

###Установка `gulp-cli`
Для установки `gulp-cli`, в командной строке выполняем команду:
```sh
$ npm install --global gulp-cli
```
или сокращенно
```sh
$ npm i -g gulp-cli
```

###Установка `gulp`
Для установки `gulp` в проект, в первую очередь, необходимо создать файл `package.json`, сделать это можно с помощью команды:
```sh
$ npm init
```
Утилита проведет Вас по всем шагам, необходимым для инициализации файла. На Ваше усмотрение все необходимые поля можно заполнить сразу или же подкорректировать, со временем, уже в самом файле `package.json`.

Далее можно установить `gulp` в Ваш проект:
```sh
$ npm install --save-dev gulp
```
или сокращенно
```sh
$ npm i -D gulp
```
При этом в корне Вашего проекта создатся папка `node_modules`, в которой будут храниться все зависимости.

###Команды `gulp`
Для получения текущей установленной версии `gulp`:
```sh
$ gulp -v
[16:56:58] CLI version 1.2.2
[16:56:58] Local version 3.9.1
```
Для получения справки по `gulp`:
```sh
$ gulp -h
Usage: gulp [options] tasks

Options:
  --help, -h       Show this help.                                     [boolean]
  --version, -v    Print the global and local gulp versions.           [boolean]
  --require        Will require a module before running the gulpfile. This is
                   useful for transpilers but also has other applications.
                                                                        [string]
  --gulpfile       Manually set path of gulpfile. Useful if you have multiple
                   gulpfiles. This will set the CWD to the gulpfile directory as
                   well.                                                [string]
  --cwd            Manually set the CWD. The search for the gulpfile, as well as
                   the relativity of all requires will be from here.    [string]
  --verify         Will verify plugins referenced in project's package.json
                   against the plugins blacklist.
  --tasks, -T      Print the task dependency tree for the loaded gulpfile.
                                                                       [boolean]
  --depth          Specify the depth of the task dependency tree.
  --tasks-simple   Print a plaintext list of tasks for the loaded gulpfile.
                                                                       [boolean]
  --tasks-json     Print the task dependency tree, in JSON format, for the
                   loaded gulpfile.
  --color          Will force gulp and gulp plugins to display colors, even when
                   no color support is detected.                       [boolean]
  --no-color       Will force gulp and gulp plugins to not display colors, even
                   when color support is detected.                     [boolean]
  --silent, -S     Suppress all gulp logging.                          [boolean]
  --continue       Continue execution of tasks upon failure.           [boolean]
  --log-level, -L  Set the loglevel. -L for least verbose and -LLLL for most
                   verbose. -LLL is default.                             [count]
```

### Первая задача на `gulp`
Чтобы проверить все ли правильно мы установили, созданим простую задачу для `gulp` и запустим её. Для этого нам понадобится в корне проекта создать файл `gulpfile.js` - конфигурационный файл для `gulp`, в нем то мы и будем описывать наши задачи.

Создать `gulpfile.js` можно с помощью IDE или текстового редактора, а можно с помощью терминала и команды:
```sh
$ touch gulpfile.js
```

В `gulpfile.js` подключим модуль `gulp` и опишем простой таск:
```js
const gulp = require('gulp');

gulp.task('default', () => {
  console.log('We are the champions!!!');
});
```

А затем запустим его:
```sh
$ gulp
[17:12:57] Using gulpfile ~/projects/gulp-learning/01-gulp-install/gulpfile.js
[17:12:57] Starting 'default'...
We are the champions
[17:12:57] Finished 'default' after 122 μs
```

Хочу обратить Ваше внимание на 3 вещи. Во-первых, последние версии **Node.js** умеют работать практически со всеми основными возможностями нового стандарта **ES-2015**, поэтому их смело можно использовать при написании задач для `gulp`. Во-вторых, ранее мы запустили одну задачу, но `gulp` позволяет запускать несколько задач, по очереди, перечисляя их через пробел, давайте немного изменим наш код:
```js
const gulp = require('gulp');

gulp.task('task1', () => {
  console.log('Task 1 done...');
});

gulp.task('task2', () => {
  console.log('Task 2 done...');
});
```
и запустим его:
```sh
$ gulp task1 task2
[17:38:15] Using gulpfile ~/projects/gulp-learning/01-gulp-first-steps/gulpfile.js
[17:38:15] Starting 'task1'...
Task 1 done...
[17:38:15] Finished 'task1' after 131 μs
[17:38:15] Starting 'task2'...
Task 2 done...
[17:38:15] Finished 'task2' after 36 μs
```

И последнее, если Вы обратили внимание, в самый первый раз мы не указывали имя задачи, запуская таск просто командой `gulp`. Дело в том, что для `gulp` - **default** - это одно из зарезервированных слов, поэтому описывая задачи под этим именем, при запуске, мы можем не указывать сам таск, а просто выполнить команду `gulp`.

### Полезные ссылки
* [Gulp](http://gulpjs.com)
* [Начало работы с Gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)
* [Документация](https://github.com/gulpjs/gulp/blob/master/docs/README.md#articles)
* [API Gulp](https://github.com/gulpjs/gulp/blob/master/docs/API.md)
* [Recipes](https://github.com/gulpjs/gulp/tree/master/docs/recipes)
* [package.json](https://docs.npmjs.com/files/package.json)
