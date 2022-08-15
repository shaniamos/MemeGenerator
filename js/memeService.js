'user strict'

var gMemes
var gCurrMeme
var gMemeIdx
var gColors = ['black', 'green', 'blue', 'yellow', 'red', 'pink', 'white', 'purple']
var gSizes = [30, 40,]
var gSentences = [
    'AM I HELPING?',
    'WHOO-GOO-PHO',
    'IS THE THANKNESS!',
    'What if I told you',
    'Learn english to understand English memes',
    'Really?',
    'What my social media see',
    'What they dont see',
    'She said "You can get on the airplane"',
    'Me after fighting with my sibling to 2 hrs',
]

function getFlexibleMeme() {
    gMemeIdx = getRandomInt(0, gMemes.length - 1)
    gCurrMeme = gMemes[gMemeIdx]
    return gCurrMeme
}

function getRandomMe() {
    gCurrMeme =
    {
        selectedImgIdx: getRandomInt(5, gImgs.length - 1),
        selectedLineIdx: 0,
        lines: getRandomLines(),
        imgData: null,
    }
    return gCurrMeme
}

function getRandomLines() {
    var lines = []
    var numOfLines = getRandomInt(1, 1)
    for (var i = 0; i < numOfLines; i++) {
        lines.push(createRandomLine())
    }
    return lines
}

function createRandomLine() {
    return {
        txt: gSentences[getRandomInt(0, gSentences.length - 1)],
        size: gSizes[getRandomInt(0, gSizes.length - 1)],
        align: 'center',
        color: gColors[getRandomInt(0, gColors.length - 1)],
        lineLocation: { x:10 , y:10 }
    }
}

function createMeme(imgId, lineLocation) {
    const newMeme =
    {
        selectedImgIdx: imgId,
        selectedLineIdx: 0,
        lines: [createLine(lineLocation)]
    }
    gCurrMeme = newMeme
    gMemeIdx = gMemes.length
    gMemes.push(newMeme)
}

function setExistMeme(memeIdx) {
    gMemeIdx = memeIdx
    gCurrMeme = gMemes[gMemeIdx]
}

function getMemeIdx() {
    return gMemeIdx
}

function createNewLine(lineLocation) {
    gCurrMeme.selectedLineIdx = gCurrMeme.lines.length
    gCurrMeme.lines.push(createLine(lineLocation))
}

function createLine(lineLocation) {
    return { txt: 'Enter Text Here', size: 40, align: 'center', color: 'black', lineLocation }
}

function deleteLine() {
    if (!gCurrMeme.lines.length) return
    gCurrMeme.lines.splice(gCurrMeme.selectedLineIdx, 1)
    if (gCurrMeme.selectedLineIdx) gCurrMeme.selectedLineIdx--
}

function getMemeByIdx(idx) {
    return gMemes[idx]
}

function getMemeImg() {
    return gCurrMeme.selectedImgIdx
}

function getCurrLineTxt() {
    if (!gCurrMeme.lines.length) return
    return gCurrMeme.lines[gCurrMeme.selectedLineIdx].txt
}

function getCurrLineSize() {
    if (!gCurrMeme.lines.length) return
    return gCurrMeme.lines[gCurrMeme.selectedLineIdx].size
}

function getCurrLineIdx() {
    return +gCurrMeme.selectedLineIdx
}

function getMemeLines() {
    return gCurrMeme.lines
}

function getLineLocation() {
    return gCurrMeme.lines[gCurrMeme.selectedLineIdx].lineLocation
}

function setLineText(newTxt) {
    if (!gCurrMeme.lines.length) createNewLine(newTxt)
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].txt = newTxt
}

function setLineSize(newSize) {
    if (!gCurrMeme.lines.length) return

    gCurrMeme.lines[gCurrMeme.selectedLineIdx].size = newSize
}

function setLineAlign(newAlign) {
    if (!gCurrMeme.lines.length) return
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].align = newAlign
}

function setLineColor(newColor) {
    if (!gCurrMeme.lines.length) return

    gCurrMeme.lines[gCurrMeme.selectedLineIdx].color = newColor
}

function increaseLineSize() {
    if (!gCurrMeme.lines.length) return

    if (gCurrMeme.lines[gCurrMeme.selectedLineIdx].size < 60) {
        gCurrMeme.lines[gCurrMeme.selectedLineIdx].size += 10
    }
}

function decreaseLineSize() {
    if (!gCurrMeme.lines.length) return

    if (gCurrMeme.lines[gCurrMeme.selectedLineIdx].size > 10) {
        gCurrMeme.lines[gCurrMeme.selectedLineIdx].size -= 10
    }
}

function switchSelectedLine() {
    if (gCurrMeme.lines.length > 1) {
        gCurrMeme.selectedLineIdx =
            (gCurrMeme.selectedLineIdx < gCurrMeme.lines.length - 1) ? gCurrMeme.selectedLineIdx + 1 : 0
    }
}

