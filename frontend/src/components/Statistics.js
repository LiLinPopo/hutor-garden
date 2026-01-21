import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const Statistics = () => {
    const [harvests, setHarvests] = useState([]);
    const [cultures, setCultures] = useState([]);

    useEffect(() => {
        fetchHarvests();
        fetchCultures();
    }, []);

    const fetchHarvests = async () => {
        try {
            const response = await axios.get(`${API_URL}/harvests`);
            setHarvests(response.data);
        } catch (error) {
            console.error('Error fetching harvests:', error);
        }
    };

    const fetchCultures = async () => {
        try {
            const response = await axios.get(`${API_URL}/cultures`);
            setCultures(response.data);
        } catch (error) {
            console.error('Error fetching cultures:', error);
        }
    };

    // Подготовка данных для графика
    const prepareChartData = () => {
        const cultureMap = {};
        
        harvests.forEach(harvest => {
            if (!cultureMap[harvest.cultureName]) {
                cultureMap[harvest.cultureName] = {
                    name: harvest.cultureName,
                    harvest: 0,
                    plantCount: 0
                };
            }
            cultureMap[harvest.cultureName].harvest += parseInt(harvest.count) || 0;
        });

        // Добавляем информацию о количестве посаженных растений
        cultures.forEach(culture => {
            if (cultureMap[culture.name]) {
                cultureMap[culture.name].plantCount = parseInt(culture.plantCount) || 0;
            }
        });

        return Object.values(cultureMap);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    const chartData = prepareChartData();

    return (
        <div>
            <div className="card">
                <h2>Статистика сбора урожая</h2>
                
                {harvests.length === 0 ? (
                    <p>Нет данных о сборе урожая</p>
                ) : (
                    <>
                        <div className="chart-container">
                            <h3>Сбор урожая по культурам</h3>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="harvest" name="Собранный урожай (шт.)" fill="#2e7d32" />
                                    <Bar dataKey="plantCount" name="Посажено растений (шт.)" fill="#757575" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div style={{ marginTop: '30px' }}>
                            <h3>Детализация сборов урожая</h3>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Культура</th>
                                        <th>Дата сбора</th>
                                        <th>Количество</th>
                                        <th>Примечания</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {harvests.map(harvest => (
                                        <tr key={harvest.id}>
                                            <td>{harvest.cultureName}</td>
                                            <td>{formatDate(harvest.date)}</td>
                                            <td>{harvest.count} шт.</td>
                                            <td>{harvest.notes || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Statistics;