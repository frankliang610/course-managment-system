import Link from 'next/link';
import { Menu } from 'antd';
import { generateKey, getActiveKey } from '../utilities/sidebarNav/getFuncGenerators';
import { useUserType } from '../components/hooks/useLoginUserState';

export const getMenuConfig = (sideNav) => {
  const key = getActiveKey(sideNav);
  const defaultSelectedKeys = [key.split('/').pop()];
  const defaultOpenKeys = key.split('/').slice(0, -1);

  return { defaultSelectedKeys, defaultOpenKeys };
};

export const customizeMenuItems = (sideNav, parent = '') => {
  const userType = useUserType();

  const menuItemComponent = sideNav.map((item, index) => {
    const key = generateKey(item, index);

    if (item.subNav && item.subNav.length) {
      return (
        <Menu.SubMenu key={key} title={item.label} icon={item.icon}>
          {customizeMenuItems(item.subNav, item.path.join('/'))}
        </Menu.SubMenu>
      );
    } else {
      return (
        <Menu.Item key={key} title={item.label} icon={item.icon}>
          {item.path.length || item.label.toLocaleLowerCase() === 'overview' ? (
            <Link
              href={['/dashboard', userType, parent, ...item.path]
                .filter((item) => !!item)
                .join('/')}
              replace
            >
              {item.label}
            </Link>
          ) : (
            item.label
          )}
        </Menu.Item>
      );
    }
  });

  return menuItemComponent;
};
