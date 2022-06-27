import { FolderOpenOutlined, FolderOutlined } from '@ant-design/icons';
import { Button, Spin, Table, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import api from '../../api';

const { TabPane } = Tabs;

const TableOrders = () => {
  const [dataSeparated, setDataSeparated] = useState([])
  const [dataOpen, setDataOpen] = useState([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      await api.get('/orders/')
        .then(response => {
          console.log('response orders', response)
          const orders = response.data;
          let auxSep = []
          let auxOpen = []

          orders.forEach(order => {
            if (order.status !== 0) {
              auxSep.push({
                key: order.id,
                id: order.id,
                customer: order.customer.socialName.toUpperCase(),
                total: order.total.toFixed(2),
                status: "APROVADO",
                order: order,
              })
            } else {
              auxOpen.push({
                key: order.id,
                id: order.id,
                customer: order.customer.socialName.toUpperCase(),
                total: order.total.toFixed(2),
                status: "EM PROCESSO",
                order: order,
                action: <Button type='link' onClick={() => approveOrder(order.id)}>Aprovar</Button>
              })
            }
          });

          setDataSeparated(auxSep)
          setDataOpen(auxOpen)
        })
        .catch(err => {
          console.log(err)
        })
        .finally((response) => {
          setLoading(false)
        })
    }
    getData()
    setLoading(false)
  }, [loading]);

  const expandedRowRender = ({ order }) => {
    const columns = [
      {
        title: 'Codigo',
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: 'Produto',
        dataIndex: 'product',
        key: 'product',
      },
      {
        title: 'Valor',
        dataIndex: 'value',
        key: 'value',
      },
      {
        title: 'Quantidade',
        dataIndex: 'amount',
        key: 'amount',
      },
      {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
      },
    ];
    const details = [];

    order.itens.forEach(item => {
      details.push({
        key: item.id,
        code: item.product.code,
        product: item.product.description,
        value: item.soldValue.toFixed(2),
        amount: item.amount,
        total: (item.amount * item.soldValue).toFixed(2)
      });
    });

    return <Table columns={columns} dataSource={details} pagination={false} />;
  };

  const approveOrder = (id) => {
    setLoading(true)
    api.patch('/orders/approve/', {
      id
    })
      .then((response) => {
        console.log('approve', response.data)
      })
      .catch((error) => {
        console.log(error.response.data)
      })
      .finally((response) => {
        setLoading(false)
      })
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Cliente',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Ações',
      dataIndex: 'action',
      key: 'action',
    },
  ];

  return (
    <Spin spinning={loading}>
      <Tabs style={{ paddingTop: '20px' }}>
        <TabPane
          tab={
            <span>
              <FolderOpenOutlined />
              Em Aberto
            </span>
          }
          key="1"
        >
          <Table
            columns={columns}
            expandable={{
              expandedRowRender,
            }}
            dataSource={dataOpen}
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <FolderOutlined />
              Separados
            </span>
          }
          key="2"
        >
          <Table
            columns={columns}
            expandable={{
              expandedRowRender,
            }}
            dataSource={dataSeparated}
          />
        </TabPane>
      </Tabs>
    </Spin>
  );
}

export default TableOrders;