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
    creater: [{  type: Schema.Types.ObjectId, ref: `User` }],
    typeOfContribution: {
        type: String, 
        enum: ['time', 'financial']
    }

});

module.exports = model("Contribution", contributionSchema);
