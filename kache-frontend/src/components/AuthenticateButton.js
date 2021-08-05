import { useAuth0 } from '@auth0/auth0-react'
import styled from 'styled-components'

const AuthButtonWrapper = styled.button`
  background: ${props => props.theme.coloursHex.secondaryLight};
  border: none;
  border-radius: 13px;
  padding: 10px 15px;
  font-weight: normal;
  color: white;
  cursor: pointer;
  width: 100px;
`

export default function AuthenticationButton() {
  
  const { isAuthenticated } = useAuth0();
  const { loginWithRedirect } = useAuth0();
  const { logout } = useAuth0();
  
  console.log(useAuth0());
  
  if (isAuthenticated) {
    return (
      <AuthButtonWrapper onClick={() => logout({
        returnTo: window.location.origin
      })}>Log Out</AuthButtonWrapper>
    )
    
  } else {
   return (
     <AuthButtonWrapper onClick={() => loginWithRedirect()}>Log In</AuthButtonWrapper>
   )
  }
}