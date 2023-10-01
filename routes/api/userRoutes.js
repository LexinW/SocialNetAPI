const express = require('express');
const router = express.Router();
const User = require('../../models/User');

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET a single user by _id with populated thought and friend data
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('thoughts')
      .populate('friends');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST a new user
router.post('/', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// PUT to update a user by _id
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE to remove a user by _id
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndRemove(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // BONUS: Remove a user's associated thoughts when deleted
    await Thought.deleteMany({ username: deletedUser.username });

    res.json({ message: 'User and associated thoughts removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST to add a new friend to a user's friend list
router.post('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friend = await User.findById(req.params.friendId);
    
    if (!user || !friend) {
      return res.status(404).json({ message: 'User or friend not found' });
    }

    // Check if the friend is already in the user's friend list
    if (user.friends.includes(friend._id)) {
      return res.status(400).json({ message: 'Friend already added' });
    }

    // Add the friend to the user's friend list
    user.friends.push(friend._id);
    await user.save();

    res.json({ message: 'Friend added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE to remove a friend from a user's friend list
router.delete('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friend = await User.findById(req.params.friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: 'User or friend not found' });
    }

    // Check if the friend is in the user's friend list
    if (!user.friends.includes(friend._id)) {
      return res.status(400).json({ message: 'Friend not found in the user\'s friend list' });
    }

    // Remove the friend from the user's friend list
    user.friends = user.friends.filter(f => f.toString() !== friend._id.toString());
    await user.save();

    res.json({ message: 'Friend removed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;