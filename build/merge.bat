java -jar js.jar build_editor_css_all.js ../themes/default/ ../themes/default/css/umeditor.css

java -jar js.jar build_editor_js_all.js ../ ../umeditor.all.js

java -jar yuicompressor-2.4.6.jar --nomunge --preserve-semi  --disable-optimizations --charset utf-8 ../umeditor.all.js -o ../umeditor.all.min.js


