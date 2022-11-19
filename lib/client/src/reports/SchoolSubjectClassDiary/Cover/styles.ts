import styled from 'styled-components';

export const Wrapper = styled.div`
  display: grid;
  grid-template-rows: 41mm 2mm 2mm 39mm 1fr 20mm;
  height: 100%;
  border: 4px double #000;
`;

export const Header = styled.header`
  > span,
  h1 {
    display: block;
    text-transform: uppercase;
    text-align: center;
  }

  > span {
    font-size: 1.4rem;
  }

  > h1 {
    margin-top: 5mm;
    font-size: 3rem;
  }
`;

export const Empty = styled.article`
  border-top: 4px double #000;
  padding: 1mm 0;
`;

export const InstitutionSection = styled.article`
  border-top: 4px double #000;
  padding: 1mm 0;

  > span {
    display: block;
    text-align: center;
  }
`;

export const Detail = styled.article`
  border-top: 4px double #000;
  padding: 1mm 3mm;

  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-evenly;

  > span {
    font-size: 2.5rem;
  }
`;

export const Footer = styled.footer`
  border-top: 4px double #000;
  padding: 1mm 0;

  > span {
    display: block;
    text-align: center;
  }
`;
