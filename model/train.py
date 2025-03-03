#train.py
import os
import shutil
from ultralytics import YOLO

def main():
    # Set the base directory for your dataset on Google Drive.
    base_dir = "/content/drive/MyDrive/datahack"
    base_dir = base_dir.replace("\\", "/")

    # Define paths for training and validation splits.
    train_folder = os.path.join(base_dir, "train")
    val_folder = os.path.join(base_dir, "val")

    # Create a YAML configuration for training.
    # In this case, there are 7 classes (six violation classes plus "no violation").
    data_yaml_content = (
        f"train: {train_folder}\n"
        f"val: {val_folder}\n"
        f"nc: 7\n"
        f"names: [\"ANSI A13-1\", \"ANSI Z358-1\", \"OSHA 1910-157(c)(1)\", "
        f"\"OSHA 1910-303(e)(1)\", \"OSHA 1910-303(g)(1)\", \"OSHA 1910-37(a)(3)\", \"no violation\"]\n"
    )

    # Save the YAML file in the base directory.
    yaml_path = os.path.join(base_dir, "data.yaml")
    with open(yaml_path, "w", encoding="utf-8") as f:
        f.write(data_yaml_content)
    print("Created data.yaml for training:")
    print(data_yaml_content)

    # Load the YOLO model for training.
    # Ensure that the pretrained model file "yolov8n-cls.pt" is available in the working directory.
    model_path = "/content/yolov8n-cls.pt"
    if not os.path.isfile(model_path):
        print(f"Model file not found at {model_path}. Please upload it to the working directory.")
        return

    model_cls = YOLO(model_path)

    # Train the model using the generated YAML configuration.
    # Adjust epochs and image size (imgsz) as desired.
    model_cls.train(data="/content/drive/MyDrive/datahack", epochs=25, imgsz=640, dropout=0.2)

    print("Training complete.")

    # Define the output directory from training.
    # (Change "train3" to match the actual run folder from your training session.)
    output_dir = "runs/classify/train"

    # Define the destination directory on Google Drive.
    dst_dir = "/content/drive/MyDrive"
    os.makedirs(dst_dir, exist_ok=True)

    # Set the destination output folder.
    dst_output_dir = os.path.join(dst_dir, os.path.basename(output_dir))

    # If the destination folder already exists, remove it first.
    if os.path.exists(dst_output_dir):
        shutil.rmtree(dst_output_dir)

    # Copy the entire output folder recursively to Google Drive.
    shutil.copytree(output_dir, dst_output_dir)
    print(f"Model output folder copied to: {dst_output_dir}")

if __name__ == "__main__":
    main()