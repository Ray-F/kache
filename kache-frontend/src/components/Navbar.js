
import styled from 'styled-components';
import AuthenticationButton from './AuthenticateButton'
import AccountButton from './AccountButton'

const NavContainer = styled.div`
  width: 100vw;
  height: 80px;
  
  background: ${props => props.theme.coloursHex.primaryDark};

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  
  h2 {
    color: ${props => props.theme.coloursHex.secondaryLight};
    padding-left: 50px;
    font-size: 40px;
    font-weight: bold;
    padding-bottom: 5px;
  }
`

const NavList = styled.ul`
  
  padding-right: 50px;
  list-style: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  
  color: white;
  font-weight: bold;
  
  
  
  li {
    padding: 0 25px;
    text-align: right;
    
    > p {
      cursor: pointer;
    }
    
    transition: all 0.3s ease;

    :hover {
      transform: scale(1.075);
    }
    
  }
  
  
  

`

export default function Navbar() {
  
  
  return (
  <NavContainer>
    <h2>kache.</h2>
    <NavList>
      <li><p>About</p></li>
      <li><p>Fees</p></li>
      <li><AuthenticationButton /></li>
      <li><AccountButton /></li>
    </NavList>
  </NavContainer>
  )
}