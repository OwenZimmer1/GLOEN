import torch

model_path = "models/best.pt"  # Update the path if needed
model = torch.load(model_path, map_location="cpu", weights_only=False)  # ✅ Forces full deserialization

# Print general information about the model
print("Model Type:", type(model).__name__)
print("Keys in Model:", model.keys())

# Check if class names exist
if "names" in model:
    print("Class Names:", model["names"])
elif "model" in model and hasattr(model["model"], "names"):
    print("Class Names:", model["model"].names)

# Print model architecture (optional, may be large)
if "model" in model:
    print("Model Structure:", model["model"])
