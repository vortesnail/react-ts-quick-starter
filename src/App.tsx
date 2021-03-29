import React from 'react';
import Header from 'Components/Header';
import './App.scss';

interface IProps {
  name: string;
  age: number;
}

function App(props: IProps) {
  const { name, age } = props;
  return (
    <div className='app'>
      <Header />
      <span>{`Hello! I'm ${name}, ${age} yearssss old.`}</span>
    </div>
  );
}

export default App;
