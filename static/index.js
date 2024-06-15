import Canvas from './component/canvas.js'

const canvas = new Canvas('drawingCanvas')

const clearBoard = document.querySelector('#clearButton')
clearBoard.addEventListener("click", canvas.clearCanvas)