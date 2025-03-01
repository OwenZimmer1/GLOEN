// src/services/predictService.ts
export interface Prediction {
  prediction: string;
  probability: number;
  caption: string;
}

export async function getPredictions(file: File): Promise<Prediction[]> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("/api/predict", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to get predictions.");
  }
  const data = await response.json();
  return data.predictions;
}
