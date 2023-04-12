const { Schema, model } = require("mongoose");
const { Schema, model } = mongoose;

const contributionSchema = new Schema ({
    name: String,
    description: String,
    creater: [{  type: Schema.Types.ObjectId, ref: `User` }],
    typeOfContribution: {
        type: String, 
        enum: ['time', 'financial']
    }

});

module.exports = model("Contribution", contributionSchema);
