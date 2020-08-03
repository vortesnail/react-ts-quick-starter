import React from 'react'
import Header from 'Components/Header'
import { add } from 'Utils/math'

interface IProps {
  name: string
  age: number
  sex?: string
}

function App(props: IProps) {
  const { name, age, sex } = props

  return (
    <div className='app'>
      <Header title='Typescript' />
      <span>{`Hello! I'm ${name}, sex is ${sex}, ${age} years old.`}</span>
      <p>{add(1, 2)}</p>
    </div>
  )
}

App.defaultProps = {
  sex: 'male',
}

export default App
