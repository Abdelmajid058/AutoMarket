import React from 'react';
import { Link } from 'react-router-dom';
import { 
    DashboardOutlined,
    ShoppingCartOutlined,
    UserOutlined 
} from '@ant-design/icons';

const UserMenu = () => {
    return (
        <div className='card'>
            <div className='list-group list-group-flush'>
                <Link to='/dashboard/user' className='list-group-item list-group-item-action'>
                    <DashboardOutlined className='me-2' />
                    Tableau de bord
                </Link>
                <Link to='/dashboard/user/order' className='list-group-item list-group-item-action'>
                    <ShoppingCartOutlined className='me-2' />
                    Mes demandes
                </Link>
                <Link to='/dashboard/user/profile' className='list-group-item list-group-item-action'>
                    <UserOutlined className='me-2' />
                    Mon profil
                </Link>
            </div>
        </div>
    );
};

export default UserMenu;