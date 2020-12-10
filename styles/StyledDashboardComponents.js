import styled from 'styled-components';
import { Input } from 'antd';

const { Search } = Input;

export const StyledATag = styled.a`
  margin-right: 8px;
`;

export const StyledSearchBar = styled(Search)`
  width: 30%;
  margin-bottom: 15px;
`;

export const SearchBarAndNewButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
