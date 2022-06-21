import { UserAddOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Link } from "react-router-dom";

const MenuCustomer = () => {
  return <div style={{ marginBottom: 16 }}>
    <Link to="/home/customers/create/">
      <Button type="primary" >
        <UserAddOutlined /> Novo Cliente
      </Button>
    </Link>
  </div>
}

export default MenuCustomer;