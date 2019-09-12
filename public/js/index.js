const startString = '대한독립만세';
const upper = 'upper';

window.html2canvas = html2canvas;

const addSpaces = spaceLength => {
    let spaces = '';
    for (let i = 0; i < spaceLength; i++) {
        spaces += ' ';
    }
    return spaces;
}

const makeManuscript = string => {
    let nlIndex = string.indexOf('\n');
    while (nlIndex != -1) {
        const nlInOneLine = nlIndex % 15;
        string = string.slice(0, nlIndex) + addSpaces(15 - (nlInOneLine)) + string.slice(nlIndex+1);
        nlIndex = string.indexOf('\n');
    }
    if (string.length < 150) {
        string += addSpaces(150 - string.length);
    } else {
        string.slice(0, 150);
    }
    let domTree = '', count = 135;
    for (let i = 0; i < 10; i++) {
        domTree = domTree + `<span class="${upper}">${string[count] == ' ' ? '&nbsp;' : string[count]}</span>`;
        count = count - 15;
    }
    domTree += '<br>';
    count += 151;
    while (count < 150) {
        for (let i = 0; i < 10; i++) {
            domTree = domTree + `<span>${string[count] == ' ' ? '&nbsp;' : string[count]}</span>`;
            count = count - 15;
        }
        count += 151;
        domTree += '<br>';
    }
    document.querySelector('#paper').innerHTML = domTree;
};

document.querySelector('#input').addEventListener('keyup', () => {
    makeManuscript(document.querySelector('#input').value);
});

document.querySelector('#font-selector').addEventListener('change', () => {
    const selectedFont = document.querySelector('#font-selector').value;
    document.querySelector('#paper').style.fontFamily = selectedFont;
    document.querySelector('.title').style.fontFamily = selectedFont;
    document.querySelector('.description').style.fontFamily = selectedFont;
});

// 출처: https://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    const byteString = (dataURI.split(',')[0].indexOf('base64') >= 0 ? 
        atob(dataURI.split(',')[1]) : 
        unescape(dataURI.split(',')[1]));

    // separate out the mime component
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type: mimeString});
}

document.querySelector('#saveButton').addEventListener('click', async () => {
    const canvas = await html2canvas(document.querySelector('#paperContainer'));
    const filename = `${new Date().toLocaleString()}.png`;
    if (canvas.msToBlob) { //for IE
        const blob = canvas.msToBlob();
        return window.navigator.msSaveBlob(blob, filename);
    }
    //other browsers
    //참고: http://charlie0301.blogspot.com/2014/10/html5-canvas-blob-data-post-upload.html
    const dataurl = canvas.toDataURL('image/png');
    const blob = dataURItoBlob(dataurl);
    const formData = new FormData();
    formData.append('file', blob);

    const result = await fetch('upload', {method: 'POST', body: formData}).then(res => res.json());
    if (result.message == 'finished') {
        const link = document.createElement('a');
        link.href = 'download';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
    }
});

makeManuscript(startString);
