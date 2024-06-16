from flask import Flask, request
from flask import render_template

import db

app = Flask(__name__, template_folder='./src')
app.config['TEMPLATES_AUTO_RELOAD'] = True
current_canvas = None
current_cluster = set([])

@app.route("/")
def draw_main():
    return render_template('draw_container.html')

@app.route("/insert_cluster", methods=["POST"])
def insert_cluster():
    global current_cluster
    global current_canvas

    if not current_canvas:
        current_canvas = db.insert_canvas()

    data = request.json
    new_cluster = db.insert_cluster(data, current_canvas)
    if new_cluster['id'] not in current_cluster:
        current_cluster.add(new_cluster['id'])
        db.update_canvas(current_canvas, new_cluster['id'])

    return {
        "new_cluster": new_cluster,
        "canvas": current_canvas
    }

if __name__ == "__main__":
    app.run(debug=True, )