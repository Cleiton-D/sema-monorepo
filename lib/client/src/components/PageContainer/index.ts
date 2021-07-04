import styled from 'styled-components';
import { generateMedia } from 'styled-media-query';

const customMedia = generateMedia({
  small: '576px',
  medium: '768px',
  large: '992px',
  huge: '1200px'
});

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;

  ${customMedia.greaterThan('small')`
    max-width: 54rem;
  `}

  ${customMedia.greaterThan('medium')`
    max-width: 72rem;
  `}

  ${customMedia.greaterThan('large')`
    max-width: 110rem;
  `}

  ${customMedia.greaterThan('huge')`
    max-width: 110rem;
  `}
`;

export default PageContainer;
