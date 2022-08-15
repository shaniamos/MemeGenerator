'use strict'

var gElEditor = document.querySelector('.editor')
var gElGallery = document.querySelector('.gallery')

function init() {
    initGallery('imgs')
}

function showEditorContainer() {
    gElEditor.classList.remove('none')
    gElGallery.classList.add('none')
}

function showGalleryContainer() {
    gElEditor.classList.add('none')
    gElGallery.classList.remove('none')
    document.querySelector('.gallery-header .filter').classList.remove('none')
    document.querySelector('.gallery-header .search').classList.remove('none')
}

function toggleMenu() {
    document.body.classList.toggle('menu-opened')
    document.querySelector('.main-menu-list').classList.toggle('space-between')
}
