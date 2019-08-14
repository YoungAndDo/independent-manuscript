const startString = '대한독립만세';
const upper = 'upper';

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

document.querySelector('#saveButton').addEventListener('click', () => {
    html2canvas(document.querySelector('#paperContainer')).then(canvas => {
        const filename = new Date().toLocaleString() +'.png';
        if (canvas.msToBlob) { //for IE
            const blob = canvas.msToBlob();
            window.navigator.msSaveBlob(blob, filename);
        } else {  //other browsers
            const link = document.createElement('a');
            const filename = new Date().toLocaleString();
            document.body.appendChild(link);
            link.download = `${filename}.png`;
            link.href = canvas.toDataURL('image/png');
            link.target = '_blank';
            link.click();
        }
    });    
});

makeManuscript(startString);
