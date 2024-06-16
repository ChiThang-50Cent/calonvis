class Cluster {
    constructor() {
        this.lines = [];
    }

    add (line) {
        this.lines.push(line);
    }

    get getLines() {
        return this.lines.map(el => {
            return {
                'coords' : el.getCoords,
            }
        })
    }
}

export default Cluster