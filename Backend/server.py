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

# ✅ Class ID to Regulation Name Mapping
violation_map = {
    0: "ANSI A13-1",
    1: "ANSI Z358-1",
    2: "OSHA 1910-157(c)(1)",
    3: "OSHA 1910-303(e)(1)",
    4: "OSHA 1910-303(g)(1)",
    5: "OSHA 1910-37(a)(3)",
    6: "No Violation"
}

@app.route("/process-image", methods=["POST"])
def process_image():
    try:
        # ✅ Get the image from the request
        file = request.files.get("image")
        if not file:
            return jsonify({"status": "error", "message": "No image uploaded"}), 400

        # ✅ Convert image to NumPy array and decode
        image_np = np.frombuffer(file.read(), np.uint8)
        image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)
        if image is None:
            return jsonify({"status": "error", "message": "Invalid image format"}), 400

        # ✅ Resize image to match YOLO input
        image_resized = cv2.resize(image, (640, 640))

        # ✅ Run the image through the YOLO model
        results = model(image_resized)

        # ✅ Extract detected violations
        threshold = 0.3  # Confidence threshold for valid violations
        violations = []

        for result in results:
            probs = result.probs.data.tolist()  # YOLOv8 Classification Outputs
            
            for i, prob in enumerate(probs):
                if prob >= threshold:  # Only include labels with confidence above threshold
                    violations.append({
                        "class_id": i,
                        "class_name": violation_map.get(i, "Unknown"),  # Convert to readable label
                        "confidence": round(prob, 2)
                    })

        # ✅ If no violations detected, return "No Violation"
        if not violations:
            violations.append({
                "class_id": 6,
                "class_name": "No Violation",
                "confidence": 1.0  # Default to 100% confidence for no violation
            })

        # ✅ Return the processed violation data
        return jsonify({"status": "success", "violations": violations})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
