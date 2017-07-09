# Directory Contents

This path contains the actual code for the common ground map. Essential files and directories include the following:

## Directories:
- css: stylesheets used to style the map etc.
- d3: code and libraries relating to our use of the [data driven documents](https://d3js.org) library for the common ground map
- js: javascript libraries used, including (js) leaflet plugins
- node_modules: node.js modules used to load our map

## Files in this directory
- clustering2.html: the starting point for our map
- contents.md: this file
- server.js: invokes our node.js server instance
- SQLcalls2.js: I think this is important, but not sure what it does.

## Maybe move into "sandbox"

*Assuming they're for sandbox purposes just now and will be deleted when we go "beta"? Can we move them all into "sandbox" to declutter the root directory?

- files in dir: CPindex.html, crimes_by_district.geojson, demo.js, index.html, indexD3.html, leaflet.jpeg, package.json, seperatePageTest2.js, thumbnail.png, webpack.config.js
- directories that seem to be good candidates (but move to be under "directories" if they belong permanently): dist, examples, leaflet-choropleth-gh-pages, src, test

## Files to move into ../data:
- unemployment.tsv
- us-states.js
- us.json

## Files to move into js directory (?)
- `PruneCluster.*`

## Delete or move into css:
- LeafletStyleSheet.css
- screen.css
