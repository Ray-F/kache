import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Loader from 'react-loader-spinner';

// A custom hook that builds on useLocation to parse
// the query string for you.
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};


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
  const query = useQuery();
  const history = useHistory();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessCode = query.get('code');
    const userId = query.get('state');

    if (accessCode && userId) {
      onboardUser(accessCode, userId).then(() => {
        setLoading(false);
        history.push('/')
      });
    } else {
      history.push('/');
    }
  }, []);


  return (
    <div>
      {loading && (<><p>Onboarding user account...</p><Loader type={'ThreeDots'} /></>)}
    </div>
  );
};

export default OnboardingPage;
