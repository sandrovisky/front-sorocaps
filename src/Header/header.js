import { Button, Descriptions, PageHeader } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const Header = () => {
  const [logged, setLogged] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch()

  useEffect(() => {
    if (localStorage.getItem("logged") === null) {
      setLogged(false);
    } else {
      setLogged(true);
    }
  });

  return <div className="site-page-header-ghost-wrapper">
      <PageHeader
        ghost={false}
        onBack={() => window.history.back()}
        title="Title"
        subTitle="This is a subtitle"
      extra={[
          loading ? 
        <Button key="1" type="primary">
          loading
        </Button> : logged ? 
        <Button key="1" type="primary">
          Logged
        </Button> : 
        <Button key="1" type="primary">
          Login
        </Button>
        ]}
      ><Descriptions size="small" column={3}>
          <Descriptions.Item label="Created">Lili Qu</Descriptions.Item>
          <Descriptions.Item label="Association">
            <a>421421</a>
          </Descriptions.Item>
        </Descriptions>
      </PageHeader>
  </div>
};

export default Header;