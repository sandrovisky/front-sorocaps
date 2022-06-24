import { Breadcrumb, Button, PageHeader } from 'antd';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/userSlice'

const Header = (props) => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logout());
  }

  return <div className="site-page-header-ghost-wrapper">
    <PageHeader
      style={{ border: '1px solid', margin: '-25px -25px 0px -25px' }}
      ghost={true}
      title="Sorocaps"
      extra={[user.logged ? <div key={0}>
          Olá, {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
          <Button key="1" type="link" onClick={handleLogout}>
            sair
          </Button>
      </div>
        : null
      ]}
    >
      <Breadcrumb separator="/">
        {
          props.header.map((ele, i) => {
            if ((i + 1) === props.header.length) {
              return <Breadcrumb.Item key={i}>{ele[0]}</Breadcrumb.Item>
            }
            return <Breadcrumb.Item key={i}><Link to={ele[1]} key={i}>{ele[0]}</Link></Breadcrumb.Item>
          })
        }
      </Breadcrumb>
    </PageHeader>
  </div>
};

export default Header;