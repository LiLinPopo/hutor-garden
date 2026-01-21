import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Space,
  Tag,
  notification,
  Popconfirm
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const API_URL = 'http://localhost:5000/api';

const Cultures = () => {
    const [cultures, setCultures] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCulture, setEditingCulture] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchCultures();
    }, []);

    const fetchCultures = async () => {
        try {
            const response = await axios.get(`${API_URL}/cultures`);
            setCultures(response.data);
        } catch (error) {
            console.error('Error fetching cultures:', error);
            notification.error({
                message: 'Ошибка',
                description: 'Не удалось загрузить список культур'
            });
        }
    };

    const showModal = (culture = null) => {
        setEditingCulture(culture);
        if (culture) {
            form.setFieldsValue({
                ...culture,
                plantingDate: culture.plantingDate ? dayjs(culture.plantingDate) : null
            });
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingCulture(null);
        form.resetFields();
    };

    const handleSubmit = async (values) => {
        try {
            const data = {
                ...values,
                plantingDate: values.plantingDate ? values.plantingDate.format('YYYY-MM-DD') : null
            };

            if (editingCulture) {
                await axios.put(`${API_URL}/cultures/${editingCulture.id}`, data);
                notification.success({
                    message: 'Успех',
                    description: 'Культура успешно обновлена'
                });
            } else {
                await axios.post(`${API_URL}/cultures`, data);
                notification.success({
                    message: 'Успех',
                    description: 'Культура успешно добавлена'
                });
            }
            
            setIsModalVisible(false);
            setEditingCulture(null);
            form.resetFields();
            fetchCultures();
        } catch (error) {
            console.error('Error saving culture:', error);
            notification.error({
                message: 'Ошибка',
                description: 'Не удалось сохранить культуру'
            });
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/cultures/${id}`);
            notification.success({
                message: 'Успех',
                description: 'Культура успешно удалена'
            });
            fetchCultures();
        } catch (error) {
            console.error('Error deleting culture:', error);
            notification.error({
                message: 'Ошибка',
                description: 'Не удалось удалить культуру'
            });
        }
    };

    const columns = [
        {
            title: 'Культура',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Link to={`/culture/${record.id}`}>
                    {text}
                </Link>
            )
        },
        {
            title: 'Дата посадки',
            dataIndex: 'plantingDate',
            key: 'plantingDate',
            render: (date) => date ? dayjs(date).format('DD.MM.YYYY') : '-'
        },
        {
            title: 'Название семян',
            dataIndex: 'seedName',
            key: 'seedName',
        },
        {
            title: 'Количество',
            dataIndex: 'plantCount',
            key: 'plantCount',
            render: (count) => (
                <Tag color="green">
                    {count} шт.
                </Tag>
            )
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => window.open(`/culture/${record.id}`, '_self')}
                    />
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => showModal(record)}
                    />
                    <Popconfirm
                        title="Удалить культуру?"
                        description="Вы уверены, что хотите удалить эту культуру?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Да"
                        cancelText="Нет"
                    >
                        <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 16 
            }}>
                <h2>Посаженные культуры</h2>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => showModal()}
                >
                    Добавить культуру
                </Button>
            </div>

            <Table 
                columns={columns} 
                dataSource={cultures} 
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={editingCulture ? 'Редактировать культуру' : 'Новая культура'}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    autoComplete="off"
                >
                    <Form.Item
                        name="name"
                        label="Название культуры"
                        rules={[
                            { required: true, message: 'Введите название культуры' }
                        ]}
                    >
                        <Input placeholder="Например: Перец болгарский красный" />
                    </Form.Item>

                    <Form.Item
                        name="plantingDate"
                        label="Дата посадки"
                        rules={[
                            { required: true, message: 'Выберите дату посадки' }
                        ]}
                    >
                        <DatePicker 
                            format="DD.MM.YYYY"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="seedName"
                        label="Название семян"
                    >
                        <Input placeholder="Например: Семена перца сладкого" />
                    </Form.Item>

                    <Form.Item
                        name="plantCount"
                        label="Количество кустов"
                        rules={[
                            { required: true, message: 'Введите количество кустов' },
                            { type: 'number', min: 1, message: 'Минимальное количество: 1' }
                        ]}
                    >
                        <InputNumber 
                            min={1}
                            style={{ width: '100%' }}
                            placeholder="Например: 15"
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={handleCancel}>
                                Отмена
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {editingCulture ? 'Сохранить' : 'Добавить'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Cultures;