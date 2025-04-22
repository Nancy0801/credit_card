import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Transaction } from "../models/transaction.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createTransaction = asyncHandler(async(req , res) => {
    const { cardNumber , expiryDate , cvv , amount , location } = req.body;
    if(
        [cardNumber, expiryDate, cvv, amount, location].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required");
    }

    const userId = req.user?._id;
    if(!userId){
        throw new ApiError(401, "User not found");
    }
    const transaction = await Transaction.create({
        user: userId,
        cardNumber,
        expiryDate,
        cvv,
        amount,
        location,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            transaction,
            "Transaction recorded successfully"
        )
    );
});
