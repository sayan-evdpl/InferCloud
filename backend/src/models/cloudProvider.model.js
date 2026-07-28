import mongoose from "mongoose";

const cloudProviderSchema = new mongoose.Schema(
  {
    provider: { type: String, required: true, index: true },
    gpu: { type: String, required: true },
    rate: { type: String, required: true },
    rateUsdHr: { type: Number, required: true },
    billing: { type: String, required: true },
    profile: { type: String, required: true },
    tier: { type: String, enum: ["budget", "mid", "premium", "enterprise"] },
    region: { type: String, default: "Global" },
    category: { type: String, default: "cloud", enum: ["cloud"] },
  },
  { timestamps: true }
);

cloudProviderSchema.index({ provider: "text", gpu: "text", profile: "text" });

export const CloudProvider = mongoose.model("CloudProvider", cloudProviderSchema);
