import { useContext, useState } from "react";
import { Link } from 'react-router-dom'
import { AccountContext } from '../contexts/account-context'
import { NavBarWrapper, NavBarItems, Logo, Hamburger, ConnectWallet } from './nav.style'


const Navbar = () => {
    const { web3Account } = useContext(AccountContext)
    const [toggleNav, setToggleNav] = useState(false)
  
    const handleToggle = () => setToggleNav(prev => !prev)
  
    return (
      <NavBarWrapper toggleNav={ toggleNav }>
        <Logo>
          <Link to='/'>SupplyChainDapp</Link>
        </Logo>
        <Hamburger  onClick={()  => {
          setToggleNav(prev => !prev)}
        }>
          <span></span>
          <span></span>
          <span></span>
        </Hamburger >
        <NavBarItems toggleNav={ handleToggle }>
          <ul >
            { web3Account ?  
            <a 
              href={`https://rinkeby.etherscan.io/address/${web3Account}`}
              target="_blank"
              rel="noopener noreferrer"
            >{ `${web3Account.substring(0, 10)}` }</a> : null }
  
            { !web3Account ? <ConnectWallet>Connect Wallet </ConnectWallet> : null }
          </ul>
        </NavBarItems>
  
       
      </NavBarWrapper>
    )
  
  
  }
  
  export default Navbar
  