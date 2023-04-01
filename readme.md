# Gulp-збірка для верстки

Gulp-збірка для верстки з використанням шаблонізатора PUG, CSS фреймворку Tailwind CSS та препроцесора SASS для середніх за розміром проєктів (інтернет-магазин, корпоративний сайт, сервіс).  

## Файлова структура

```
├── src/
│   ├── fonts                      # тека для шрифтів
│   │   ├── roboto                 # тека для конкретного шрифту
│   ├── img                        # тека для зображень
│   │   ├── content                # тека для контентних зображень (товар, зображення для блогу, банер, ...)
│   │   ├── favicon                # тека для фавікону та маніфест-файлу
│   │   ├── icons                  # тека для інтерфейсних іконок (стрілка, пошук, чекбокс, ..)
│   │   ├── icons-content          # тека для контентних іконок (логотипи, декоративні елементи, ..)
│   ├── js                         # тека для js-файлів
│   ├── libs                       # тека для бібліотек
│   │   ├── jquery                 # бібліотека
│   │   ├── jquery-modal           # бібліотека
│   │   ├── jquery-ui              # бібліотека
│   ├── pug                        # тека для pug-файлів
│   │   ├── gulp-pages             # тека для головних pug-файлів (які таск-менеджер перетворить в html)
│   │   ├── layouts                # тека для глобальних pug-шаблонів (головний шаблон сторінки та повторювані на всіх сторінках елементи)
│   │   │   ├── modals             # тека для глобальних pug-шаблонів модальних вікон
│   │   ├── pages                  # тека для шаблонів конкретних сторінок
│   │   │   ├── home               # тека для конкретної сторінки та її блоків
│   │   │   ├── account            # тека для конкретної сторінки та її блоків
│   │   ├── partials               # тека для міксинів (інпут, картка товару, ...)
│   │   ├── templates              # тека для шаблонного коду (хлібні крихти, пагінація, ...)
│   ├── sass                       # тека для стильових файлів
│   │   ├── base                   # тека для базових стильових файлів
│   │   ├── pages                  # тека для стильових файлів конкретних сторінок (блоки, секції)
│   │   │   ├── all-pages          # тека для стильових файлів які потрібні на кожній сторінці
│   │   │   ├── account            # тека для стильових файлів конкретної сторінки (блоки, секції)
│   │   │   ├── home               # тека для стильових файлів конкретної сторінки (блоки, секції)
│   │   ├── partials               # тека для стильових файлів міксинів та шаблонних елементів
│   │   ├── tailwind               # тека для стильового файлу необхідного для Tailwind CSS
│   │   └── all-pages.sass         # загальний стильовий файл для всіх сторінок
│   │   └── home.sass              # стильовий файл для конкретної сторінки
│   │   └── account.sass           # стильовий файл для конкретної сторінки
```

З метою оптимізації кінцевого результату та зручності підтримки продукту кожна HTML-сторінка містить в собі:

-   загальні CSS-файли - ті, що використовуються на всіх сторінках (як власні стилі, так і бібліотеки):
    -   `tailwind.css`
    -   `...`
    -   `all-pages.css`
-   унікальні CSS-файли - ті, що використовуються лише на цій сторінці (як власні стилі, так і бібліотеки):
    -   `owl.carousel.min.css`
    -   `owl.theme.default.min.css`
    -   `...`
    -   `product.css`
-   загальні JS-файли - ті, що використовуються на всіх сторінках (як власні скрипти, так і бібліотеки):
    -   `jquery.min.js`
    -   `...`
    -   `all-pages.js`
-   унікальні JS-файли - ті, що використовуються лише на цій сторінці (як власні скрипти, так і бібліотеки):
    -   `owl.carousel.min.js`
    -   `...`
    -   `product.js`

## Загальна інформація

