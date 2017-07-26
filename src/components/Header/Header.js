import React from 'react'
import { IndexLink, Link } from 'react-router'
import './Header.scss'

export const Header = () => (
  <div>
    <h1>GRE Your Vocab</h1>
    <IndexLink to='/' activeClassName='route--active'>
      Home
    </IndexLink>
    {' · '}
    <Link to='/self-report' activeClassName='route--active'>
      Self-Report Test
    </Link>
  </div>
)

export default Header
