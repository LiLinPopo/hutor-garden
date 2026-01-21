import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const Cultures = () => {
    const [cultures, setCultures] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingCulture, setEditingCulture] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        plantingDate: '',
        seedName: '',
        plantCount: ''
    });

    useEffect(() => {
        fetchCultures();
    }, []);

    const fetchCultures = async () => {
        try {
            const response = await axios.get(`${API_URL}/cultures`);
            setCultures(response.data);
        } catch (error) {
            console.error('Error fetching cultures:', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCulture) {
                await axios.put(`${API_URL}/cultures/${editingCulture.id}`, formData);
            } else {
                await axios.post(`${API_URL}/cultures`, formData);
            }
            setShowForm(false);
            setEditingCulture(null);
            setFormData({ name: '', plantingDate: '', seedName: '', plantCount: '' });
            fetchCultures();
        } catch (error) {
            console.error('Error saving culture:', error);
        }
    };

    const handleEdit = (culture) => {
        setEditingCulture(culture);
        setFormData(culture);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить эту культуру?')) {
            try {
                await axios.delete(`${API_URL}/cultures/${id}`);
                fetchCultures();
            } catch (error) {
                console.error('Error deleting culture:', error);
            }
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    return (
        <div>
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2>Посаженные культуры</h2>
                    <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                        + Добавить культуру
                    </button>
                </div>

                {showForm && (
                    <div className="card" style={{ marginBottom: '20px' }}>
                        <h3>{editingCulture ? 'Редактировать культуру' : 'Новая культура'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Название культуры:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Например: Перец болгарский красный"
                                />
                            </div>
                            <div className="form-group">
                                <label>Дата посадки:</label>
                                <input
                                    type="date"
                                    name="plantingDate"
                                    value={formData.plantingDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Название семян:</label>
                                <input
                                    type="text"
                                    name="seedName"
                                    value={formData.seedName}
                                    onChange={handleInputChange}
                                    placeholder="Например: Семена перца сладкого"
                                />
                            </div>
                            <div className="form-group">
                                <label>Количество кустов:</label>
                                <input
                                    type="number"
                                    name="plantCount"
                                    value={formData.plantCount}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Например: 15"
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" className="btn btn-primary">
                                    {editingCulture ? 'Сохранить' : 'Добавить'}
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingCulture(null);
                                        setFormData({ name: '', plantingDate: '', seedName: '', plantCount: '' });
                                    }}
                                >
                                    Отмена
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <table className="table">
                    <thead>
                        <tr>
                            <th>Культура</th>
                            <th>Дата посадки</th>
                            <th>Название семян</th>
                            <th>Количество кустов</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cultures.map(culture => (
                            <tr key={culture.id}>
                                <td>
                                    <Link to={`/culture/${culture.id}`} style={{ color: '#2e7d32', textDecoration: 'none' }}>
                                        {culture.name}
                                    </Link>
                                </td>
                                <td>{formatDate(culture.plantingDate)}</td>
                                <td>{culture.seedName}</td>
                                <td>{culture.plantCount}</td>
                                <td className="actions">
                                    <button 
                                        className="btn btn-primary" 
                                        style={{ padding: '5px 10px', fontSize: '14px' }}
                                        onClick={() => handleEdit(culture)}
                                    >
                                        Редактировать
                                    </button>
                                    <button 
                                        className="btn btn-danger" 
                                        style={{ padding: '5px 10px', fontSize: '14px' }}
                                        onClick={() => handleDelete(culture.id)}
                                    >
                                        Удалить
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Cultures;