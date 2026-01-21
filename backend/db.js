const Datastore = require('nedb');

// Инициализация базы данных
const cultures = new Datastore({ filename: './data/cultures.db', autoload: true });
const notes = new Datastore({ filename: './data/notes.db', autoload: true });
const harvests = new Datastore({ filename: './data/harvests.db', autoload: true });

// Создаем индексы
cultures.ensureIndex({ fieldName: 'id', unique: true });
notes.ensureIndex({ fieldName: 'id', unique: true });
harvests.ensureIndex({ fieldName: 'id', unique: true });

module.exports = { cultures, notes, harvests };