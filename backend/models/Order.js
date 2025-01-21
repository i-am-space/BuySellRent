const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true }],
  totalAmount: { type: Number, required: true },
  otp: { type: String, required: true },
  rawOtp: { type: String, select: false },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
