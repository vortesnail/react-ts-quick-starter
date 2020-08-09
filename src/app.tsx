import React from 'react'
import { add } from 'Utils/math'
import printInfo from 'Utils/info'

import ComputedOne from 'Components/ComputedOne'

function App() {
  return (
    <div className='app'>
      <ComputedOne a={5} b={6} />
      {add(1, 2)}
    </div>
  )
}

export default App
