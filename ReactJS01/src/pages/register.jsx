import React from 'react';
import { Button, Col, Divider, Form, Input, notification, Row } from 'antd';
import { createUserApi } from '../util/app';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

const RegisterPage = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        const { name, email, password } = values;

        const res = await createUserApi(name, email, password);

        if (res) {
            notification.success({
                message: "CREATE USER",
                description: "success",
            });
            navigate("/login");
        } else {
            notification.error({
                message: "CREATE USER",
                description: "error",
            });
        }
    };

    return (
        <Row justify={"center"} style={{ marginTop: "30px" }}>
            <Col xs={24} md={16} lg={8}>
                <fieldset
                    style={{
                        padding: "15px",
                        margin: "5px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                    }}
                >
                    <legend>Đăng Ký Tài Khoản</legend>
                    <Form
                        name="basic"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your name!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                            <Divider type="vertical" />
                            <Link to="/">
                                <ArrowLeftOutlined /> Quay Lại Trang chủ
                            </Link>
                        </Form.Item>
                        <Divider />
                        Đã có tài khoản?{" "}
                        <Link to="/login">Đăng nhập</Link>
                    </Form>
                </fieldset>
            </Col>
        </Row>
    )
}

export default RegisterPage;