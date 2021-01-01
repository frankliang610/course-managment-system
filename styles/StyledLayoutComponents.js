import styled from 'styled-components';
import { Layout, Typography } from 'antd';

const { Header, Content } = Layout;
const { Title } = Typography;

export const StyledLayout = styled(Layout)`
  height: 100vh;
`;

export const StyledContentLayout = styled(Layout)`
  background: #fff;
  overflow: hidden;
`;

export const StyledTitle = styled(Title)`
  color: whitesmoke !important;
  margin-bottom: 0 !important;
`;

export const StyledContentHeader = styled(Header)`
  display: flex;
  justify-content: space-between;
  padding: 0;
`;

export const StyledContent = styled(Content)`
  background-color: #fff;
  padding: 16px;
  min-height: auto;
`;

export const StyledBrandIcon = styled.div`
  background: rgba(255, 255, 255, 0.3);
  text-align: center;
  min-height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledIcon = styled.div`
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
  color: whitesmoke;
  &:hover {
    color: #b0e5ec;
  }
`;
