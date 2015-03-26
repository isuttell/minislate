# Minislate

This is Minislate, a minimalist, opinionated WYSIWYG editor. It aims at getting things right and avoiding common pitfalls of web editors.

## Minimalist & opinionated

One of the most challenging tasks with web editors is to keep it as simple as possible while having it work on major platforms. Here are some strong principles followed by Minislate:

 - What you need, when you need it, based on context
 - Extensible components (buttons and menus)
 - Vanilla JavaScript. No framework, keep yours!

## Download and install

First, [download Minislate](https://github.com/isuttell/minislate/releases), unzip it and copy the following files to a location of your choice:

- `css/minislate-full.min.css` (Fontawesome included)
- `css/fonts` (keep fonts in the same folder as the css file)
- `js/minislate.min.js`

Add the following code in the `head` element of your page:

```html
<link rel="stylesheet" href="css/minislate-full.min.css" />
```

At the bottom of the page, before the `</body>` tag, add this code:

```html
<script src="js/minislate.js"></script>
<script>
window.addEventListener('DOMContentLoaded', function() {
  // Create
  var editor = new Minislate.simpleEditor(document.getElementById('#editable'),{
        delay: 300,
        diffLeft: 2,
        diffTop: -10,
        classPrefix: 'editor-',
        fontAwesomeEnabled: true,
        faClass: 'fa',
        pasteAsText: true,
        controls: {
            'blocks': true,
            'lists': true,
            'quote': true,
            'bold': true,
            'italic': true,
            'underline': true,
            'strike': true,
            'link': true,
            'image': true,
            'oembed' : false // Not implemented
        }
  });

  // Remove
  editor.destroy();
});
</script>
```

Minislate uses Font Awesome. If you already have it on your website, just include and load the stylesheet named `css/minislate.min.css`.

## Hack it

You need [Grunt](http://gruntjs.com/).

After cloning this repository, run `npm install` and then `grunt runserver`. Open the `http://localhost:5000/` URL in your browser. Sources are in `src` folder.
