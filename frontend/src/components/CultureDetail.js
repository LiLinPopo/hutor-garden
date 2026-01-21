import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  Typography,
  Button,
  Space,
  Descriptions,
  List,
  Tag,
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Select,
  notification,
  Popconfirm
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  AppstoreAddOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const API_URL = 'http://localhost:5000/api';
const { Title, Text } = Typography;

const CultureDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [culture, setCulture] = useState(null);
    const [notes, setNotes] = useState([]);
    const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [noteType, setNoteType] = useState('history');
    const [form] = Form.useForm();

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
            notification.error({
                message: 'Ошибка',
                description: 'Не удалось загрузить информацию о культуре'
            });
        }
    };

    const fetchNotes = async () => {
        try {
            const response = await axios.get(`${API_URL}/cultures/${id}/notes`);
            setNotes(response.data.sort((a, b) => 
                new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
            ));
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    const showNoteModal = (note = null) => {
        setEditingNote(note);
        if (note) {
            setNoteType(note.type);
            form.setFieldsValue({
                ...note,
                date: note.date ? dayjs(note.date) : dayjs(note.createdAt)
            });
        } else {
            setNoteType('history');
            form.resetFields();
            form.setFieldsValue({
                date: dayjs()
            });
        }
        setIsNoteModalVisible(true);
    };

    const handleNoteCancel = () => {
        setIsNoteModalVisible(false);
        setEditingNote(null);
        form.resetFields();
    };

    const handleNoteSubmit = async (values) => {
        try {
            const data = {
                ...values,
                type: noteType,
                date: values.date.format('YYYY-MM-DD'),
                cultureId: id,
                cultureName: culture?.name
            };

            if (editingNote) {
                if (noteType === 'harvest') {
                    await axios.put(`${API_URL}/harvests/${editingNote.id}`, {
                        ...data,
                        count: parseInt(data.count)
                    });
                }
                await axios.put(`${API_URL}/notes/${editingNote.id}`, data);
                
                notification.success({
                    message: 'Успех',
                    description: 'Заметка успешно обновлена'
                });
            } else {
                if (noteType === 'harvest') {
                    await axios.post(`${API_URL}/harvests`, {
                        ...data,
                        count: parseInt(data.count)
                    });
                }
                await axios.post(`${API_URL}/notes`, data);
                
                notification.success({
                    message: 'Успех',
                    description: 'Заметка успешно добавлена'
                });
            }
            
            setIsNoteModalVisible(false);
            setEditingNote(null);
            form.resetFields();
            fetchNotes();
        } catch (error) {
            console.error('Error saving note:', error);
            notification.error({
                message: 'Ошибка',
                description: 'Не удалось сохранить заметку'
            });
        }
    };

    const handleDeleteNote = async (noteId) => {
        try {
            await axios.delete(`${API_URL}/notes/${noteId}`);
            notification.success({
                message: 'Успех',
                description: 'Заметка успешно удалена'
            });
            fetchNotes();
        } catch (error) {
            console.error('Error deleting note:', error);
            notification.error({
                message: 'Ошибка',
                description: 'Не удалось удалить заметку'
            });
        }
    };

    if (!culture) {
        return <div>Загрузка...</div>;
    }

    return (
        <div>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card>
                    <Space style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        marginBottom: 16 
                    }}>
                        <Title level={3} style={{ margin: 0 }}>
                            {culture.name}
                        </Title>
                        <Button 
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate('/')}
                        >
                            Назад к списку
                        </Button>
                    </Space>
                    
                    <Descriptions bordered column={2}>
                        <Descriptions.Item label="Дата посадки">
                            {culture.plantingDate ? dayjs(culture.plantingDate).format('DD.MM.YYYY') : '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Название семян">
                            {culture.seedName || '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Количество кустов">
                            <Tag color="green">{culture.plantCount} шт.</Tag>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                <Card
                    title="История и заметки"
                    extra={
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />}
                            onClick={() => showNoteModal()}
                        >
                            Добавить заметку
                        </Button>
                    }
                >
                    <List
                        itemLayout="vertical"
                        dataSource={notes}
                        renderItem={(note) => (
                            <List.Item
                                key={note.id}
                                actions={[
                                    <Button
                                        type="link"
                                        icon={<EditOutlined />}
                                        size="small"
                                        onClick={() => showNoteModal(note)}
                                    >
                                        Редактировать
                                    </Button>,
                                    <Popconfirm
                                        title="Удалить заметку?"
                                        description="Вы уверены, что хотите удалить эту заметку?"
                                        onConfirm={() => handleDeleteNote(note.id)}
                                        okText="Да"
                                        cancelText="Нет"
                                    >
                                        <Button
                                            type="link"
                                            danger
                                            icon={<DeleteOutlined />}
                                            size="small"
                                        >
                                            Удалить
                                        </Button>
                                    </Popconfirm>
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={
                                        note.type === 'harvest' ? (
                                            <Tag color="orange" icon={<AppstoreAddOutlined />}>
                                                Сбор урожая
                                            </Tag>
                                        ) : (
                                            <Tag color="blue">Заметка</Tag>
                                        )
                                    }
                                    title={
                                        <Space>
                                            <Text strong>
                                                {note.type === 'harvest' ? `Сбор урожая: ${note.count} шт.` : note.title}
                                            </Text>
                                            <Text type="secondary">
                                                {dayjs(note.date || note.createdAt).format('DD.MM.YYYY')}
                                            </Text>
                                        </Space>
                                    }
                                    description={
                                        note.type === 'harvest' ? 
                                        (note.content || note.notes || '') : 
                                        note.content
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </Card>
            </Space>

            <Modal
                title={editingNote ? 'Редактировать заметку' : 'Новая заметка'}
                open={isNoteModalVisible}
                onCancel={handleNoteCancel}
                footer={null}
                destroyOnClose
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleNoteSubmit}
                    autoComplete="off"
                >
                    <Form.Item
                        name="type"
                        label="Тип заметки"
                        initialValue="history"
                    >
                        <Select onChange={setNoteType}>
                            <Select.Option value="history">История/Заметка</Select.Option>
                            <Select.Option value="harvest">Сбор урожая</Select.Option>
                        </Select>
                    </Form.Item>

                    {noteType === 'history' ? (
                        <>
                            <Form.Item
                                name="title"
                                label="Заголовок"
                                rules={[
                                    { required: true, message: 'Введите заголовок' }
                                ]}
                            >
                                <Input placeholder="Например: День 1. Посадка" />
                            </Form.Item>

                            <Form.Item
                                name="content"
                                label="Содержание"
                                rules={[
                                    { required: true, message: 'Введите содержание' }
                                ]}
                            >
                                <Input.TextArea 
                                    rows={3} 
                                    placeholder="Например: Посадил в землю перец..." 
                                />
                            </Form.Item>
                        </>
                    ) : (
                        <>
                            <Form.Item
                                name="count"
                                label="Количество собранного"
                                rules={[
                                    { required: true, message: 'Введите количество' },
                                    { type: 'number', min: 1, message: 'Минимальное количество: 1' }
                                ]}
                            >
                                <InputNumber 
                                    min={1}
                                    style={{ width: '100%' }}
                                    placeholder="Например: 15"
                                />
                            </Form.Item>

                            <Form.Item
                                name="content"
                                label="Примечания"
                            >
                                <Input.TextArea 
                                    rows={3} 
                                    placeholder="Например: Урожай хороший, плоды крупные..." 
                                />
                            </Form.Item>
                        </>
                    )}

                    <Form.Item
                        name="date"
                        label="Дата"
                        rules={[
                            { required: true, message: 'Выберите дату' }
                        ]}
                    >
                        <DatePicker 
                            format="DD.MM.YYYY"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={handleNoteCancel}>
                                Отмена
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {editingNote ? 'Сохранить' : 'Добавить'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CultureDetail;