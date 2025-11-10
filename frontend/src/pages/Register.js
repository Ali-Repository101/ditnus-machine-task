import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  CardBody,
  CardTitle,
  FormFeedback
} from 'reactstrap';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import API from '../api/axiosConfig';

export default function Register() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      password: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string()
        .email('Please enter a valid email')
        .required('Email is required'),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
        .required('Phone is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required')
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await API.post('/auth/register', values);
        toast.success(response.data.msg || 'Registered successfully!');
        resetForm();
        navigate('/login');
      } catch (error) {
        const message = error.response?.data?.msg || 'Error registering';
        toast.error(message);
      }
    }
  });

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card style={{ width: '400px' }}>
        <CardBody>
          <CardTitle tag="h4" className="text-center mb-4">
            Register
          </CardTitle>

          <Form onSubmit={formik.handleSubmit}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                invalid={formik.touched.name && !!formik.errors.name}
              />
              <FormFeedback>{formik.errors.name}</FormFeedback>
            </FormGroup>

            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                invalid={formik.touched.email && !!formik.errors.email}
              />
              <FormFeedback>{formik.errors.email}</FormFeedback>
            </FormGroup>

            <FormGroup>
              <Label for="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="Enter 10-digit phone number"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                invalid={formik.touched.phone && !!formik.errors.phone}
              />
              <FormFeedback>{formik.errors.phone}</FormFeedback>
            </FormGroup>

            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                invalid={formik.touched.password && !!formik.errors.password}
              />
              <FormFeedback>{formik.errors.password}</FormFeedback>
            </FormGroup>

            <Button color="primary" type="submit" block>
              Register
            </Button>

            <p className="text-center mt-3">
              Already have an account? <a href="/login">Login</a>
            </p>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}
