import React from 'react';
import Title from './Title.jsx';
//Header组件里面继续使用Title组件
export default function Header() {
  return (
    <header>
      <Title />
    </header>
  );
}
