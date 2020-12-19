import styled from 'styled-components';
import { Typography, Col, Avatar, Tag } from 'antd';

const { Title, Text } = Typography;

export const StyledInnerCol = styled(Col)`
  text-align: center;
  display: flex;
  flex-direction: column;
`;

export const StyledAvatar = styled(Avatar)`
  width: 100px;
  height: 100px;
  display: block;
  margin: auto;
`;

export const StyledTitle = styled(Title)`
  color: blueviolet !important;
  margin-top: 20px;
`;

export const StyledText = styled(Text)`
  margin-right: 16px;
  min-width: 160px;
  display: inline-block;
`;

export const StyledTag = styled(Tag)`
  min-width: 45px;
  padding: 12px;
  display: inline-block;
  color: blueviolet;
  text-align: center;
  font-size: large;
  font-weight: 700;
  border: 1px solid blueviolet;
`;
