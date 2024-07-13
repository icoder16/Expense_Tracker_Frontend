import React, { useState, useEffect } from 'react';
import { Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';

const Login = () => {

  const navigate = useNavigate();

  const [loading, setloading] = useState(false);

  const submitHandler = async (values) => {
    try {
      setloading(true);
      const { data } = await axios.post('https://expense-tracker-backend-wcql.onrender.com/api/v1/users/login', values);
      setloading(false);
      message.success("Successfully Logged In");
      localStorage.setItem('user', JSON.stringify({ ...data.user, password: '' }));
      navigate('/');

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
      <div className='login-site'>

        <img src='https://pub-static.fotor.com/assets/bg/bf9a415f-b758-4c0d-a820-334370772ec3.jpg' alt=''></img>

        <div className='login-page'>

          <div className='login-img'>
            <img src='https://media.istockphoto.com/id/477047608/photo/australian-money-background.jpg?s=612x612&w=0&k=20&c=VJBw6uuNH1UgISn2-oIn1Cj17suqoov3EYBAbvwNgsk=' alt=''></img>
          </div>

          <div className='login-form'>

            {loading && <Spinner />}

            <Form layout='vertical' onFinish={submitHandler}>
              <h2>LOGIN</h2>

              <Form.Item label="Email" name="email">
                <Input type='email' />
              </Form.Item>

              <Form.Item label="Password" name="password">
                <Input type='password' />
              </Form.Item>

              <div className='d-flex justify-content-between'>
                <Link to="/register">Don't have an account yet? Register Here</Link>
                <button className="btn btn-primary">Login</button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
