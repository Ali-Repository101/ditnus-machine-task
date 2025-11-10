import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Form, FormGroup, Label, Input, Button, Card, CardBody, CardTitle, FormFeedback } from 'reactstrap';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import API from '../api/axiosConfig';

export default function Login() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email').required('Email is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: async (values) => {
            try {
                const res = await API.post('/auth/login', values);
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                toast.success('Logged in successfully!');
                navigate('/dashboard');
            } catch (err) {
                toast.error(err.response?.data?.msg || 'Login failed');
            }
        },
    });

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <Card style={{ width: '400px' }}>
                <CardBody>
                    <CardTitle tag="h4" className="text-center mb-4">Login</CardTitle>
                    <Form onSubmit={formik.handleSubmit}>
                        <FormGroup>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                invalid={formik.touched.email && !!formik.errors.email}
                                placeholder="Enter email"
                            />
                            <FormFeedback>{formik.errors.email}</FormFeedback>
                        </FormGroup>

                        <FormGroup>
                            <Label>Password</Label>
                            <Input
                                type="password"
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                invalid={formik.touched.password && !!formik.errors.password}
                                placeholder="Enter password"
                            />
                            <FormFeedback>{formik.errors.password}</FormFeedback>
                        </FormGroup>

                        <Button color="success" block type="submit">Login</Button>
                        <p className="text-center mt-3">
                            Don’t have an account? <a href="/register">Register</a>
                        </p>
                    </Form>
                </CardBody>
            </Card>
        </div>
    );
}
