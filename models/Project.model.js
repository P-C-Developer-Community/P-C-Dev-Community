const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const projectSchema = new Schema ({
    name: String,
    description: String,
    owner: [{  type: Schema.Types.ObjectId, ref: `User` }],
    typeOfContribution: {
        type: String, 
        enum: ['time', 'financial']
    }

});

module.exports = model("Project", projectSchema);