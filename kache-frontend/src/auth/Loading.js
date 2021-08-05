import styled from 'styled-components'
import { useLoading, Puff } from '@agney/react-loading';


const LoadingPage = styled.div`

  background: ${props => props.theme.coloursHex.primaryLight};
  
  width: 100vw;
  height: 100vh;
  
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  & > svg {
    
    width: 110px;
    height: 110px;
    stroke: black;
    fill: black;
  
  }
  
}
  
`

export default function Loading() {
  
  const { containerProps, indicatorEl } = useLoading({
    loading: true,
    indicator: <Puff/>,
  });
  
  
  return (
  <LoadingPage {...containerProps}>
    {indicatorEl} {/* renders only while loading */}
  </LoadingPage>
  )
  
}