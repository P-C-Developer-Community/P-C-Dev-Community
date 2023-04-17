const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const projectSchema = new Schema ({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    // owner: String,
    owner: {  type: Schema.Types.ObjectId, ref: `User` },
    typeOfContribution: {
        type: String, 
        enum: ['time', 'financial']
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    imageUrl: String,
    languages: [String],

});

module.exports = model("Project", projectSchema);