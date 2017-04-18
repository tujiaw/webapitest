var marked = require('marked');
var fs = require('fs');
var cheerio = require('cheerio');
var path = require('path');

marked.setOptions({
  highlight: function (code) {
    return require('highlight.js').highlightAuto(code).value;
  }
});

var MD_PATH = path.join(__dirname, './public/api/help.md');
var HTML_PATH = path.join(__dirname, './public/api/help.html');
console.log('from:' + MD_PATH);
console.log('to:' + HTML_PATH);
var mdContent = fs.readFileSync(MD_PATH, 'utf8');
var htmlContent = fs.readFileSync(HTML_PATH, 'utf8');
var $ = cheerio.load(htmlContent);
$('.markdown-body').html(marked(mdContent))
fs.writeFileSync(HTML_PATH, $.html(), 'utf8');
