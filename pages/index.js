import React from 'react';
import { useLoginUserState } from '../components/hooks/useLoginUserState';

export default function Home() {
  useLoginUserState();
  return <></>;
}
