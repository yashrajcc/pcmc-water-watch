# Analytics (GoatCounter)

This site uses [GoatCounter](https://www.goatcounter.com) (`pcmc-water`).

## On the page

- Pageviews: `gc.zgo.at/count.js` → `https://pcmc-water.goatcounter.com/count`
- Nav **Visitors** chip: public JSON `…/counter/TOTAL.json` (fallback: current page path)
- Custom events in the dashboard:
  - zone filters, collab buttons, footer tiles, ward hover opens (debounced)

## Settings required for the visitor number

In GoatCounter → **Settings** for `pcmc-water`:

**Allow adding visitor counts on your website** → **enable**

Without this, tracking still works; the nav count stays hidden.

Also allow the site domain:

`https://yashrajcc.github.io`

## Dashboard

https://pcmc-water.goatcounter.com
