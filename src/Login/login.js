import { Button, Form, Input, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import Header from '../Header/header';

const Login = () => {
  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const header = [
    ['Login', "/login"]
  ]

  return <>
    <Header header={[['Login', "/login"]]} />
    <Row style={{ padding: '20px' }}>
      <Col span={8} offset={8}>
        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
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

          <Form.Item >
            <Button block={true} type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>

          <Form.Item  >
            <Link to="/create-user">
              <Button type="link" htmlType="button">
                Criar usuario
              </Button>
            </Link>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  </>
};

export default Login;