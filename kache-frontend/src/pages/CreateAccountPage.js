import React from 'react';

const demoAccount = {
  name: 'Raymond Feng',
  email: 'rfen629@aucklanduni.ac.nz',
  wallets: [
    {
      type: 'ETHEREUM',
      address: '0xc4B7faE9ea8bEc3F1966Db6c89F404173D5398ea',
    },
  ],
  companyFileMyobId: 'ec8619d9-bb20-4aae-9bbf-1e0e508bb58a',
};

const createAccount = async (account) => {
  const reqOptions = {
    method: 'POST',
    body: JSON.stringify(account),
    headers: {
      'Content-Type': 'application/json',
    }
  };
  const res = await fetch(`${process.env.REACT_APP_ENDPOINT_URL}/onboard-unlinked`, reqOptions);

  const data = await res.json();
  if (Math.floor(data.status / 100)) {
    window.location = data.payload.myobOAuthRedirect;
  }
};

const CreateAccountPage = () => {

  return (
    <div>
      <p>Create your account here!</p>
      <button onClick={() => createAccount(demoAccount)}>Click me to create a default account</button>
    </div>
  );
};

export default CreateAccountPage;
