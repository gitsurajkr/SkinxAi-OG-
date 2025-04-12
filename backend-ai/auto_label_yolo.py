import os
from ultralytics import YOLO

# ✅ Load your trained model
model = YOLO("yolov8/skinx-train/weights/best.pt")

# Dataset root
data_root = "backend-ai/dataset"
output_root = "yolov8/auto-labels"

splits = ["train", "test", "valid"]

for split in splits:
    image_dir = os.path.join(data_root, split, "images")
    output_dir = os.path.join(output_root, split)
    
    print(f"\n🔍 Predicting on: {split.upper()} set")

    model.predict(
        source=image_dir,
        save_txt=True,
        save_conf=True,
        save=True,            # Optional: saves images with boxes
        project=output_root,
        name=split,
        exist_ok=True
    )

print("\n✅ Done! All auto-labels saved in yolov8/auto-labels/")
