import React, { useState } from 'react';

const NoteForm = ({ onAddNote, onAddHarvest, cultureName }) => {
    const [noteType, setNoteType] = useState('history');
    const [noteData, setNoteData] = useState({
        type: 'history',
        title: '',
        content: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [harvestData, setHarvestData] = useState({
        type: 'harvest',
        count: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
    });

    const handleNoteSubmit = (e) => {
        e.preventDefault();
        if (noteType === 'history') {
            onAddNote(noteData);
        } else {
            onAddHarvest({
                ...harvestData,
                count: parseInt(harvestData.count)
            });
        }
    };

    const handleNoteChange = (e) => {
        setNoteData({
            ...noteData,
            [e.target.name]: e.target.value
        });
    };

    const handleHarvestChange = (e) => {
        setHarvestData({
            ...harvestData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="card" style={{ marginBottom: '20px' }}>
            <form onSubmit={handleNoteSubmit}>
                <div className="form-group">
                    <label>Тип заметки:</label>
                    <select 
                        value={noteType}
                        onChange={(e) => setNoteType(e.target.value)}
                        style={{ width: '100%', padding: '8px' }}
                    >
                        <option value="history">История/Заметка</option>
                        <option value="harvest">Сбор урожая</option>
                    </select>
                </div>

                {noteType === 'history' ? (
                    <>
                        <div className="form-group">
                            <label>Заголовок:</label>
                            <input
                                type="text"
                                name="title"
                                value={noteData.title}
                                onChange={handleNoteChange}
                                placeholder="Например: День 1. Посадка"
                            />
                        </div>
                        <div className="form-group">
                            <label>Содержание:</label>
                            <textarea
                                name="content"
                                value={noteData.content}
                                onChange={handleNoteChange}
                                rows="3"
                                placeholder="Например: Посадил в землю перец..."
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Дата:</label>
                            <input
                                type="date"
                                name="date"
                                value={noteData.date}
                                onChange={handleNoteChange}
                                required
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="form-group">
                            <label>Культура:</label>
                            <input
                                type="text"
                                value={cultureName}
                                disabled
                                style={{ backgroundColor: '#f0f0f0' }}
                            />
                        </div>
                        <div className="form-group">
                            <label>Количество собранного:</label>
                            <input
                                type="number"
                                name="count"
                                value={harvestData.count}
                                onChange={handleHarvestChange}
                                placeholder="Например: 15"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Дата сбора:</label>
                            <input
                                type="date"
                                name="date"
                                value={harvestData.date}
                                onChange={handleHarvestChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Примечания (необязательно):</label>
                            <textarea
                                name="notes"
                                value={harvestData.notes}
                                onChange={handleHarvestChange}
                                rows="2"
                                placeholder="Например: Урожай хороший, плоды крупные..."
                            />
                        </div>
                    </>
                )}

                <button type="submit" className="btn btn-primary">
                    {noteType === 'history' ? 'Добавить заметку' : 'Добавить сбор урожая'}
                </button>
            </form>
        </div>
    );
};

export default NoteForm;
