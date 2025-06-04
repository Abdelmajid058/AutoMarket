// frontend/src/admin/AdminMenu.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { 
    DashboardOutlined,
    CarOutlined,
    UnorderedListOutlined,
    PlusCircleOutlined,
    UserOutlined,
    FileTextOutlined // Import the new icon
} from '@ant-design/icons';

const AdminMenu = () => {
    return (
        <div className='card'>
            <div className='list-group list-group-flush'>
                <Link to='/dashboard/admin' className='list-group-item list-group-item-action'>
                    <DashboardOutlined className='me-2' />
                    Tableau de bord
                </Link>
                <Link to='/dashboard/admin/allbrands' className='list-group-item list-group-item-action'>
                    <UnorderedListOutlined className='me-2' />
                    Marques
                </Link>
                <Link to='/dashboard/admin/cars' className='list-group-item list-group-item-action'>
                    <CarOutlined className='me-2' />
                    Véhicules
                </Link>
                <Link to='/dashboard/admin/create-brand' className='list-group-item list-group-item-action'>
                    <PlusCircleOutlined className='me-2' />
                    Ajouter une marque
                </Link>
                <Link to='/dashboard/admin/create-product' className='list-group-item list-group-item-action'>
                    <PlusCircleOutlined className='me-2' />
                    Ajouter un véhicule
                </Link>
                <Link to='/dashboard/admin/userorders' className='list-group-item list-group-item-action'>
                    <FileTextOutlined className='me-2' /> {/* Changed icon to FileTextOutlined */}
                    Demandes clients {/* Changed text to "Demandes clients" */}
                </Link>
            </div>
        </div>
    );
};

export default AdminMenu;