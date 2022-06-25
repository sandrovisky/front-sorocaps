import { MinusCircleOutlined, PlusOutlined, SaveTwoTone } from '@ant-design/icons';
import { Alert, Button, Card, Col, Divider, Form, Input, InputNumber, Row, Select, Spin, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import Header from '../../Header/header';
const { Text } = Typography;
const { Option } = Select;

const NewOrderForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [productsList, setProductsList] = useState([]);
  const [customersList, setCustomerList] = useState([]);
  const [form] = Form.useForm();
  const [createError, setCreateError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [createSuccess, setCreateSuccess] = useState(false);

  useEffect(() => {
    async function getData() {
      await api.get('/products/')
        .then(response => {
          console.log('response products', response)
          setProductsList(response.data)
        })
        .catch(err => {
          console.log(err)
        })

      await api.get('/customers/')
        .then(response => {
          console.log('response customers', response)
          setCustomerList(response.data)
        })
        .catch(err => {
          console.log(err)
        })
    }
    getData()
    setLoading(false)
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    setCreateError(false)
    setCreateSuccess(false)

    const products = values.products;
    let error = false;

    products.forEach((productItem, index) => {
      const product = JSON.parse(productItem.product)

      if (productItem.value < product.sellValue) {
        error = true;
        form.setFields([
          {
            name: ['products', index, 'value'],
            errors: ['Valor não poder menor que o preço de venda!'],
          },
        ])
      }
    })

    if (error) {
      return
    }

    const customer = JSON.parse(values.customer)
    let orderItens = [];

    products.forEach((productItem) => {
      const id = JSON.parse(productItem.product).id;
      orderItens.push({
        value: productItem.value,
        amount: productItem.amount,
        total: productItem.total,
        id
      })
    })

    await api.post(`/orders/create/`, {
      customer: customer,
      products: orderItens,
      total
    })
      .then(async (response) => {
        setCreateSuccess(true)
        console.log(response)
        setTimeout(() => {
          navigate('/home')
        }, '2000')
      })
      .catch((err) => {
        console.log(err)
        setCreateError(true)
        setErrorMsg(err.response.data.message)
        setLoading(false)
      })
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleChangeQuantityAmount = (value, product) => {
    const productValue = form.getFieldValue(['products', product.name, 'value'])
    const productAmount = form.getFieldValue(['products', product.name, 'amount'])
    const total = productValue * productAmount

    form.setFields([
      {
        name: ['products', product.name, 'total'],
        value: (Math.round((total + Number.EPSILON) * 100) / 100).toFixed(2),
      },
    ])

    handleUpdateTotal()
  };

  const handleCustomerSelect = () => {
    const customer = JSON.parse(form.getFieldsValue().customer)
    form.setFieldsValue({
      'cnpj': customer.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5"),
    })
  };

  const handleProductSelect = (value, field) => {
    const product = JSON.parse(value)
    const productSellValue = parseFloat(product.sellValue)
    const productAmount = 1

    form.setFields([
      {
        name: ['products', field.name, 'value'],
        value: parseFloat((Math.round((productSellValue + Number.EPSILON) * 100) / 100).toFixed(2)),
      },
      {
        name: ['products', field.name, 'amount'],
        value: productAmount,
      },
      {
        name: ['products', field.name, 'total'],
        value: (Math.round((productSellValue * productAmount + Number.EPSILON) * 100) / 100).toFixed(2),
      },
    ])

    handleUpdateTotal()
  };

  const handleUpdateTotal = () => {
    let totalProducts = 0;
    try {
      (form.getFieldsValue(['products']).products || []).forEach(product => {
        totalProducts = parseFloat(product.total) + parseFloat(totalProducts)
      })
    } catch {

    }
    setTotal(totalProducts)
  }

  const clearFieldErrors = () => {
    const products = form.getFieldsValue().products;
    form.validateFields()
    products.forEach((product, index) => {
      form.setFields([
        {
          name: ['products', index, 'value'],
          errors: [],
        },
      ])
    })
  };

  return (
    <>
      <Header header={[['Home', "/home/"], ['Novo Pedido', "/home/orders/create/"]]} />
      <div style={{ paddingTop: '20px' }}>
        {
          createError ? <Alert
            description={errorMsg ?? 'Erro durante a criação do pedido. Verifique conexão com servidor!'}
            type="error"
            closable
          /> : null
        }
        {
          createSuccess ? <Alert
            description="Pedido criado com sucesso!"
            type="success"
            banner={true}
            closable
          /> : null
        }
        <Spin spinning={loading}>
          <Card title="Novo Pedido" bordered={true} style={{ width: '100%', textAlign: 'initial' }}>
            <Form form={form} name="dynamic_form_nest_item" onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
              <Card title="Dados do Cliente" bordered={true} style={{ width: '100%', textAlign: 'initial' }}>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="Cliente"
                      name='customer'
                      rules={[
                        {
                          required: true,
                          message: 'Selecione um cliente!',
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        onSelect={handleCustomerSelect}
                      >
                        {customersList.map((item) => (
                          <Option key={item.id} value={JSON.stringify(item)}>
                            {item.socialName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col offset={1} span={11}>
                    <Form.Item
                      label="CNPJ"
                      name='cnpj'
                    >
                      <Input disabled />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              <Card
                title="Produtos" bordered={true}
                style={{ marginTop: '20px', textAlign: 'initial' }}
              >
                <Form.List name="products">
                  {(fields, { add, remove, }) => (
                    <>
                      <Row>
                        <Col span={6} style={{ textAlign: 'center' }}>
                          Produto
                        </Col>
                        <Col span={6} style={{ paddingLeft: '15px', textAlign: 'center' }}>
                          Preço
                        </Col>
                        <Col span={6} style={{ paddingLeft: '15px', textAlign: 'center' }}>
                          Quantidade
                        </Col>
                        <Col span={6} style={{ textAlign: 'center' }}>
                          Total
                        </Col>
                      </Row>
                      <Divider style={{ marginTop: '0px' }} />
                      {fields.map((field, index) => (
                        <Row key={index}>
                          <Col span={6}>
                            <Form.Item
                              noStyle
                              shouldUpdate={(prevValues, curValues) =>
                                prevValues.area !== curValues.area || prevValues.products !== curValues.products
                              }
                            >
                              {() => (
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'product']}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Selecione um produto!',
                                    },
                                  ]}
                                >
                                  <Select
                                    showSearch
                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                    onSelect={(e) => { handleProductSelect(e, field) }}
                                    placeholder='Produto'
                                  >
                                    {productsList.map((item) => (
                                      <Option key={item.id} value={JSON.stringify(item)}>
                                        {item.description}
                                      </Option>
                                    ))}
                                  </Select>
                                </Form.Item>
                              )}
                            </Form.Item>
                          </Col>
                          <Col span={6} style={{ paddingLeft: '15px' }}>
                            <Form.Item
                              initialValue={0}
                              name={[field.name, 'value']}
                              rules={[
                                {
                                  required: true,
                                  message: 'Informe um valor!',
                                },
                              ]}
                            >
                              <InputNumber
                                disabled={form.getFieldValue(['products', field.name, 'product']) ? false : true}
                                prefix="R$"
                                onChange={(e) => handleChangeQuantityAmount(e, field)}
                                placeholder='Valor'
                                style={{ width: '100%' }} min={0} step={0.01} />
                            </Form.Item>
                          </Col>
                          <Col span={6} style={{ paddingLeft: '15px' }}>
                            <Form.Item
                              initialValue={1}
                              name={[field.name, 'amount']}
                              rules={[
                                {
                                  required: true,
                                  message: 'Informe a quantidade!',
                                },
                              ]}
                            >
                              <InputNumber
                                disabled={form.getFieldValue(['products', field.name, 'product']) ? false : true}
                                onChange={(e) => handleChangeQuantityAmount(e, field)}
                                placeholder='Quantidade'
                                style={{ width: '100%' }} min={1} />
                            </Form.Item>
                          </Col>
                          <Col span={5} style={{ paddingLeft: '15px' }}>
                            <Form.Item
                              initialValue={0}
                              name={[field.name, 'total']}
                              style={{ textAlign: 'center' }} >
                              <Text strong>{
                                'R$ ' + (form.getFieldValue(['products', field.name, 'total']) || '0.00')}
                              </Text>
                            </Form.Item>
                          </Col>
                          <Col span={1} style={{ textAlign: 'center' }}>
                            <MinusCircleOutlined onClick={() => {
                              remove(field.name)
                              handleUpdateTotal()
                              clearFieldErrors()
                            }} />
                          </Col>
                        </Row>
                      ))}
                      <Divider />
                      <Row >
                        <Col span={8}>
                          <Form.Item style={{ marginBottom: '0px' }}>
                            <Button type="dashed" onClick={() => {
                              add(); handleUpdateTotal();
                            }} icon={<PlusOutlined />}>
                              Adicionar Produto
                            </Button>
                          </Form.Item>
                        </Col>
                        <Col span={8} offset={8} style={{ textAlign: "end" }}>
                          <Text strong>
                            TOTAL DO PEDIDO: R$ {total.toFixed(2)}
                          </Text>
                        </Col>
                      </Row>
                    </>
                  )}
                </Form.List>
              </Card>

              <Form.Item style={{ paddingTop: '20px' }}>
                <Button type="dashed" htmlType="submit">
                  <SaveTwoTone />
                  Cadastrar
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Spin>
      </div>
    </>
  );
};

export default NewOrderForm;