#test.py
import os
import torch
from ultralytics import YOLO

# Base code descriptions for each regulatory standard.
base_code_descriptions = {
    "ANSI A13-1": "This standard defines requirements for marking and identifying piping systems using color codes and labels.",
    "ANSI Z358-1": "This standard specifies requirements for emergency eyewash and shower equipment to ensure rapid decontamination.",
    "OSHA 1910-157(c)(1)": "The employer shall provide portable fire extinguishers and shall mount, locate and identify them so that they are readily accessible to employees without subjecting the employees to possible injury.",
    "OSHA 1910-303(e)(1)": "The manufacturer's name, trademark, or other descriptive marking by which the organization responsible for the product may be identified; and Other markings giving voltage, current, wattage, or other ratings as necessary.",
    "OSHA 1910-303(g)(1)": "Space About Electric Equipment. Sufficient access and working space shall be provided and maintained about all electric equipment to permit ready and safe operation and maintenance of such equipment.",
    "OSHA 1910-37(a)(3)": "Exit routes must be free and unobstructed. No materials or equipment may be placed, either permanently or temporarily, within the exit route. The exit access must not go through a room that can be locked, such as a bathroom, to reach an exit or exit discharge, nor may it lead into a dead-end corridor. Stairs or a ramp must be provided where the exit route is not substantially level."
}

def classify_and_caption(image_path, base_code_descriptions, device, model_path, confidence_threshold=0.5, top_k=5):
    """
    Loads the YOLO model from model_path, runs prediction on image_path, and returns a list of prediction dictionaries.

    Each prediction dictionary includes:
      - "class": the predicted class name,
      - "prediction": a string (e.g., "Violation - OSHA 1910-303(e)(1)" or "No Violation - no violation"),
      - "probability": the probability for that prediction,
      - "caption": an explanation from base_code_descriptions (or "No violation detected." for no violation).

    If the top prediction's confidence is ≥ 0.99, only that prediction is returned; otherwise, the function returns
    the top K predictions that have nonzero probability.
    """
    if not os.path.isfile(model_path):
        print(f"Model file not found at {model_path}.")
        return None

    # Load the model.
    model_cls = YOLO(model_path)
    results = model_cls.predict(source=image_path, verbose=False)
    result = results[0].cpu()

    # Get the full probability vector as a list.
    # (The 'probs' attribute already provides methods to access top1, etc. Here we extract the raw probabilities.)
    probs = result.probs.data.cpu().numpy().flatten().tolist()

    # Sort predictions by probability (descending).
    sorted_preds = sorted(enumerate(probs), key=lambda x: x[1], reverse=True)

    # If the top prediction is nearly certain, return only that one.
    if sorted_preds[0][1] >= 0.99:
        selected_preds = sorted_preds[:1]
    else:
        # Otherwise, select the top K predictions with nonzero probability.
        nonzero_preds = [p for p in sorted_preds if p[1] > 0]
        selected_preds = nonzero_preds[:top_k]

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

    predictions_list = []
    for idx, prob in selected_preds:
        # Ensure the index is valid.
        if idx < 0 or idx >= len(class_names):
            idx = 0
        predicted_class = class_names[idx]
        if predicted_class == "no violation":
            pred_str = f"No Violation - {predicted_class}"
            caption = "No violation detected."
        else:
            pred_str = f"Violation - {predicted_class}"
            caption = base_code_descriptions.get(predicted_class, "No description available.")
        predictions_list.append({
            "class": predicted_class,
            "prediction": pred_str,
            "probability": prob,
            "caption": caption
        })

    return predictions_list

def main():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    # Define the test folder path.
    test_folder = r"/content/drive/MyDrive/datahack/test/"
    test_folder = test_folder.replace("\\", "/")
    valid_extensions = (".jpg", ".jpeg", ".png", ".bmp")

    # Model path (update to your model location on Drive).
    model_path = r"/content/drive/MyDrive/train5/weights/best.pt"#/content/drive/MyDrive/train8/weights/best.pt
    model_path = model_path.replace("\\", "/")

    total = 0
    correct = 0

    for root, _, files in os.walk(test_folder):
        # Ground truth is assumed to be the name of the immediate parent folder, in lowercase.
        ground_truth = os.path.basename(root).strip().lower()
        for file in files:
            if file.lower().endswith(valid_extensions):
                image_path = os.path.join(root, file).replace("\\", "/")
                predictions = classify_and_caption(image_path, base_code_descriptions, device, model_path)
                if predictions is None or len(predictions) == 0:
                    continue

                # Overall prediction is the top prediction from the sorted list.
                overall_pred = predictions[0]

                # Check if any of the top predictions match the ground truth.
                is_in_top = any(pred["class"].lower() == ground_truth for pred in predictions)
                overall_symbol = "✓" if overall_pred["class"].lower() == ground_truth else ("✓" if is_in_top else "X")

                # Print formatted output.
                print(f"Image: {file}")
                print(f"Overall Prediction: {overall_pred['prediction']} (Confidence: {overall_pred['probability']*100:.2f}%) {overall_symbol}")
                print("Top Predictions:")
                for pred in predictions:
                    checkmark = "✓" if pred["class"].lower() == ground_truth else "X"
                    print(f"   {pred['prediction']} (Confidence: {pred['probability']*100:.2f}%) {checkmark}")
                # Use the caption from the prediction that matches the ground truth if available; otherwise, use the overall prediction's caption.
                caption = next((pred["caption"] for pred in predictions if pred["class"].lower() == ground_truth), overall_pred["caption"])
                print(f"Caption: {caption}")
                print("-" * 50)

                total += 1
                if is_in_top:
                    correct += 1

    if total > 0:
        accuracy = 100 * correct / total
        print(f"\nTest Accuracy: {accuracy:.2f}% ({correct} out of {total} images)")
    else:
        print("No test images found for evaluation.")

if __name__ == "__main__":
    main()