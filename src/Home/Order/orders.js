import { FileAddOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Link } from "react-router-dom";
import TableOrders from "./tableOrders";

const MenuOrder = () => {
  return <div style={{ marginBottom: 16 }}>
    <Link to="/home/orders/create/">
      <Button type="primary" >
      <FileAddOutlined /> Novo Pedido
      </Button>
    </Link>
    <TableOrders />
  </div>
}

export default MenuOrder;