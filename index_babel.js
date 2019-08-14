"use strict";

var startString = '대한독립만세';
var upper = 'upper';

var addSpaces = function addSpaces(spaceLength) {
  var spaces = '';

  for (var i = 0; i < spaceLength; i++) {
    spaces += ' ';
  }

  return spaces;
};

var makeManuscript = function makeManuscript(string) {
  var nlIndex = string.indexOf('\n');

  while (nlIndex != -1) {
    var nlInOneLine = nlIndex % 15;
    string = string.slice(0, nlIndex) + addSpaces(15 - nlInOneLine) + string.slice(nlIndex + 1);
    nlIndex = string.indexOf('\n');
  }

  if (string.length < 150) {
    string += addSpaces(150 - string.length);
  } else {
    string.slice(0, 150);
  }

  var domTree = '',
      count = 135;

  for (var i = 0; i < 10; i++) {
    domTree = domTree + "<span class=\"".concat(upper, "\">").concat(string[count] == ' ' ? '&nbsp;' : string[count], "</span>");
    count = count - 15;
  }

  domTree += '<br>';
  count += 151;

  while (count < 150) {
    for (var _i = 0; _i < 10; _i++) {
      domTree = domTree + "<span>".concat(string[count] == ' ' ? '&nbsp;' : string[count], "</span>");
      count = count - 15;
    }

    count += 151;
    domTree += '<br>';
  }

  document.querySelector('#paper').innerHTML = domTree;
};

document.querySelector('#input').addEventListener('keyup', function () {
  makeManuscript(document.querySelector('#input').value);
});
document.querySelector('#font-selector').addEventListener('change', function () {
  var selectedFont = document.querySelector('#font-selector').value;
  document.querySelector('#paper').style.fontFamily = selectedFont;
  document.querySelector('.title').style.fontFamily = selectedFont;
  document.querySelector('.description').style.fontFamily = selectedFont;
});
document.querySelector('#saveButton').addEventListener('click', function () {
  html2canvas(document.querySelector('#paperContainer')).then(function (canvas) {
    var filename = new Date().toLocaleString() + '.png';

    if (canvas.msToBlob) {
      //for IE
      var blob = canvas.msToBlob();
      window.navigator.msSaveBlob(blob, filename);
    } else {
      //other browsers
      var link = document.createElement('a');

      var _filename = new Date().toLocaleString();

      document.body.appendChild(link);
      link.download = "".concat(_filename, ".png");
      link.href = canvas.toDataURL('image/png');
      link.target = '_blank';
      link.click();
    }
  });
});
makeManuscript(startString);
