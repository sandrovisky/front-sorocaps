import { Button, Form, Input, Row, Col, Typography, Spin, Alert } from 'antd';
import { useState } from 'react';
import api from '../api';
import Header from '../Header/header';
const { Title } = Typography;

const CreateUserForm = () => {
  const [loading, setLoading] = useState(false);
  const [createError, setCreateError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [createSuccess, setCreateSuccess] = useState(false);

  const [form] = Form.useForm();

  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 },
  };

  const formTailLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20, offset: 4 },
  };

  const onFinish = async (values) => {
    let error = false
    setLoading(true)
    setCreateError(false)
    setCreateSuccess(false)

    if (values.user.length < 5) {
      error = true
      form.setFields([
        {
          name: 'user',
          errors: ['Usuário precisa ter no mínimo 5 caracteres!'],
        },
      ])
    }

    if (values.password.length < 6) {
      error = true
      form.setFields([
        {
          name: 'password',
          errors: ['Senha precisa ter no mínimo 6 caracteres!'],
        },
      ])
    }

    if (values.password !== values.password_confirm) {
      error = true
      form.setFields([
        {
          name: 'password_confirm',
          errors: ['Senhas inseridas precisam ser identicas!'],
        },
      ])
    }

    if (error) {
      setLoading(false)
      return
    }

    const { user, password, name } = values

    await api.post(`/users/create/`, {
      user,
      password,
      name
    })
      .then((response) => {
        setCreateSuccess(true)
        console.log(response)
        form.resetFields()
      })
      .catch((err) => {
        console.log(err)
        setCreateError(true)
        setErrorMsg(err.response.data.message)
      })
      .finally(() => setLoading(false))

    console.log('Success:', values);

  };

  const onFinishFailed = (errorInfo) => {
    console.log();
    console.log('Failed:', errorInfo);
  };


  return <>    
    <Header header={[['Login', "/login"], ['Novo Usuario', "/create-user"]]} />
    <div style={{ padding: '20px' }}>
      {
        createError ? <Alert
          description={errorMsg}
          type="error"
          closable
        /> : null
      }
      {
        createSuccess ? <Alert
          description="Usuário criado com sucesso!"
          type="success"
          banner={true}
          closable
        /> : null
      }
    </div>
    <Row>
      <Col span={8} offset={8}>
        <Spin spinning={loading}>
          <Form
            form={form}
            name="createUser"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              {...formTailLayout}
            >
              <Title level={2}>Novo Usario</Title>
            </Form.Item>

            <Form.Item
              {...formItemLayout}
              label="Nome"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Insira um nome!',
                },
              ]}
            >
              <Input />
            </Form.Item>

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
                  message: 'Insira uma senha!',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              {...formItemLayout}
              label="Confirme a Senha"
              name="password_confirm"
              rules={[
                {
                  required: true,
                  message: 'Confirme a senha!',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              {...formTailLayout}
            >
              <Button type="primary" htmlType="submit">
                Criar
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Col>
    </Row>
  </>
};

export default CreateUserForm;