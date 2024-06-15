class Canvas {
    constructor (canvasNodeId) {
        this.canvas = document.getElementById(canvasNodeId);
        this.context = this.canvas.getContext('2d')
        this.isDrawing = false
        this.inactivityTimeout = null;
        this.rect = this.canvas.getBoundingClientRect();

        // Bind methods to the instance
        this.bindMethod();

        // Add event listeners
        this.addEventListener();
    }

    bindMethod() {
        this.draw = this.draw.bind(this);
        this.startDrawing = this.startDrawing.bind(this);
        this.stopDrawingOut = this.stopDrawingOut.bind(this);
        this.stopDrawingUp = this.stopDrawingUp.bind(this);
        this.clearCanvas = this.clearCanvas.bind(this)
        this.setInactivityTimeout = this.setInactivityTimeout.bind(this)
        this.clearInactivityTimeout = this.clearInactivityTimeout.bind(this)
    }

    addEventListener() {
        this.canvas.addEventListener('mousedown', this.startDrawing);
        this.canvas.addEventListener('mousemove', this.draw);
        this.canvas.addEventListener('mouseup', this.stopDrawingUp);
        this.canvas.addEventListener('mouseout', this.stopDrawingOut);
    }

    startDrawing (e) {
        this.isDrawing = true
        this.draw(e)
        this.clearInactivityTimeout();
    }

    draw (e) {
        if (!this.isDrawing) return

        this.context.lineWidth = 3;
        this.context.lineCap = 'round';
        this.context.strokeStyle = 'black';

        const x = e.clientX - this.rect.left;
        const y = e.clientY - this.rect.top;

        this.context.lineTo(x, y);
        this.context.stroke();
        this.context.beginPath();
        this.context.moveTo(x, y);
    }

    stopDrawingOut () {
        this.isDrawing = false;
        this.context.beginPath();
    }

    stopDrawingUp () {
        this.stopDrawingOut()
        this.setInactivityTimeout();
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.clearInactivityTimeout();
    }
    
    setInactivityTimeout() {
        this.clearInactivityTimeout();
        this.inactivityTimeout = setTimeout(() => {
            console.log('call api')
        }, 1000);
    }

    clearInactivityTimeout() {
        if (this.inactivityTimeout) {
            clearTimeout(this.inactivityTimeout);
            this.inactivityTimeout = null;
         }
    }
}

export default Canvas