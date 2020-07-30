import React from 'react'
import './index.scss'

interface IProps {
  title: string
}

function Header(props: IProps) {
  const { title } = props
  return <p className='header'>{`Hi, ${title}.`}</p>
}

export default Header
