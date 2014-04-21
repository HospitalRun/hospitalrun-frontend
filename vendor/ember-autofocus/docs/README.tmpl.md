##{%= name %} {%= version %}

Automatically focus on an input field upon page load in Ember
```html
// myView.handlebars
   :
{{ input autofocus="true" }}
   :
{{ autofocus }}
{# end of file #}
``` 

## Motivation
Setting the keyboard focus on a specific `input` element is a quite standard UI behaviour but rather tedious to accomplish in Ember.

Gladly, there’s [this very useful recipe on the Ember web site ](http://emberjs.com/guides/cookbook/user_interface_and_interaction/focusing_a_textfield_after_its_been_inserted/
) on how you’re supposed to do that; basically, you set the focus after the `didInsertElement` Ember event fires - done! [This](http://stackoverflow.com/questions/9468061/how-to-focus-after-initialization-with-emberjs), [this](http://stackoverflow.com/questions/14763318/set-focus-in-an-ember-application) and [this](http://stackoverflow.com/questions/12557584/how-to-use-autofocus-with-ember-js-templates) Stackoverflow answer propose similar techniques.


Unfortunately, the proposed solutions require subclassing into your own `View`s, which [I do not like so much](http://en.wikipedia.org/wiki/Coupling_%28computer_programming%29) for various reasons.

Thus, [Change](http://31.media.tumblr.com/tumblr_lnssyhB9FW1qkmpj8o1_500.gif)!


## Solution
`ember-autofocus` bundles Ember's proposed technique into a neat package and adds a few improvements along the way:

+ **Just add water**. No coding. Load it, boom, hooray!
+ **No more subclassing**. Because, [subclassing](http://en.wikipedia.org/wiki/Coupling_%28computer_programming%29).
+ **Works on any element**. If you pass it a CSS selector.
+ **No configuration**. If you don't pass a CSS selector it takes the first text input it finds.
+ **HTML5 compatible**. Uses the native `autofocus` attribute if available.
+ **HTML<5 fallback**. No HTML5, no problem.
+ **Tiny.** 0.000000670552254 Gigabytes.
+ **It’s really elegant.** [Elegance is a glowing inner peace](https://www.goodreads.com/quotes/436052-elegance-is-a-glowing-inner-peace-grace-is-an-ability).

## How it works

+ Installs an `autofocus` attribute for `InputField` for HTML5 compatibility 
+ Adds an `{{autofocus}}` `View` that uses jQuery to set the focus
+ learn from the source, it’s really minimal


## Installing

### Bower
```
bower install ember-autofocus
```

In your `index.html`:

```html
<script type="text/javascript" src="bower_components/ember-autofocus/dist/ember-autofocus.min.js)"></script>
```

## Usage

### Most compatible (recommended)
+ Sets the focus on the first `<input|button|textarea>` element with an `autofocus` attribute.
+ Uses the browser’s native HTML5 functionality if available.
+ Works in pre-HTML5 browsers.

```html
// myView.handlebars
   :
{{ input autofocus="autofocus"}}
   :
{{ autofocus }}
{# end of file #}
``` 

### Laziest
Autofocus on the first `<input>` element.

```html
// myView.handlebars
   :
{{ input }}
   :
{{ autofocus }}
{# end of file #}
``` 

### Most Sophisticated
Use a CSS selector to autofocus on a specific element.

```html
// myView.handlebars
   :
{{ autofocus on='#my-special-element .my-unique-class' }}
{# end of file #}
``` 

## Automatic scrolling in HTML5

Safari, Chrome, Firefox and possibly other HTML5 browsers that support `autofocus` natively will set the keyboard focus to the specified field _and will automatically scroll there_. In my use case, that's not wanted because the input field may be below the screen fold and automatically scrolling there is not what users would expect.

You can choose whether or not you want the scrolling behavior with the `scrolling` option:

`scrolling = "true|false"`

The default is `false`, which means that the browser will **not scroll** to the `autofocus` element.

```html
// myView.handlebars
   :
{{ autofocus scrolling="true" }}
{# end of file #}
```

## Caveats
- **Will focus even on hidden/invisible items.** Pull Requests welcome.


# Thanks

I have found some very valuable advice during my research which I have built into `ember-autofocus`:

+ The Ember team for their article "[Focusing a TextField after it’s been inserted](http://emberjs.com/guides/cookbook/user_interface_and_interaction/focusing_a_textfield_after_its_been_inserted/)"
+ [Matthew Beale](https://github.com/mixonic) for his excellent article on "[Lifecycle hooks in EmberJS Views](http://madhatted.com/2013/6/8/lifecycle-hooks-in-ember-js-views)".
+ [hyder](http://discuss.emberjs.com/users/hyder/activity) for linking to Matthew's article.
+ [Mark Pilgrim](https://github.com/diveintomark) for the [`autofocus` feature detection snippet](http://diveintohtml5.info/detect.html).


## License
Copyright (c) 2014 Andreas Pizsa. Released under an MIT license.

--------------------------------
Made with ❤ in Vienna, Austria.
