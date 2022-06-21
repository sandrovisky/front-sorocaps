import { Tabs } from "antd";
import Header from "../Header/header"
import { BarcodeOutlined, UserOutlined, InboxOutlined } from '@ant-design/icons';
import MenuCustomer from './Customers/customers'
const { TabPane } = Tabs;

const Home = () => {
  return <>
    <Header header={[['Home', '/home/']]} />
    <div style={{textAlign: "initial"}}>
      <Tabs >
        <TabPane
          tab={
            <span>
              <UserOutlined />
              Clientes
            </span>
          }
          key="1"
        >
          <MenuCustomer />
        </TabPane>
        <TabPane
          tab={
            <span>
              <BarcodeOutlined />
              Pedidos
            </span>
          }
          key="2"
        >
          Tab 2
        </TabPane>
        <TabPane
          tab={
            <span>
              <InboxOutlined />
              Produtos
            </span>
          }
          key="3"
        >
          Tab 3
        </TabPane>
      </Tabs>
    </div>
  </>
}

export default Home;