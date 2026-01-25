import styled from 'styled-components';

const Title = styled.h1`
  font-family: 'Inter', sans-serif;
  font-weight: 100;
  font-size: 4rem;
  color: #fff;
  text-align: center;
  margin-top: 40vh;
  letter-spacing: -2px;
  mix-blend-mode: overlay;
`;

const Home = () => {
    return (
        <div>
            <Title>COSIÁMPIRA</Title>
        </div>
    );
};

export default Home;
