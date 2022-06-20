import { Button, Form, Input, Row, Col, Spin, Alert } from 'antd';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../api';
import Header from '../Header/header';
import { changeUser } from '../redux/userSlice';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [createError, setCreateError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    const { user, password } = values
    setLoading(true)
    setCreateError(false)

    await api.post(`/login/`, {
      user,
      password,
    })
      .then((response) => {
        console.log(response)
        form.resetFields()
        dispatch(changeUser(response.data.result.name))
      })
      .catch((err) => {
        console.log(err)
        setCreateError(true)
        setErrorMsg(err.response.data.message)
      })
      .finally(() => setLoading(false))
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const paths = [
    {
      path: 'login',
      breadcrumbName: 'Login',
    }
  ]

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  const formTailLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 20, offset: 4 },
  };

  return <>
    <Header header={paths} />
    <div style={{ padding: '20px' }}>
      {
        createError ? <Alert
          description={errorMsg}
          type="error"
          closable
        /> : null
      }
    </div>
    <Spin spinning={loading}>
      <Row style={{ padding: '20px' }}>
        <Col span={8} offset={8}>
          <Form
            form={form}
            name="basic"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              {...formItemLayout}
              label="Usuario"
              name="user"
              rules={[
                {
                  required: true,
                  message: 'Insira um usuário!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              {...formItemLayout}
              label="Senha"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Insira uma senha',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item {...formTailLayout} >
              <Button type="primary" htmlType="submit">
                Login
              </Button>
            </Form.Item>

            <Form.Item {...formTailLayout} >
              <Link to="/create-user">
                <Button type="link" htmlType="button" >
                  Criar usuario
                </Button>
              </Link>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Spin>
  </>
};

export default Login;