-   `+input.pug`, `+input.sass` - [міксин](https://pugjs.org/language/mixins.html), назва файлу завжди починається з +
-   `_section.pug`, `_section.sass` - шаблон, назва файлу завжди починається з _
-   `include _section.pug` - підключити pug-файл. Шлях відносно поточного файлу
-   `@import _section.sass` - підключити sass-файл. Шлях відносно поточного файлу
-   `src/pug/layouts/main.pug` => `block css`, `block js`, `block content`, `block modal` - місця, в яких буде знаходитись код з дочірних сторінок, що наслідують цей шаблон


## Старт

Необхідно мати [Node.js](https://nodejs.org/en/) та [Npm](https://www.npmjs.com/).

1. Встановити всі пакети:

```
npm i
```

2. Запустити в режимі розробки:

```
npm run dev
```

3. Зібрати production-версію:

```
npm run prod
```

## Опис задач

1. **clean()** - видалити вміст `docs`
2. **copyJs()** - скопіювати js-файли з `src/js/*` в `docs/js/` (без обробки)
3. **copyImg()** - скопіювати зображення з `src/img/*` в `docs/img/` (без обробки)
4. **copyLibs()** - скопіювати бібліотеки з `src/libs/*` в `docs/libs/` (без обробки)
5. **copyFonts()** - скопіювати шрифти з `src/fonts/*` в `docs/fonts/` (без обробки)
6. **devStyles()** - обробити sass-файли з `src/sass/*` та покласти в `docs/css`
7. **prodStyles()** - обробити sass-файли з `src/sass/*` та покласти в `docs/css` з постобробкою для production
8. **jade()** - обробити pug-файли з `src/pug/gulp-pages/*` та покласти в `docs/`
9. **jadeProd()** - обробити pug-файли з `src/pug/gulp-pages/*` та покласти в `docs/` з постобробкою для production
10. **livePreview()** - запустити локальний сервер
11. **watchFiles()** - відстежувати зміну файлів
12. **previewReload()** - перезавантажити сервер якщо файли змінились

## Запитання і відповіді

### Чому автоматично ніяк не обробляється (стискається) растрова графіка?

Особисто мені цей функціонал не потрібен. Як контентні зображення я використовую [плейсхоледери](https://picsum.photos/), а декоративні елементи якщо вони растрові - обробляю в ручному режимі.

### Чому автоматично ніяк не обробляється (стискається) векторна графіка?

Тому що постійно доводиться змінювати правила обробки від проєкту до проєкту. Якість векторної графіки в дизайні буває різною, SVG може містити в собі то растрову графіку, то скрипти, то прозорість замість кольору. Це не дуже зручно, тож прийнято рішення обробляти в ручному режимі.

### Чому не використовується svg-спрайт?

Тому що з цим зручно працювати лише на етапі верстки. На етапі підтримки та розвитку проєкту коли все змінюється - важко тримати його в актуальному стані.

### В sass-файлах можна знайти `_HOTFIX.sass`. Що це?

Цей файл створено для бекенд-розробників на той випадок, коли треба терміново щось пофіксити, але немає часу розбиратись (або він не дуже в верстку). Вони пишуть туди будь-який "брудний" код, потім я його переробляю і переношу куди потрібно.

### Навіщо в файлі `src/pug/layouts/main.pug` є змінна `var version = '?v=1'`?

Ця змінна використовується для тих випадків, коли треба оновити файли верстки на хостингу з кешуванням. Зміна версії призведе до сприйняття файлу сервером як нового.

### Навіщо створювати окремі css-файли під кожну сторінку?

Це зручно з точки зору оптимізації та підтримки великих проєктів.

### Якщо файл `all-pages.css` використовується на всіх сторінках - чому він підключається на конкретній сторінці перед іншими css-файлами а не в `src/pug/layouts/main.pug`?

Тому що на конкретній сторінці можуть підключатися сторонні бібліотеки. У випадку коли нам потрібно кастомізувати цю бібліотеку перезаписом стилів в `all-pages.css` порядок підключення файлів може мати значення.

### Навіщо помаранчевий блок з посиланнями що відкривають модальні вікна?

Для бекенд-розробників, щоб завжди було очевидно що є прихованим на цій конкретній сторінці.

## Корисні сторонні сервіси

Для обробки векторної графіки (svg) - [SVGOMG](https://jakearchibald.github.io/svgomg/).  
Для обробки растрової графіки (jpg, png, webp, ..) - [Squoosh](https://squoosh.app/).  
Для генерації зображень будь-яких розмірів (плейсхолдери) - [Lorem Picsum](https://picsum.photos/).
