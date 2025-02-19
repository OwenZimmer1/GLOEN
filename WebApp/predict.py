#!/usr/bin/env python
import sys
import json
import os
from ultralytics import YOLO
import numpy as np

# Base code descriptions for each regulatory standard.
base_code_descriptions = {
    "ANSI A13-1": "This standard defines requirements for marking and identifying piping systems using color codes and labels.",
    "ANSI Z358-1": "This standard specifies requirements for emergency eyewash and shower equipment to ensure rapid decontamination.",
    "OSHA 1910-157(c)(1)": "Portable fire extinguishers must be provided, properly mounted, and clearly identified for quick access.",
    "OSHA 1910-303(e)(1)": "Electrical equipment must be marked with the manufacturer's identification and rating information.",
    "OSHA 1910-303(g)(1)": "Adequate working space must be maintained around electrical equipment for safe operation and maintenance.",
    "OSHA 1910-37(a)(3)": "Employers must provide machine guarding for fixed machinery to protect workers from moving parts.",
    "no violation": "No violation detected."
}

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No image path provided"}))
        sys.exit(1)

    image_path = sys.argv[1]
    # Update model path as necessary.
    model_path = "/content/drive/MyDrive/train24/train3/weights/best.pt"
    if not os.path.isfile(model_path):
        print(json.dumps({"error": f"Model file not found at {model_path}"}))
        sys.exit(1)

    try:
        model = YOLO(model_path)
    except Exception as e:
        print(json.dumps({"error": f"Error loading model: {str(e)}"}))
        sys.exit(1)

    try:
        results = model.predict(source=image_path, verbose=False)
        result = results[0].cpu()
    except Exception as e:
        print(json.dumps({"error": f"Error during prediction: {str(e)}"}))
        sys.exit(1)

    # Get the full probability vector as a flat list.
    # (result.probs.data is a tensor; convert it to a NumPy array and then to list.)
    try:
        probs = result.probs.data.cpu().numpy().flatten().tolist()
    except Exception as e:
        print(json.dumps({"error": f"Error extracting probabilities: {str(e)}"}))
        sys.exit(1)

    # Sort predictions by probability descending.
    sorted_preds = sorted(enumerate(probs), key=lambda x: x[1], reverse=True)

    # Select predictions until cumulative probability reaches at least 0.99, up to a maximum of 4 predictions.
    cumulative = 0.0
    selected = []
    for idx, prob in sorted_preds:
        if prob <= 0:
            continue
        selected.append((idx, prob))
        cumulative += prob
        if cumulative >= 0.99 or len(selected) >= 4:
            break

    # Define the 7 class names in the order used during training.
    class_names = [
        "ANSI A13-1",
        "ANSI Z358-1",
        "OSHA 1910-157(c)(1)",
        "OSHA 1910-303(e)(1)",
        "OSHA 1910-303(g)(1)",
        "OSHA 1910-37(a)(3)",
        "no violation"
    ]

    predictions = []
    for idx, prob in selected:
        # If index is out-of-range, default to "no violation"
        if idx < 0 or idx >= len(class_names):
            idx = 0
        predicted_class = class_names[idx]
        # If probability is below threshold, override to "no violation"
        if prob < 0.5:
            predicted_class = "no violation"
        if predicted_class == "no violation":
            pred_str = f"No Violation - {predicted_class}"
            caption = base_code_descriptions.get("no violation")
        else:
            pred_str = f"Violation - {predicted_class}"
            caption = base_code_descriptions.get(predicted_class, "No description available.")
        predictions.append({
            "prediction": pred_str,
            "probability": prob,
            "caption": caption
        })

    # Output the predictions as JSON.
    output = {"predictions": predictions}
    print(json.dumps(output))

if __name__ == "__main__":
    main()
