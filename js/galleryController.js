'user strict'

var gGalleryType

function initGallery(galleryType) {
    showGalleryContainer()
    gGalleryType = galleryType
    switch (gGalleryType) {
        case 'imgs':
            // renderFilters()
            renderImgsGallery()
            break;
        case 'memes':
            document.querySelector('.gallery-header .filter').classList.add('none')
            document.querySelector('.gallery-header .search').classList.add('none')
            renderMemesGallery()
        default:
            break;
    }
}

function renderImgsGallery() {
    var images = getImagesToDisplay()
    var strHTML = images.map(img =>
        `<div id="${img.id}" onclick="onImgSelect(this.id)">
        <img class="grid-item" src="imgs/meme-imgs-square/${img.id}.jpg" alt="">
        </div>
        `
    )
    document.querySelector('.gallery-wrapper').innerHTML = strHTML.join('')
}

function renderMemesGallery() {
    var memes = getMemes()

    var strHTML = memes.map((meme, memeIdx) =>
        `
        <div onclick="onMemeSelect(${memeIdx})">
            <img class="grid-item" src="data:image/png;base64, ${meme.imgData}" alt="">
        </div>
        `
    )
    document.querySelector('.gallery-wrapper').innerHTML = strHTML.join('')
}

function onSetImagesFilter(filterBy) {
    setImagesFilter(filterBy)
    renderImgsGallery()
}

function onImgSelect(imgId) {
    showEditorContainer()
    initEditor(imgId)
}

function onMemeSelect(memeIdx) {
    showEditorContainer()
    initEditorWithMeme(memeIdx)
}

function onClickRandomMeme() {
    document.querySelector('.gallery').style.display = 'none'
    document.querySelector('.editor').style.display = 'block'
}

