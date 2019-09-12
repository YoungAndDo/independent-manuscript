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

// 출처: https://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
function dataURItoBlob(dataURI) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString = dataURI.split(',')[0].indexOf('base64') >= 0 ? atob(dataURI.split(',')[1]) : unescape(dataURI.split(',')[1]); // separate out the mime component

  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]; // write the bytes of the string to a typed array

  var ia = new Uint8Array(byteString.length);

  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], {
    type: mimeString
  });
}

document.querySelector('#saveButton').addEventListener('click', function () {
  html2canvas(document.querySelector('#paperContainer'))
    .then(function (canvas) {
      var filename = "".concat(new Date().toLocaleString(), ".png");
      if (canvas.msToBlob) { //for IE
        var _blob = canvas.msToBlob();
        return window.navigator.msSaveBlob(_blob, filename);
      }
      //other browsers
      //참고: http://charlie0301.blogspot.com/2014/10/html5-canvas-blob-data-post-upload.html
      var dataurl = canvas.toDataURL('image/png');
      var blob = dataURItoBlob(dataurl);
      var formData = new FormData();
      formData.append('file', blob);
      fetch('upload', { method: 'POST', body: formData })
        .then(function (res) { return res.json();})
        .then(function (result) {
          if (result.message == 'finished') {
            var link = document.createElement('a');
            link.href = 'download';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
          }
        });
    });
});
makeManuscript(startString);
