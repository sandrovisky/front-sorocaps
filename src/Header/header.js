import { Breadcrumb, Button, Descriptions, PageHeader } from 'antd';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { changeUser } from '../redux/userSlice'

const Header = (props) => {
  console.log(props)
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  const handleLogin = () => {
    dispatch(changeUser('Sandro'));
  }

  return <div className="site-page-header-ghost-wrapper">
    <PageHeader
      style={{ border: '1px solid' }}
      ghost={true}
      title="Sorocaps"
      extra={[user.logged ??
        <Button key="2" type="primary">
          {user.name}
        </Button>
      ]}
    >

      <Breadcrumb separator="/">
        {
          props.header.map((ele, i) => {
            console.log(ele, i)
            return <Breadcrumb.Item key={i}><Link to={ele[1]} key={i}>{ele[0]}</Link></Breadcrumb.Item>
          })
        }
      </Breadcrumb>
    </PageHeader>
  </div>
};

export default Header;