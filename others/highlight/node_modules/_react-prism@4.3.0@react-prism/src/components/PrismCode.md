Put your code inside `<PrismCode>` component, and it will highlight it and wraps it into a `<code>` component:


```
require('prismjs');
require('prismjs/themes/prism.css');

<PrismCode className="language-javascript">
{`
  const id = x => x
`}
</PrismCode>
```
// or a `<pre>` component:

```
<PrismCode component="pre" className="language-javascript">
{`
  const id = x => x
`}
</PrismCode>
```

**`react-prism` depends on the existence of `globals.Prism` object.**

You'll either need to either:

- load it via `<script>` tag in the `<head>`, or
- require `prismjs` manually before using the component:

```js
require('prismjs');
require('prismjs/themes/prism.css');
```

```
<PrismCode component="pre" className="language-css">
{`
  code[class*="language-"],
  pre[class*="language-"] {
    color: black;
    /* …… */
  }
`}
</PrismCode>
```

To make default themes to work, you'll need to wrap it in a `<pre>` component (unveil the `CODE` section):


```
<PrismCode component="pre" className="language-markup">
{`
  <!DOCTYPE html>
    <html lang="en">
      <head>
        <script>
          // Just a lil’ script to show off that inline JS gets highlighted
          window.console && console.log('foo');
        </script>
        <meta charset="utf-8" />
        <link rel="shortcut icon" href="favicon.png" />
        <title>Prism</title>
        <link rel="stylesheet" href="style.css" />
        <link rel="stylesheet" href="themes/prism.css" data-noprefix />
        <script src="prefixfree.min.js"></script>
        <script>var _gaq = [['_setAccount', 'UA-33746269-1'], ['_trackPageview']];</script>
        <script src=\"http://www.google-analytics.com/ga.js\" async></script>
      </head>
      <body></body>
    </html>
`}
</PrismCode>
```
