class Line {
    constructor() { 
        this.coords = []
    }

    add (x, y) {
        this.coords.push([x, y])
    }

    get getCoords() {
        return this.coords
    }
}

export default Line