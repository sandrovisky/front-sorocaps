import { FileAddOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Link } from "react-router-dom";

const MenuOrder = () => {
  return <div style={{ marginBottom: 16 }}>
    <Link to="/home/orders/create/">
      <Button type="primary" >
      <FileAddOutlined /> Novo Pedido
      </Button>
    </Link>
  </div>
}

export default MenuOrder;