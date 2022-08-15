'user strict'
var gElCanvas;
var gCtx;


var isFirstLine
var isSecondLine
var gText
var gDefaultLine
var gTopTxtLocation
var gBottomTxtLocation
var gCenterTxtLocation
var gSelectedLine = null
var gIsDownloadImg = false

var gFontFamily

function initEditor(imgId) {
    initCanvas()
    if (imgId === undefined) getFlexibleMeme()
    else {
        createMeme(imgId, getLineSizeByLocation(0))
    }
    onChangeFont(document.querySelector('.item-font').value)
    updateInputPlaceholder()
    renderMemeToCanvas()
}

function initEditorWithMeme(memeIdx) {
    initCanvas()
    setExistMeme(memeIdx)
    onChangeFont(document.querySelector('.item-font').value)
    updateInputPlaceholder()
    renderMemeToCanvas()
}

function initCanvas() {
    gElCanvas = document.querySelector('#meme-canvas');
    gCtx = gElCanvas.getContext('2d');

    restartLines()
    gDefaultLine = { txt: 'Enter text here', size: 20, align: 'center', color: 'red' }
    updateLocations()
    resizeCanvas()
    addListeners()
}

function updateLocations() {
    gTopTxtLocation = { x: gElCanvas.width / 2, y: gElCanvas.height / 10 }
    gBottomTxtLocation = { x: gElCanvas.width / 2, y: gElCanvas.height - 60 }
    gCenterTxtLocation = { x: gElCanvas.width / 2, y: gElCanvas.height / 2 }
}

function renderMemeToCanvas() {
    var img = new Image()
    img.src = `imgs/meme-imgs-square/${getMemeImg()}.jpg`
    img.onload = () => {
        // gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height) //Not sure if neccesary
        //            (img, x, y,       xend,            yend      )
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        restartLines()
        drawLines()
    }
}

function restartLines() {
    isFirstLine = true
    isSecondLine = false
}


function updateInputPlaceholder() {
    var currLineTxt = getCurrLineTxt()
    document.querySelector('.line-input').value = (currLineTxt === undefined) ? 'Enter Text Here' : currLineTxt
}

function onTypeLine(txt) {
    setLineText(txt)
    renderMemeToCanvas()
}

function onChangeColor(newColor) {
    setLineColor(newColor)
    renderMemeToCanvas()
}

function onChangeFont(newFont) {

    gFontFamily = newFont
    renderMemeToCanvas()
}

function onDecreaseSize() {
    decreaseLineSize()
    renderMemeToCanvas()
}

function onIncreaseSize() {
    increaseLineSize()
    renderMemeToCanvas()
}

function onSwitchLines() {
    switchSelectedLine()
    renderMemeToCanvas()
    if (getCurrLineIdx() >= 0) {
        updateInputPlaceholder()
    }
}

function onCreateLine() {
    var nextLineLocation = getLineSizeByLocation(getCurrLineIdx() + 1)
    createNewLine(nextLineLocation)
    updateInputPlaceholder()
    renderMemeToCanvas()
}

function getLineSizeByLocation(rowIndex) {
    switch (rowIndex) {
        case 0:
            return { x: 10, y: 10 }
        case 1:
            return { x: 10, y: gElCanvas.height - 50 }
        default:
            return { x: 10, y: gElCanvas.height / 2 }
    }

}

function drawLineRect(lineSizes) {
    gCtx.beginPath()
    gCtx.rect(lineSizes.x, lineSizes.y, lineSizes.width, lineSizes.height)
    gCtx.setLineDash([12, 3, 3]);
    gCtx.stroke()
}

