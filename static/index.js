// Get the canvas element and its context
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

// Variable to track whether the mouse is being pressed
let isDrawing = false;

// Event listeners for mouse events
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    draw(e);
});

canvas.addEventListener('mousemove', draw);

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    ctx.beginPath(); // Begin a new path when drawing stops
});

canvas.addEventListener('mouseout', () => {
    isDrawing = false;
});

// Function to draw on the canvas
function draw(e) {
    if (!isDrawing) return;

    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';

    // Get the mouse position relative to the canvas
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // console.log(Math.round(x), Math.round(y))

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// Function to clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}