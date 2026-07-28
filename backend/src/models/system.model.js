import mongoose from "mongoose";

const systemSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, index: true },
    gpu: { type: String, required: true },
    specs: { type: String, required: true },
    price: { type: String, required: true },
    priceMin: { type: Number, required: true },
    limit: { type: String, required: true },
    icon: { type: String, required: true },
    formFactor: { type: String, enum: ["laptop", "workstation", "desktop"] },
    category: { type: String, default: "system", enum: ["system"] },
  },
  { timestamps: true }
);

systemSchema.index({ type: "text", gpu: "text", specs: "text" });

export const System = mongoose.model("System", systemSchema);
