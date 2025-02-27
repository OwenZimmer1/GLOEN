from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from ultralytics import YOLO

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# ✅ Load the YOLOv8 model
MODEL_PATH = "models/best.pt"  # Ensure this path is correct
model = YOLO(MODEL_PATH)  # Load YOLOv8 model

@app.route("/process-image", methods=["POST"])
def process_image():
    try:
        # Get the image from the request
        file = request.files.get("image")
        if not file:
            return jsonify({"status": "error", "message": "No image uploaded"}), 400

        # Convert image to NumPy array and decode
        image_np = np.frombuffer(file.read(), np.uint8)
        image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)
        if image is None:
            return jsonify({"status": "error", "message": "Invalid image format"}), 400

        # Preprocess image (Resize to 640x640 to match YOLO input)
        image_resized = cv2.resize(image, (640, 640))

        # Run the image through the YOLO model
        results = model(image_resized)

        # Extract detected violations
        violations = []
        for result in results:
            probs = result.probs.data.tolist()  # YOLOv8 Classification Outputs
            class_id = int(np.argmax(probs))  # Get the most likely class
            confidence = round(max(probs), 2)  # Get the highest confidence score

            violations.append({
                "class_id": class_id,
                "confidence": confidence
            })

        # Return the processed violation data
        return jsonify({"status": "success", "violations": violations})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)