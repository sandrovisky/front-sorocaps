import { Button, Form, Input, Row, Col, Typography, Spin, Alert, InputNumber } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { useState } from 'react';
import api from '../../api';
import Header from '../../Header/header';
const { Title } = Typography;

const NewProductForm = () => {
  const [loading, setLoading] = useState(false);
  const [createError, setCreateError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [createSuccess, setCreateSuccess] = useState(false);

  const [form] = Form.useForm();

  const formItemLayout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 12 },
  };

  const formTailLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20, offset: 4 },
  };

  const onFinish = async (values) => {
    console.log('Success:', values);
    let error = false
    let { code, description, measure, buyValue, sellValue } = values

    setLoading(true)
    setCreateError(false)
    setCreateSuccess(false)

    if (buyValue > sellValue) {      
      error = true
      form.setFields([
        {
          name: 'buyValue',
          errors: ['Valor de venda não pode ser menor que o valor de compra!'],
        },
      ])
      form.setFields([
        {
          name: 'sellValue',
          errors: ['Valor de venda não pode ser menor que o valor de compra!'],
        },
      ])
    }

    if (error) {
      setLoading(false)
      return
    }

    await api.post(`/products/create/`, {
      code, description, measure, buyValue, sellValue
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
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return <>
    <Header header={[['Home', "/home/"], ['Cadastrar Produto', "/home/products/create/"]]} />
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
          description="Produto cadastrado com sucesso!"
          type="success"
          banner={true}
          closable
        /> : null
      }
    </div>
    <Row>
      <Col span={10} offset={7}>
        <Spin spinning={loading}>
          <Form
            form={form}
            name="createProduct"
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
              <Title level={2}>Cadastrar Produto</Title>
            </Form.Item>

            <Form.Item
              {...formItemLayout}
              label="Codigo"
              name="code"
              rules={[
                {
                  required: true,
                  message: 'Informe o código!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              {...formItemLayout}
              label="Descrição"
              name="description"
            >
              <TextArea rows={2} />
            </Form.Item>

            <Form.Item
              {...formItemLayout}
              label="Unidade de Medida"
              name="measure"
              rules={[
                {
                  required: true,
                  message: 'Informe a unidade de medida!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              {...formItemLayout}
              label="Valor de Compra"
              name="buyValue"
              rules={[
                {
                  required: true,
                  message: 'Informe um valor!',
                },
              ]}
            >
              <InputNumber
                addonBefore={'R$'}
                style={{ width: '100%' }} min={0} step={0.01} />
            </Form.Item>

            <Form.Item
              {...formItemLayout}
              label="Valor de Venda"
              name="sellValue"
              rules={[
                {
                  required: true,
                  message: 'Informe um valor!',
                },
              ]}
            >
              <InputNumber
                addonBefore={'R$'}
                style={{ width: '100%' }} min={0} step={0.01} />
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

export default NewProductForm;