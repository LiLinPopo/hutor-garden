import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Table,
  Statistic,
  Typography,
  Select,
  DatePicker,
  Space
} from 'antd';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import axios from 'axios';
import dayjs from 'dayjs';

const API_URL = 'http://localhost:5000/api';
const { Title } = Typography;
const { RangePicker } = DatePicker;

const Statistics = () => {
    const [harvests, setHarvests] = useState([]);
    const [cultures, setCultures] = useState([]);
    const [dateRange, setDateRange] = useState(null);
    const [selectedCulture, setSelectedCulture] = useState('all');

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

    const filterData = () => {
        let filteredHarvests = [...harvests];

        // Фильтрация по культуре
        if (selectedCulture !== 'all') {
            filteredHarvests = filteredHarvests.filter(h => h.cultureId === selectedCulture);
        }

        // Фильтрация по дате
        if (dateRange && dateRange[0] && dateRange[1]) {
            const startDate = dateRange[0].startOf('day');
            const endDate = dateRange[1].endOf('day');
            filteredHarvests = filteredHarvests.filter(h => {
                const harvestDate = dayjs(h.date);
                return harvestDate >= startDate && harvestDate <= endDate;
            });
        }

        return filteredHarvests;
    };

    const prepareChartData = () => {
        const filteredHarvests = filterData();
        const cultureMap = {};
        
        filteredHarvests.forEach(harvest => {
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

    const preparePieData = () => {
        const filteredHarvests = filterData();
        const cultureMap = {};
        
        filteredHarvests.forEach(harvest => {
            if (!cultureMap[harvest.cultureName]) {
                cultureMap[harvest.cultureName] = 0;
            }
            cultureMap[harvest.cultureName] += parseInt(harvest.count) || 0;
        });

        return Object.entries(cultureMap).map(([name, value]) => ({
            name,
            value
        }));
    };

    const calculateTotalHarvest = () => {
        const filteredHarvests = filterData();
        return filteredHarvests.reduce((total, harvest) => 
            total + (parseInt(harvest.count) || 0), 0
        );
    };

    const calculateAveragePerCulture = () => {
        const filteredHarvests = filterData();
        if (filteredHarvests.length === 0) return 0;
        
        const total = calculateTotalHarvest();
        const uniqueCultures = new Set(filteredHarvests.map(h => h.cultureName)).size;
        
        return uniqueCultures > 0 ? Math.round(total / uniqueCultures) : 0;
    };

    const chartData = prepareChartData();
    const pieData = preparePieData();
    const filteredHarvests = filterData();

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    const columns = [
        {
            title: 'Культура',
            dataIndex: 'cultureName',
            key: 'cultureName',
        },
        {
            title: 'Дата сбора',
            dataIndex: 'date',
            key: 'date',
            render: (date) => dayjs(date).format('DD.MM.YYYY')
        },
        {
            title: 'Количество',
            dataIndex: 'count',
            key: 'count',
            render: (count) => <strong>{count} шт.</strong>
        },
        {
            title: 'Примечания',
            dataIndex: 'notes',
            key: 'notes',
            render: (notes) => notes || '-'
        },
    ];

    return (
        <div>
            <Title level={2}>Статистика сбора урожая</Title>
            
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Row gutter={16}>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Всего собрано"
                                value={calculateTotalHarvest()}
                                suffix="шт."
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Количество сборов"
                                value={filteredHarvests.length}
                                suffix="раз"
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Средний сбор на культуру"
                                value={calculateAveragePerCulture()}
                                suffix="шт."
                            />
                        </Card>
                    </Col>
                </Row>

                <Card title="Фильтры">
                    <Space size="large">
                        <Select
                            value={selectedCulture}
                            onChange={setSelectedCulture}
                            style={{ width: 200 }}
                        >
                            <Select.Option value="all">Все культуры</Select.Option>
                            {cultures.map(culture => (
                                <Select.Option key={culture.id} value={culture.id}>
                                    {culture.name}
                                </Select.Option>
                            ))}
                        </Select>
                        
                        <RangePicker
                            format="DD.MM.YYYY"
                            onChange={setDateRange}
                        />
                    </Space>
                </Card>

                {filteredHarvests.length > 0 ? (
                    <>
                        <Row gutter={[16, 16]}>
                            <Col span={16}>
                                <Card title="Сбор урожая по культурам">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip 
                                                formatter={(value, name) => [
                                                    value, 
                                                    name === 'harvest' ? 'Собранный урожай' : 'Посажено растений'
                                                ]}
                                            />
                                            <Legend />
                                            <Bar 
                                                dataKey="harvest" 
                                                name="Собранный урожай" 
                                                fill="#52c41a" 
                                            />
                                            <Bar 
                                                dataKey="plantCount" 
                                                name="Посажено растений" 
                                                fill="#1890ff" 
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card title="Распределение урожая">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => 
                                                    `${name}: ${(percent * 100).toFixed(0)}%`
                                                }
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell 
                                                        key={`cell-${index}`} 
                                                        fill={COLORS[index % COLORS.length]} 
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Card>
                            </Col>
                        </Row>

                        <Card title="Детализация сборов урожая">
                            <Table 
                                columns={columns} 
                                dataSource={filteredHarvests} 
                                rowKey="id"
                                pagination={{ pageSize: 5 }}
                            />
                        </Card>
                    </>
                ) : (
                    <Card>
                        <p>Нет данных о сборе урожая для выбранных фильтров</p>
                    </Card>
                )}
            </Space>
        </div>
    );
};

export default Statistics;