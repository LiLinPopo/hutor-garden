const express = require('express');
const router = express.Router();
const { cultures, notes, harvests } = require('../db');

// Генерация ID
const generateId = () => Date.now().toString();

// Культуры
router.get('/cultures', (req, res) => {
    cultures.find({}, (err, docs) => {
        if (err) res.status(500).json({ error: err });
        else res.json(docs);
    });
});

router.post('/cultures', (req, res) => {
    const culture = {
        id: generateId(),
        ...req.body,
        createdAt: new Date()
    };
    
    cultures.insert(culture, (err, newDoc) => {
        if (err) res.status(500).json({ error: err });
        else res.json(newDoc);
    });
});

router.put('/cultures/:id', (req, res) => {
    cultures.update({ id: req.params.id }, { $set: req.body }, {}, (err) => {
        if (err) res.status(500).json({ error: err });
        else res.json({ success: true });
    });
});

router.delete('/cultures/:id', (req, res) => {
    cultures.remove({ id: req.params.id }, {}, (err) => {
        if (err) res.status(500).json({ error: err });
        else {
            // Удаляем связанные заметки и сборы урожая
            notes.remove({ cultureId: req.params.id }, { multi: true });
            harvests.remove({ cultureId: req.params.id }, { multi: true });
            res.json({ success: true });
        }
    });
});

// Заметки
router.get('/cultures/:cultureId/notes', (req, res) => {
    notes.find({ cultureId: req.params.cultureId }, (err, docs) => {
        if (err) res.status(500).json({ error: err });
        else res.json(docs);
    });
});

router.post('/notes', (req, res) => {
    const note = {
        id: generateId(),
        ...req.body,
        createdAt: new Date()
    };
    
    notes.insert(note, (err, newDoc) => {
        if (err) res.status(500).json({ error: err });
        else res.json(newDoc);
    });
});

router.delete('/notes/:id', (req, res) => {
    notes.remove({ id: req.params.id }, {}, (err) => {
        if (err) res.status(500).json({ error: err });
        else res.json({ success: true });
    });
});

// Сбор урожая
router.get('/harvests', (req, res) => {
    harvests.find({}, (err, docs) => {
        if (err) res.status(500).json({ error: err });
        else res.json(docs);
    });
});

router.post('/harvests', (req, res) => {
    const harvest = {
        id: generateId(),
        ...req.body,
        createdAt: new Date()
    };
    
    harvests.insert(harvest, (err, newDoc) => {
        if (err) res.status(500).json({ error: err });
        else res.json(newDoc);
    });
});

module.exports = router;