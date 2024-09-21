import React, { useContext } from 'react'
import Navbar from '../components/Navbar'
import NotLoginHeader from '../components/NotLoginHeader'
import { UserContext } from '../../Context/UserContext'

const Home = () => {
  const{user} = useContext(UserContext)
  return (
    <div>
        {
          user===null && <NotLoginHeader />
        }
    </div>
  )
}

export default Home