import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Link } from "react-router-dom";

const MenuProduct = () => {
  return <div style={{ marginBottom: 16 }}>
    <Link to="/home/products/create/">
      <Button type="primary" >
        <PlusOutlined /> Cadastrar Produto
      </Button>
    </Link>
  </div>
}

export default MenuProduct;