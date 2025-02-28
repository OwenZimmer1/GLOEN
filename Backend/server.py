from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from ultralytics import YOLO

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# ✅ Load the YOLOv8 model
MODEL_PATH = "models/best.pt"
model = YOLO(MODEL_PATH)

# ✅ Define class names (ensure these match your trained model)
class_names = [
    "ANSI A13-1",
    "ANSI Z358-1",
    "OSHA 1910-157(c)(1)",
    "OSHA 1910-303(e)(1)",
    "OSHA 1910-303(g)(1)",
    "OSHA 1910-37(a)(3)",
    "No Violation"  # Last index (6)
]

@app.route("/process-image", methods=["POST"])
def process_image():
    try:
        # Get uploaded image
        file = request.files.get("image")
        if not file:
            return jsonify({"status": "error", "message": "No image uploaded"}), 400

        # Convert image to NumPy array and decode
        image_np = np.frombuffer(file.read(), np.uint8)
        image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)
        if image is None:
            return jsonify({"status": "error", "message": "Invalid image format"}), 400

        # Resize image
        image_resized = cv2.resize(image, (640, 640))

        # ✅ Run YOLO model with proper prediction
        results = model.predict(source=image_resized, verbose=False)
        result = results[0].cpu()

        # ✅ Extract multi-label classification probabilities
        probs = result.probs.data.cpu().numpy().flatten().tolist()

        # ✅ Debugging: Print raw probabilities
        print("\n📢 Model Probabilities:", probs)

        # ✅ Select ALL violations above confidence threshold
        confidence_threshold = 0.14  # Lowered to detect more violations
        violations_detected = [
            {
                "class_id": i,
                "class_name": class_names[i],
                "confidence": round(prob, 2)  # Only round, no extra multiplication
            }
            for i, prob in enumerate(probs[:-1]) if prob > confidence_threshold  # Exclude "No Violation"
        ]

        # ✅ Only return "No Violation" if its confidence is above 50%
        no_violation_confidence = round(probs[6], 2)
        if not violations_detected and no_violation_confidence > 0.5:
            violations_detected = [{
                "class_id": 6,  # "No Violation" is index 6
                "class_name": "No Violation",
                "confidence": no_violation_confidence
            }]

        # ✅ Sort violations by confidence (highest first)
        violations_detected.sort(key=lambda x: x["confidence"], reverse=True)

        print("✅ Final Predictions:", violations_detected)

        return jsonify({"status": "success", "violations": violations_detected})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)