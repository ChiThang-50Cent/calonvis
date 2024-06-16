import Line from "./line.js";
import Cluster from "./cluster.js";

class Canvas {
    constructor (canvasNodeId) {
        this.canvas = document.getElementById(canvasNodeId);
        this.context = this.canvas.getContext('2d')
        this.isDrawing = false
        this.inactivityTimeout = null;
        this.rect = this.canvas.getBoundingClientRect();
        this.currentLine = null;
        this.cluster = null;

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
        if (!this.cluster) {
            this.cluster = new Cluster();
            this.currentLine = new Line();
        }

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

        this.currentLine.add(x, y);
    }

    stopDrawingOut () {
        this.isDrawing = false;
        this.context.beginPath();
    }

    stopDrawingUp () {
        this.stopDrawingOut()
        this.setInactivityTimeout();
        this.cluster.add(this.currentLine);
        this.currentLine = new Line();
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.clearInactivityTimeout();
    }

    async sendClusterToServer(cluster) {
        const res = await fetch('/insert_cluster', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cluster)
        })

        const data = await res.json()

        console.log(data)
    }
    
    setInactivityTimeout() {
        this.clearInactivityTimeout();
        this.inactivityTimeout = setTimeout(() => {
            this.sendClusterToServer(this.cluster.getLines)
            this.cluster = null;
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