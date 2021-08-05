import { useAuth0 } from '@auth0/auth0-react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const ProfileImageWrapper = styled.div`
  
  height: 40px;
  width: 40px;
  cursor: default;
`

const ProfileImage = styled.img`
  
  height: 100%;
  
  border-radius: 100%;

`

export default function AccountButton() {
  
  const { user } = useAuth0();
  
  const { isAuthenticated } = useAuth0();
  
  console.log(isAuthenticated);
  
  if (isAuthenticated) {
  
    
    const { name, picture, email} = user;
    
    return (
      <ProfileImageWrapper>
        <Link to="/profile">
          <ProfileImage
            src={picture}
            alt="Profile"
            className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
          />
        </Link>
      </ProfileImageWrapper>
      
    )
  } else {
    return (<ProfileImageWrapper noButton />)
  }
  
}