function drawLines() {
    var memeLines = getMemeLines()

    memeLines.forEach((line, idx) => {
        gCtx.beginPath()
        gCtx.font = ` ${line.size}px ${gFontFamily}`;
        const textMeasure = gCtx.measureText(`${line.txt}`)
        const textWidth = textMeasure.width
        const fontHeightPlusPadding = textMeasure.fontBoundingBoxAscent + textMeasure.fontBoundingBoxDescent
        gCtx.textBaseline = 'top';
        gCtx.textAlign = 'left';
        gCtx.lineWidth = 2;
        gCtx.fillStyle = `${line.color}`;
        if (line.lineLocation.rowIndex === -1) line.lineLocation = getLineSizeByLocation(idx)


        var newLineLocation
        switch (line.align) {
            case 'right':
                // newLineLocation = { x: 10, y: line.lineLocation.y }
                line.lineLocation.x = 10
                break;
            case 'center':
                // newLineLocation = { x: gElCanvas.width / 2 - textWidth / 2, y: line.lineLocation.y }
                line.lineLocation.x = gElCanvas.width / 2 - textWidth / 2
                
                break;
            case 'left':
                // newLineLocation = { x: gElCanvas.width - textWidth - 10, y: line.lineLocation.y }
                line.lineLocation.x = gElCanvas.width - textWidth - 10
                break;
        }
        gCtx.fillText(line.txt, line.lineLocation.x, line.lineLocation.y)
        if (getCurrLineIdx() === idx && !gIsDownloadImg) {
            gCtx.strokeStyle = `${line.color}`
            gCtx.rect(line.lineLocation.x, line.lineLocation.y, textWidth, fontHeightPlusPadding)
            gCtx.setLineDash([12, 3, 3]);
            gCtx.stroke()
        }
        gCtx.closePath()
    })
}

function onDeleteLine() {
    deleteLine()
    updateInputPlaceholder()
    renderMemeToCanvas()
}

function onAlignChange(align) {
    setLineAlign(align)
    renderMemeToCanvas()
}

function onDownloadCanvas() {
    gIsDownloadImg = true
    renderMemeToCanvas()
    setTimeout(() => {
        var canvas = document.getElementById("meme-canvas")
        var anchor = document.createElement("a")
        anchor.href = canvas.toDataURL("image/png")
        anchor.download = "IMAGE.PNG"
        anchor.click()
    }, 1000);
}

function onSaveCanvas() {
    document.querySelector('.save-btn-text').innerText = 'Saved! :)'
    saveToMemesGallery(getMemeIdx())
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
}

function addListeners() {
    //addMouseListeners()
    //addTouchListeners()
    window.addEventListener('resize', () => {
        resizeCanvas()
        updateLocations()
        renderMemeToCanvas()
    })
}


function addMouseListeners() {
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchend', onUp)
}

function onDown(ev) {
    // Getting the clicked position
    const pos = getEvPos(ev)
    // { x: 15, y : 15 }
    gSelectedLine = getPressedLine(ev)
    if (gSelectedLine !== null) {
        //calculate what is the offset of the top left corner of the line 
        //i will use this offset whiledraggin so that the peace doesnt just snapped to the most location
        //it will make for a smoother interaction
        gSelectedLine.offset = {
            x: ev.x - gSelectedLine.x,
            y: ev.y - gSelectedLine.y
        }
    }

}

function onMove(ev) {
    if (gSelectedLine !== null) {
        //update to location to the new mouse location and consider the offset as well
        gSelectedLine.x = ev.x - gSelectedLine.offset.x
        gSelectedLine.y = ev.y - gSelectedLine.offset.y
    }

}

function onUp() {
    //TODO

    // setCircleDrag(false)
    // document.body.style.cursor = 'grab'
}

function getPressedLine(location) {
    // iterate through all lines and check if the click location is within the bounds of any of them
    var lines = getMemeLines()
    for (let i = 0; i < lines.length; i++) {
        //check if x is greater than the line's x and plus the line's width
        if (location.x > lines[i].pos.x && location.x < lines[i].pos.x + lines[i].width) {

        }
        const element = array[i];

    }
}

function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    // const gTouchEvs = ['touchstart', 'touchmove', 'touchend']
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft,
            y: ev.pageY - ev.target.offsetTop
        }
    }
    return pos
}