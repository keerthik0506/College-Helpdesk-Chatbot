from flask import Flask, render_template, request, jsonify
from chat_model import chatbot_response

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/get", methods=["POST"])
def get_response():
    user_msg = request.json.get("msg", "")
    bot_reply = chatbot_response(user_msg)
    return jsonify({"response": bot_reply})

if __name__ == "__main__":
    print("🚀 College Chatbot starting on http://127.0.0.1:5000")
    app.run(debug=True, port=5000)
