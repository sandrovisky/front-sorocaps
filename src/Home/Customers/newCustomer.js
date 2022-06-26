import { Button, Form, Input, Row, Col, Typography, Spin, Alert, InputNumber } from 'antd';
import { MaskedInput } from 'antd-mask-input';
import React, { useRef, useState } from 'react';
import api from '../../api';
import Header from '../../Header/header';
const { Title } = Typography;

const NewCustomerForm = () => {
  const [loading, setLoading] = useState(false);
  const [createError, setCreateError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [createSuccess, setCreateSuccess] = useState(false);
  const numberInput = useRef()

  const [form] = Form.useForm();

  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 },
  };

  const formTailLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20, offset: 4 },
  };

  const isValidCNPJ = () => {
    function validarCNPJ() {
      let cnpj = form.getFieldValue('cnpj') ? form.getFieldValue('cnpj').replace(/\D/g, '') : '';

      if (cnpj === '') return false;

      if (cnpj.length !== 14)
        return false;

      // Elimina CNPJs invalidos conhecidos
      if (cnpj === "00000000000000" ||
        cnpj === "11111111111111" ||
        cnpj === "22222222222222" ||
        cnpj === "33333333333333" ||
        cnpj === "44444444444444" ||
        cnpj === "55555555555555" ||
        cnpj === "66666666666666" ||
        cnpj === "77777777777777" ||
        cnpj === "88888888888888" ||
        cnpj === "99999999999999")
        return false;

      // Valida DVs
      let tamanho = cnpj.length - 2
      let numeros = cnpj.substring(0, tamanho);
      let digitos = cnpj.substring(tamanho);
      let soma = 0;
      let pos = tamanho - 7;
      for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
          pos = 9;
      }
      let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
      if (resultado.toString() !== digitos.charAt(0))
        return false;

      tamanho = tamanho + 1;
      numeros = cnpj.substring(0, tamanho);
      soma = 0;
      pos = tamanho - 7;
      for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
          pos = 9;
      }
      resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
      if (resultado.toString() !== digitos.charAt(1))
        return false;

      return true;
    }

    if (!validarCNPJ()) {
      form.setFields([
        {
          name: 'cnpj',
          errors: ['CNPJ inválido!'],
        },
      ])
      return false;
    }
    return true
  }

  const isValidCEP = () => {
    const cep = form.getFieldValue('cep') ? form.getFieldValue('cep').replace(/\D/g, '') : '';

    if (cep.length < 8) {
      form.setFields([
        {
          name: 'cep',
          errors: ['CEP inválido!'],
        },
      ])
      return false;
    }
    return true;
  }

  const onFinish = async (values) => {
    let error = false
    let { socialName, cnpj, cep, street, number, city, district, uf, complement } = values

    setLoading(true)
    setCreateError(false)
    setCreateSuccess(false)

    isValidCNPJ();
    isValidCEP();

    if (error) {
      setLoading(false)
      return
    }

    await api.post(`/customers/create/`, {
      socialName, cnpj, cep, street, number, city, district, uf, complement
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
    console.log('Failed:', errorInfo);
  };

  const searchCEP = async () => {
    setLoading(true)
    await api.post(`/cep/`, {
      cep: form.getFieldValue('cep')
    })
      .then((response) => {
        console.log(response)
        form.setFields([
          {
            name: 'city',
            value: response.data.localidade
          },
          {
            name: 'street',
            value: response.data.logradouro
          },
          {
            name: 'uf',
            value: response.data.uf
          },
          {
            name: 'district',
            value: response.data.bairro
          },
        ])
        numberInput.current.focus()
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setLoading(false))
  }

  return <>
    <Header header={[['Home', "/home/"], ['Novo Usuario', "/home/customers/create/"]]} />
    <div style={{ padding: '20px' }}>
      {
        createError ? <Alert
          description={errorMsg ? errorMsg : 'Erro durante a criação do usuário. Verifique conexão com servidor!'}
          type="error"
          closable
        /> : null
      }
      {
        createSuccess ? <Alert
          description="Cliente criado com sucesso!"
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
              <Title level={2}>Novo Cliente</Title>
            </Form.Item>

            <Form.Item
              {...formItemLayout}
              label="Razão Social"
              name="socialName"
              rules={[
                {
                  required: true,
                  message: 'Insira a razão social!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              {...formItemLayout}
              label="CNPJ"
              name="cnpj"
              rules={[
                {
                  required: true,
                  message: 'Digite o CNPJ!',
                },
              ]}
            >
              <MaskedInput onBlur={() => isValidCNPJ()} mask={'00.000.000/0000-00'} />
            </Form.Item>

            <Form.Item
              {...formItemLayout}
              label="CEP"
              name="cep"
              rules={[
                {
                  required: true,
                  message: 'Insira o CEP!',
                },
              ]}
            >
              <MaskedInput mask={'00000-000'} onBlur={() => {
                if (isValidCEP()) {
                  searchCEP()
                }
              }} />
            </Form.Item>

            <Form.Item
              {...{
                wrapperCol: { span: 14, offset: 8 },
              }}
              required
            >
              <Input.Group compact>
                <Form.Item
                  name={'city'}
                  noStyle
                  rules={[{ required: true, message: 'Informe a cidade!' }]}
                >
                  <Input style={{ width: '50%' }} placeholder="* Cidade" />
                </Form.Item>
                <Form.Item
                  name={'uf'}
                  noStyle
                  rules={[{ required: true, message: 'Informe o estado!' }]}
                >
                  <Input style={{ width: '50%' }} placeholder="* Estado" />
                </Form.Item>
              </Input.Group>
            </Form.Item>

            <Form.Item
              {...formItemLayout}
              label="Bairro"
              name="district"
              rules={[
                {
                  required: true,
                  message: 'Insira o bairro!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              {...formItemLayout}
              label="Rua"
              name="street"
              rules={[
                {
                  required: true,
                  message: 'Insira a rua!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              {...formItemLayout}
              label="Complemento"
              name="complement"
              rules={[
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              {...formItemLayout}
              label="Número"
              name="number"
              rules={[
                {
                  required: true,
                  message: 'Insira o número!',
                },
              ]}
            >
              <InputNumber ref={numberInput} style={{ width: '100%' }} min={0} />
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

export default NewCustomerForm;