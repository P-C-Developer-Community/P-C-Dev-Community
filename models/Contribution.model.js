const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const contributionSchema = new Schema ({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    owner: {  type: Schema.Types.ObjectId, ref: `User` },
    
    createdAt: {
        type: Date,
        default: Date.now,
    },
    imageUrl: String,
    languages: [String],

});

module.exports = model("Contribution", contributionSchema);
