// frontend/src/common/UserDashboard.jsx

import React from 'react';
import { useAuth } from '../context/auth';
import UserMenu from './UserMenu';
import { Card, Space, Statistic } from 'antd';
import { CarOutlined, FileTextOutlined } from '@ant-design/icons'; // Changed ShoppingCartOutlined to FileTextOutlined

const UserDashboard = () => {
    const [auth] = useAuth();

    return (
        <div className='container marginStyle'>
            <div className='row'>
                <div className='col-md-3'>
                    <UserMenu />
                </div>
                <div className='col-md-9 mt-4'>
                    <h3 className='text-center mb-4'>Bienvenue, {auth?.user?.name}</h3>
                    
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <Card title="Votre activité">
                            <div className="row">
                                <div className="col-md-6">
                                    <Statistic 
                                        title="Vos demandes de contact" // Changed title
                                        value={5} // Placeholder: replace with actual data (e.g., count of user's orders)
                                        prefix={<FileTextOutlined />} // Icon for documents/requests
                                    />
                                </div>
                                <div className="col-md-6">
                                    <Statistic 
                                        title="Véhicules favoris" 
                                        value={3} // Placeholder: replace with actual data
                                        prefix={<CarOutlined />}
                                    />
                                </div>
                            </div>
                        </Card>

                        <Card title="Vos dernières demandes">
                            <p>Vous n'avez pas encore de demandes récentes. Rendez-vous sur "Mes Demandes" pour voir l'historique.</p>
                            {/* You might want to display a small list of recent requests here */}
                        </Card>
                    </Space>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;