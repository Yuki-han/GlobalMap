/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 *
 * @see You can view component api by: https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout from '@ant-design/pro-layout';
import React, { useEffect, useRef } from 'react';
import { Link, connect, history } from 'umi';
import logo from '../assets/geography.png';

/** Use Authorized check all menu item */

const menuDataRender = (menuList) =>
  menuList.map((item) => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    };
    // console.log(Authorized.check(item.authority, localItem, null), localItem);
    return localItem;
  });

const BasicLayout = (props) => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
  } = props;
  const menuDataRef = useRef([]);
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }, []);
  /** Init variables */

  const handleMenuCollapse = (payload) => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  return (
    <>
      <ProLayout
        logo={logo} // formatMessage={formatMessage}
        {...props}
        {...settings}
        title="Global Map"
        onCollapse={handleMenuCollapse}
        onMenuHeaderClick={() => history.push('/welcome')}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (
            menuItemProps.isUrl ||
            !menuItemProps.path ||
            location.pathname === menuItemProps.path
          ) {
            return defaultDom;
          }

          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        menuDataRender={menuDataRender}
        rightContentRender={() => <div style={{ color: '#fff' }}>右侧设置</div>}
        postMenuData={(menuData) => {
          menuDataRef.current = menuData || [];
          return menuData || [];
        }}
        contentStyle={{ margin: 16 }}
      >
        {children}
      </ProLayout>
    </>
  );
};

export default connect(({ global, settings }) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
