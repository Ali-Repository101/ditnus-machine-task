const express = require('express');
const router = express.Router();
const Person = require('../models/Person');

// Create person
router.post('/', async (req, res) => {
  try {
    const { name, parent } = req.body;
    const person = new Person({ name, parent: parent || null });
    await person.save();
    res.json({ msg: 'Person added successfully', person });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});


// Get list tree
router.get('/tree', async (req, res) => {
  try {
    const persons = await Person.find().lean();

    const map = {};
    persons.forEach(p => { p.children = []; map[p._id] = p; });

    const roots = [];
    persons.forEach(p => {
      if (p.parent) {
        const parent = map[p.parent.toString()];
        if (parent) parent.children.push(p);
      } else {
        roots.push(p);
      }
    });

    res.json(roots);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
