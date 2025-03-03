import os
import shutil
from ultralytics import YOLO

def main():
    # Set dataset directory
    data_dir = "/content/drive/MyDrive/datahack"
    data_dir = data_dir.replace("\\", "/")

    # Ensure dataset exists
    if not os.path.exists(data_dir):
        print(f"❌ Error: Dataset directory {data_dir} not found.")
        return
    print(f"✅ Dataset found: {data_dir}")

    # Set the absolute path to the previously trained model weights
    resume_weights = "/content/drive/MyDrive/train5/weights/best.pt"
    resume_weights = resume_weights.replace("\\", "/")

    if not os.path.exists(resume_weights):
        print(f"❌ Error: best.pt not found at {resume_weights}. Cannot resume training.")
        return

    print(f"✅ Resuming training from: {resume_weights}")

    # Load the YOLO model
    model_cls = YOLO(resume_weights)

    # Train with optimized fine-tuning settings
    print("🚀 Resuming Training with Best Model & Regularization...")
    model_cls.train(
        data=data_dir,
        epochs=15,  # Train for more epochs
        imgsz=640,
        batch=16,
        patience=3,  # Allow some patience for learning
        dropout=0.6,  # Stronger dropout to prevent overfitting
        weight_decay=0.0003,  # Helps generalization
        auto_augment="randaugment",  # Stronger augmentation
        mixup=0.3,  # Mixes images for better learning
        hsv_h=0.2, hsv_s=0.7, hsv_v=0.4,  # Stronger color augmentation
        flipud=0.3,  # Random vertical flip
        fliplr=0.5,  # Horizontal flip
        scale=0.7,  # Resizing to prevent size overfitting
        translate=0.1,  # Random translations
        erasing=0.5,  # Removes random patches
        lr0=0.00005,  # Lower learning rate for stable training
        cos_lr=False,  # Keep a steady learning rate
        resume=False,  # DO NOT resume optimizer state
        project="/content/drive/MyDrive/runs/classify",  # Save training in Google Drive
        name="train6",  # Training session name
        exist_ok=True  # Overwrite if folder exists
    )

    print("✅ Resumed training complete.")

    # Define the output directory from training
    output_dir = "/content/drive/MyDrive/runs/classify/train6"

    # Define the destination directory on Google Drive
    dst_dir = "/content/drive/MyDrive"
    os.makedirs(dst_dir, exist_ok=True)

    # Set the destination output folder
    dst_output_dir = os.path.join(dst_dir, os.path.basename(output_dir))

    # If the destination folder already exists, remove it first
    if os.path.exists(dst_output_dir):
        shutil.rmtree(dst_output_dir)

    # Copy the entire output folder recursively to Google Drive
    shutil.copytree(output_dir, dst_output_dir)
    print(f"✅ Model output folder copied to: {dst_output_dir}")

if __name__ == "__main__":
    main()
