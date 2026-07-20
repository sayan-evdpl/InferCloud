import mongoose from "mongoose";

const gpuSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    arch: { type: String, required: true },
    vram: { type: String, required: true },
    vramGb: { type: Number, required: true },
    bandwidth: { type: String, required: true },
    bandwidthTbps: { type: Number, required: true },
    tgp: { type: String, required: true },
    tgpWatts: { type: Number, required: true },
    price: { type: String, required: true },
    priceMin: { type: Number, required: true },
    gpuClass: { type: String, required: true },
    category: { type: String, default: "local", enum: ["local"] },
    features: {
      nvlink: { type: Boolean, default: false },
      ecc: { type: Boolean, default: false },
      memoryType: { type: String },
    },
  },
  { timestamps: true }
);

gpuSchema.index({ name: "text", arch: "text", gpuClass: "text" });

export const Gpu = mongoose.model("Gpu", gpuSchema);
