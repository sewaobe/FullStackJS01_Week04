import React, { useContext, useState } from 'react';
import {
  UsergroupAddOutlined,
  HomeOutlined,
  SettingOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';

const Header = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  console.log('>>> check auth: ', auth);

  const items = [
    {
      label: <Link to='/'>Home Page</Link>,
      key: 'home',
      icon: <HomeOutlined />,
    },
    {
      label: <Link to='/products'>Danh sách sản phẩm</Link>,
      key: 'products',
      icon: <AppstoreOutlined />,
    },
    ...(auth?.isAuthenticated
      ? [
          {
            label: <Link to='/user'>Users</Link>,
            key: 'user',
            icon: <UsergroupAddOutlined />,
          },
        ]
      : []),
    ...(!auth?.isAuthenticated
      ? [
          {
            label: <Link to='/login'>Đăng nhập</Link>,
            key: 'login',
          },
        ]
      : []),
    {
      label: `Welcome ${auth?.user?.email ?? ''}`,
      key: 'submenu',
      icon: <SettingOutlined />,
      children: [
        ...(auth?.isAuthenticated
          ? [
              {
                label: (
                  <span
                    onClick={() => {
                      localStorage.removeItem('access_token');
                      setAuth({
                        isAuthenticated: false,
                        user: { email: '', name: '' },
                      });
                      navigate('/');
                    }}
                  >
                    Đăng xuất
                  </span>
                ),
                key: 'logout',
              },
            ]
          : []),
      ],
    },
  ];

  const [current, setCurrent] = useState('home');

  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode='horizontal'
      theme='light'
      items={items}
    />
  );
};

export default Header;
