// frontend/src/admin/AdminDashboard.jsx

import React, { useEffect } from 'react';
import AdminMenu from './AdminMenu';
import { useAuth } from '../context/auth';
import { Card, Statistic, Row, Col } from 'antd';
import { CarOutlined, UserOutlined, FileTextOutlined } from '@ant-design/icons'; // Changed ShoppingCartOutlined to FileTextOutlined for requests

const AdminDashboard = () => {
    const [auth] = useAuth();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className='container marginStyle'>
            <div className='row'>
                <div className='col-md-3'>
                    <AdminMenu />
                </div>
                <div className='col-md-9 mt-4'>
                    <h3 className='text-center mb-4'>Tableau de bord, {auth?.user?.name}</h3>
                    
                    <Row gutter={16} className='mb-4'>
                        <Col span={8}>
                            <Card>
                                <Statistic 
                                    title="Véhicules en stock" 
                                    value={125} // Replace with actual data from backend
                                    prefix={<CarOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card>
                                <Statistic 
                                    title="Clients enregistrés" 
                                    value={89} // Replace with actual data from backend
                                    prefix={<UserOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card>
                                <Statistic 
                                    title="Nouvelles demandes" // Changed from "Demandes récentes" to "Nouvelles demandes" for clarity
                                    value={12} // Replace with actual data from backend (e.g., number of pending orders)
                                    prefix={<FileTextOutlined />} 
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Card title="Activité récente" className='mt-4'>
                        <p>Ici vous pourrez voir les dernières activités et demandes de contact...</p>
                        {/* You might want to display a list of recent orders/requests here */}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;