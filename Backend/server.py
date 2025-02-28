from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from ultralytics import YOLO
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Base code descriptions for each regulatory standard.
base_code_descriptions = {
    "ANSI A13-1": "This standard defines requirements for marking and identifying piping systems using color codes and labels.",
    "ANSI Z358-1": "This standard specifies requirements for emergency eyewash and shower equipment to ensure rapid decontamination.",
    "OSHA 1910-157(c)(1)": "Portable fire extinguishers must be provided, properly mounted, and clearly identified for quick access.",
    "OSHA 1910-303(e)(1)": "Electrical equipment must be marked with the manufacturer's identification and rating information.",
    "OSHA 1910-303(g)(1)": "Adequate working space must be maintained around electrical equipment for safe operation and maintenance.",
    "OSHA 1910-37(a)(3)": "Employers must provide machine guarding for fixed machinery to protect workers from moving parts.",
    "No Violation": "No violation detected."
}

# Define the class names in the order used during training.
class_names = [
    "ANSI A13-1",
    "ANSI Z358-1",
    "OSHA 1910-157(c)(1)",
    "OSHA 1910-303(e)(1)",
    "OSHA 1910-303(g)(1)",
    "OSHA 1910-37(a)(3)",
    "No Violation"
]

# Set the model path (update if necessary)
MODEL_PATH = os.path.join("public", "model", "best.pt")
if not os.path.isfile(MODEL_PATH):
    print(f"Model file not found at {MODEL_PATH}")
    # You might want to exit or use a fallback model.
    
# Load the YOLO model.
model = YOLO(MODEL_PATH)

@app.route("/process-image", methods=["POST"])
def process_image():
    try:
        # Get the uploaded image from the request.
        file = request.files.get("image")
        if not file:
            return jsonify({"status": "error", "message": "No image uploaded"}), 400

        # Read the image file and decode it.
        image_np = np.frombuffer(file.read(), np.uint8)
        image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)
        if image is None:
            return jsonify({"status": "error", "message": "Invalid image format"}), 400

        # Resize the image to the model’s expected dimensions (640x640).
        image_resized = cv2.resize(image, (640, 640))

        # Run prediction using the YOLO model.
        results = model.predict(source=image_resized, verbose=False)
        result = results[0].cpu()

        # Extract the probability vector (as a list) from the result.
        probs = result.probs.data.cpu().numpy().flatten().tolist()

        # Sort predictions by probability (descending).
        sorted_preds = sorted(enumerate(probs), key=lambda x: x[1], reverse=True)

        # If the top prediction is nearly certain, return only that; otherwise return up to the top 3.
        threshold_conf = 0.99
        if sorted_preds[0][1] >= threshold_conf:
            selected_preds = sorted_preds[:1]
        else:
            # Select the top 3 predictions with nonzero probability.
            nonzero_preds = [p for p in sorted_preds if p[1] > 0]
            selected_preds = nonzero_preds[:3]

        # Set a confidence threshold; if a prediction is below this, override to "No Violation".
        confidence_threshold = 0.5

        predictions = []
        for idx, prob in selected_preds:
            if prob < confidence_threshold:
                predicted_class = "No Violation"
                pred_str = "No Violation - No Violation"
                caption = base_code_descriptions.get("No Violation")
            else:
                # Ensure valid index.
                if idx < 0 or idx >= len(class_names):
                    idx = 0
                predicted_class = class_names[idx]
                if predicted_class == "No Violation":
                    pred_str = f"No Violation - {predicted_class}"
                    caption = base_code_descriptions.get("No Violation")
                else:
                    pred_str = f"Violation - {predicted_class}"
                    caption = base_code_descriptions.get(predicted_class, "No description available.")
            predictions.append({
                "class": predicted_class,
                "prediction": pred_str,
                "probability": prob,
                "caption": caption
            })

        # Return the predictions.
        return jsonify({"status": "success", "predictions": predictions})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
