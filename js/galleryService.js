'user strict'

const STORAGE_KEY = 'memeDB'
var gFilterBy = ''
var gKeywordSearchCountMap = { 'funny': 12, 'animal': 16, 'cute': 2, 'crazy': 2 }

var gImgs = [
    { id: 1, url: 'imgs/meme-imgs-square/1.jpg', keywords: ['funny', 'crazy', 'men'] }, //Trump
    { id: 2, url: 'imgs/meme-imgs-square/2.jpg', keywords: ['cute', 'animal'] }, //Dogs kissed
    { id: 3, url: 'imgs/meme-imgs-square/3.jpg', keywords: ['funny', 'animal'] }, //Dog & Baby Sleeping
    { id: 4, url: 'imgs/meme-imgs-square/4.jpg', keywords: ['cute', 'animal'] }, //Cat Sleep
    { id: 5, url: 'imgs/meme-imgs-square/5.jpg', keywords: ['funny', 'baby'] }, //Lil Kid say "Say"
    { id: 6, url: 'imgs/meme-imgs-square/6.jpg', keywords: ['funny', 'men'] }, //Lazy men
    { id: 7, url: 'imgs/meme-imgs-square/7.jpg', keywords: ['funny', 'baby'] }, //Suprised kid
    { id: 8, url: 'imgs/meme-imgs-square/8.jpg', keywords: ['funny', 'men'] }, //Lazy men
    { id: 9, url: 'imgs/meme-imgs-square/9.jpg', keywords: ['cute', 'baby'] }, //Kid laugh
    { id: 10, url: 'imgs/meme-imgs-square/10.jpg', keywords: ['funny', 'men'] },//Obama laugh
    { id: 11, url: 'imgs/meme-imgs-square/11.jpg', keywords: ['funny', 'cute'] },//Boys fight
    { id: 12, url: 'imgs/meme-imgs-square/12.jpg', keywords: ['funny', 'men'] },//Yasat Tsadik
    { id: 13, url: 'imgs/meme-imgs-square/13.jpg', keywords: ['funny', 'men'] },//Cheers
    { id: 14, url: 'imgs/meme-imgs-square/14.jpg', keywords: ['funny', 'men'] },//Tough guy
    { id: 15, url: 'imgs/meme-imgs-square/15.jpg', keywords: ['funny', 'men'] },//Your little
    { id: 16, url: 'imgs/meme-imgs-square/16.jpg', keywords: ['funny', 'men'] },//Cant believe
    { id: 17, url: 'imgs/meme-imgs-square/17.jpg', keywords: ['funny', 'men'] },//Putin
    { id: 18, url: 'imgs/meme-imgs-square/18.jpg', keywords: ['funny', 'cute'] },//
]

_createMemesGallery()

function getImagesToDisplay() {
    if (gFilterBy) {
        const imgs = gImgs.filter(book => book.keywords.some(isInclude))
        return imgs
    }
    return gImgs
}

function isInclude(key) {
    // if (gFilterBy.includes(key)) return true
    if (key === gFilterBy) return true
}

function getMemes() {
    return gMemes
}

function _createMemesGallery() {
    var memes = loadFromStorage(STORAGE_KEY)
    // Nothing in storage - generate demo memes
    if (!memes || !memes.length) {
        memes = []
        for (let i = 0; i < 3; i++) {
            memes.push(getRandomMe())
        }
    }
    gMemes = memes
    for (let i = 0; i < gMemes.length; i++) {
        onLoadImgData(i)
    }
}

function onLoadImgData(memeIdx) {
    var img = new Image()
    img.src = `imgs/meme-imgs-square/${gMemes[memeIdx].selectedImgIdx}.jpg`
    img.onload = () => {
        // DRAW IMAGE
        const base64Canvas = document.createElement("canvas")
        base64Canvas.width = img.width
        base64Canvas.height = img.height
        const base64Ctx = base64Canvas.getContext("2d")
        base64Ctx.drawImage(img, 0, 0)
        // DRAW LINES
        restartLines()
        gMemes[memeIdx].lines.forEach(line => {
            base64Ctx.beginPath()
            base64Ctx.textBaseline = 'middle';
            base64Ctx.textAlign = `${line.align}`;
            base64Ctx.lineWidth = 1;
            base64Ctx.font = `lighter ${line.size}px ${gFontFamily}`;
            base64Ctx.fillStyle = `${line.color}`;
            if (isFirstLine) {
                base64Ctx.fillText(`${line.txt}`, base64Canvas.width / 2, base64Canvas.height / 10)
                isFirstLine = false
                isSecondLine = true
            } else if (isSecondLine) {
                base64Ctx.fillText(`${line.txt}`, base64Canvas.width / 2, base64Canvas.height - 60)
                isSecondLine = false
            } else if (!isFirstLine && !isSecondLine) {
                base64Ctx.fillText(`${line.txt}`, base64Canvas.width / 2, base64Canvas.height / 2)
            }
            base64Ctx.closePath()
        })
        gMemes[memeIdx].imgData = base64Canvas.toDataURL("image/png").replace(/^data:image\/(png|jpg);base64,/, "")
        if (memeIdx === gMemes.length-1) _saveMemesToStorage()
    }
}

function setImagesFilter(filterBy) {
    gKeywordSearchCountMap[filterBy]++
    gFilterBy = filterBy
}

function saveToMemesGallery(memeIdx) {
    onLoadImgData(memeIdx)
    setTimeout(() => {
        gMemes.push(gCurrMeme)
        _saveMemesToStorage()
    }, 1000)
}

function _saveMemesToStorage() {
    saveToStorage(STORAGE_KEY, gMemes)
}