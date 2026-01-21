import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NoteForm from './NoteForm';

const API_URL = 'http://localhost:5000/api';

const CultureDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [culture, setCulture] = useState(null);
    const [notes, setNotes] = useState([]);
    const [showNoteForm, setShowNoteForm] = useState(false);

    useEffect(() => {
        fetchCulture();
        fetchNotes();
    }, [id]);

    const fetchCulture = async () => {
        try {
            const response = await axios.get(`${API_URL}/cultures`);
            const foundCulture = response.data.find(c => c.id === id);
            setCulture(foundCulture);
        } catch (error) {
            console.error('Error fetching culture:', error);
        }
    };

    const fetchNotes = async () => {
        try {
            const response = await axios.get(`${API_URL}/cultures/${id}/notes`);
            setNotes(response.data);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    const handleAddNote = async (noteData) => {
        try {
            await axios.post(`${API_URL}/notes`, {
                ...noteData,
                cultureId: id,
                cultureName: culture?.name
            });
            fetchNotes();
            setShowNoteForm(false);
        } catch (error) {
            console.error('Error adding note:', error);
        }
    };

    const handleAddHarvest = async (harvestData) => {
        try {
            await axios.post(`${API_URL}/harvests`, {
                ...harvestData,
                cultureId: id,
                cultureName: culture?.name
            });
            
            // Также добавляем как заметку
            await axios.post(`${API_URL}/notes`, {
                type: 'harvest',
                title: 'Сбор урожая',
                content: `Собран урожай: ${harvestData.count} шт.`,
                date: harvestData.date,
                cultureId: id,
                cultureName: culture?.name,
                count: harvestData.count
            });
            
            fetchNotes();
            setShowNoteForm(false);
        } catch (error) {
            console.error('Error adding harvest:', error);
        }
    };

    const handleDeleteNote = async (noteId) => {
        if (window.confirm('Вы уверены, что хотите удалить эту заметку?')) {
            try {
                await axios.delete(`${API_URL}/notes/${noteId}`);
                fetchNotes();
            } catch (error) {
                console.error('Error deleting note:', error);
            }
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    if (!culture) {
        return <div>Загрузка...</div>;
    }

    return (
        <div>
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>{culture.name}</h2>
                    <button className="btn btn-secondary" onClick={() => navigate('/')}>
                        ← Назад к списку
                    </button>
                </div>
                
                <div style={{ marginTop: '20px' }}>
                    <p><strong>Дата посадки:</strong> {formatDate(culture.plantingDate)}</p>
                    <p><strong>Название семян:</strong> {culture.seedName}</p>
                    <p><strong>Количество кустов:</strong> {culture.plantCount}</p>
                </div>
            </div>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3>История и заметки</h3>
                    <button 
                        className="btn btn-primary"
                        onClick={() => setShowNoteForm(!showNoteForm)}
                    >
                        {showNoteForm ? 'Отмена' : '+ Добавить заметку'}
                    </button>
                </div>

                {showNoteForm && (
                    <NoteForm 
                        onAddNote={handleAddNote}
                        onAddHarvest={handleAddHarvest}
                        cultureName={culture.name}
                    />
                )}

                <div className="notes-list">
                    {notes.map(note => (
                        <div 
                            key={note.id} 
                            className={`note-item ${note.type === 'harvest' ? 'harvest' : ''}`}
                        >
                            <div className="note-date">
                                {formatDate(note.date || note.createdAt)}
                                {note.type === 'harvest' && ' 🎯 Сбор урожая'}
                                <button 
                                    className="btn btn-danger" 
                                    style={{ float: 'right', padding: '2px 8px', fontSize: '12px' }}
                                    onClick={() => handleDeleteNote(note.id)}
                                >
                                    Удалить
                                </button>
                            </div>
                            <div className="note-content">
                                {note.type === 'harvest' ? (
                                    <div>
                                        <strong>Собран урожай:</strong> {note.count} шт.
                                        {note.content && <div>{note.content}</div>}
                                    </div>
                                ) : (
                                    <div>
                                        {note.title && <strong>{note.title}: </strong>}
                                        {note.content}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CultureDetail;