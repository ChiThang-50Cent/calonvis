from flask import Flask
from flask import render_template

app = Flask(__name__, template_folder='./src')
app.config['TEMPLATES_AUTO_RELOAD'] = True

@app.route("/")
def draw_main():
    return render_template('draw_container.html')

if __name__ == "__main__":
    app.run(debug=True, )