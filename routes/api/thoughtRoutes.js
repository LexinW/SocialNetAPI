const express = require('express');
const router = express.Router();
const Thought = require('../../models/Thought');

// GET all thoughts
router.get('/', async (req, res) => {
    try {
        const thoughts = await Thought.find();
        res.json(thoughts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET a single thought by _id
router.get('/:thoughtId', async (req, res) => {
    try {
      const thought = await Thought.findById(req.params.thoughtId);
      
      if (!thought) {
        return res.status(404).json({ message: 'Thought not found' });
      }
  
      res.json(thought);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
});

// POST to create a new thought
router.post('/', async (req, res) => {
    try {
      const newThought = new Thought(req.body);
      await newThought.save();
  
      // Push the created thought's _id to the associated user's thoughts array field
      const user = await User.findById(req.body.userId);
      if (user) {
        user.thoughts.push(newThought._id);
        await user.save();
      }
  
      res.status(201).json(newThought);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
});

// PUT to update a thought by _id
router.put('/:thoughtId', async (req, res) => {
    try {
      const updatedThought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        req.body,
        { new: true }
      );
  
      if (!updatedThought) {
        return res.status(404).json({ message: 'Thought not found' });
      }
  
      res.json(updatedThought);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
});

// DELETE to remove a thought by _id
router.delete('/:thoughtId', async (req, res) => {
    try {
      const deletedThought = await Thought.findByIdAndRemove(req.params.thoughtId);
  
      if (!deletedThought) {
        return res.status(404).json({ message: 'Thought not found' });
      }
  
      res.json({ message: 'Thought removed successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
});

// POST to create a reaction in a single thought's reactions array field
router.post('/:thoughtId/reactions', async (req, res) => {
    try {
      const thought = await Thought.findById(req.params.thoughtId);
  
      if (!thought) {
        return res.status(404).json({ message: 'Thought not found' });
      }
  
      // Create a new reaction
      const newReaction = {
        reactionBody: req.body.reactionBody,
        username: req.body.username,
      };
  
      // Push the new reaction to the thought's reactions array
      thought.reactions.push(newReaction);
      await thought.save();
  
      res.status(201).json(thought);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
});

// DELETE to remove a reaction by the reaction's reactionId value
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
    try {
      const thought = await Thought.findById(req.params.thoughtId);
  
      if (!thought) {
        return res.status(404).json({ message: 'Thought not found' });
      }
  
      // Find the index of the reaction to remove
      const reactionIndex = thought.reactions.findIndex(
        (reaction) => reaction._id.toString() === req.params.reactionId
      );
  
      if (reactionIndex === -1) {
        return res.status(404).json({ message: 'Reaction not found' });
      }
  
      // Remove the reaction from the array
      thought.reactions.splice(reactionIndex, 1);
      await thought.save();
  
      res.json({ message: 'Reaction removed successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;