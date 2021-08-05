import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Puff, useLoading } from '@agney/react-loading';
import styled from 'styled-components';
import theme from '../styles/theme';

// A custom hook that builds on useLocation to parse
// the query string for you.
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};


const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatusContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
`

const IndicatorContainer = styled.div`
  display: block;
  color: ${theme.coloursHex.secondaryLight};
  width: 100px;
`;


const onboardUser = async (code, userId) => {
  const reqOptions = {
    method: 'POST',
    body: JSON.stringify({ code, userId }),
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const res = await fetch(`${process.env.REACT_APP_ENDPOINT_URL}/myob-auth`, reqOptions);

  if (res.status === 200) return true;

  console.error(res);
  return false;
};

const OnboardingPage = () => {
  const loadingProp = {
    loading: true,
    indicator: <Puff />
  }
  const { containerProps, indicatorEl } = useLoading(loadingProp);

  const query = useQuery();
  const history = useHistory();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessCode = query.get('code');
    const userId = query.get('state');

    if (accessCode && userId) {
      onboardUser(accessCode, userId).then(() => {
        setTimeout(() => {
          setLoading(false);
        }, 3000);

        history.push('/');
      });
    } else {
      history.push('/');
    }
  }, []);


  return (
    <Container>
      {loading && (
        <StatusContainer>
        <IndicatorContainer>
          {indicatorEl}
        </IndicatorContainer>
          <br />
          <p>Setting up MYOB Crypto Wallet...</p>
        </StatusContainer>
      )}
    </Container>
  );
};

export default OnboardingPage;
