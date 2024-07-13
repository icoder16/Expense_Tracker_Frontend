import React, { useState, useEffect } from 'react';
import { Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';

const Register = () => {

  const navigate = useNavigate();

  const [loading, setloading] = useState(false);

  const submitHandler = async (values) => {
    try {
      setloading(true);
      await axios.post("https://expense-tracker-backend-wcql.onrender.com/api/v1/users/register", values);
      message.success("Registration Successful");
      setloading(false);
      navigate("/login");

    } catch (error) {
      setloading(false);
      message.error("Something went wrong");
    }
  }

  useEffect(() => {

    if(localStorage.getItem("user")){
      navigate("/");
    }

  }, [navigate])
  

  return (
    <>
      <div className='register-site'>
        <img src='https://st2.depositphotos.com/2124221/46809/i/450/depositphotos_468095768-stock-photo-abstract-multicolored-background-poly-pattern.jpg' alt=''></img>
        <div className='register-form'>

          {loading && <Spinner />}

          <Form layout='vertical' onFinish={submitHandler}>
            <h2>REGISTER</h2>

            <Form.Item label="Name" name="name">
              <Input />
            </Form.Item>

            <Form.Item label="Email" name="email">
              <Input type='email' />
            </Form.Item>

            <Form.Item label="Password" name="password">
              <Input type='password' />
            </Form.Item>

            <div className='d-flex justify-content-between'>
              <Link to="/login">Already Registerd ? Click Here To Login</Link>
              <button className="btn btn-primary">Register</button>
            </div>
          </Form>
        </div>
      </div>
    </>
  )
}

export default Register
