import React from 'react';

import styled from 'styled-components';

const H1 = styled.h1`
  color: #00dbb5;
  font-size: 4rem;

  line-height: 0.1rem;
`;

const Container = styled.div`
  width: 100vw;
  height: calc(100vh);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  display: block;
  line-height: 1.5rem;
  color: white;
`;

const PdfButton = styled.a`
  display: inline-block;
  margin-top: 20px;
  border: 1px solid white;
  border-radius: 5px;
  
  color: white;
  
  padding: 10px;
`;

export default function IndexPage() {
  return (
    <Container>
      <Content>
        <H1>kache.app</H1>
        <p>We make receiving cryptoasset tax <i><b>easy</b></i><br /> on the MYOB platform</p>

        <PdfButton href={'https://drive.google.com/file/d/1HfgdNIFBwm-1BwDNWlEjLK30eq0Q4znL/view?usp=sharing'}>View 1 page summary</PdfButton>
      </Content>
    </Container>
  );
}
