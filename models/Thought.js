const mongoose = require('mongoose');
const reactionSchema = require('./reactionSchema'); // Import the Reaction schema

const thoughtSchema = new mongoose.Schema({
  thoughtText: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => {
      // Format the timestamp when retrieving it
      return new Date(timestamp).toISOString();
    },
  },
  username: {
    type: String,
    required: true,
  },
  reactions: [reactionSchema], // Array of nested documents using the Reaction schema
});

// Define the virtual field reactionCount
thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

const Thought = mongoose.model('Thought', thoughtSchema);

module.exports = Thought;