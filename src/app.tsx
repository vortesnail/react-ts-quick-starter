import React from 'react'
import Header from 'Components/Header'
import { add } from 'Utils/math'

interface IProps {
  name: string
  age: number
}

function App(props: IProps) {
  const { name, age } = props
  return (
    <div className='app'>
      <Header title='Typescript' />
      <span>{`Hello! I'm ${name}, ${age} years old.`}</span>
      <p>{add(1, 2)}</p>
    </div>
  )
}

export default App
