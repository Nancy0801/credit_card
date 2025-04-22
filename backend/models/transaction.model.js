import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    cardNumber: { 
        type: String, 
        required: true 
    },
    expiryDate: { 
        type: String, 
        required: true 
    },
    cvv: { 
        type: String, 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    location: { 
        type: String, 
        required: true 
    },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
