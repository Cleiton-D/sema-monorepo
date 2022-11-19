import styled from 'styled-components';

import SectionContent from 'components/SectionContent';

export const TableSection = styled(SectionContent)`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 1rem;
`;

export const StudentName = styled.span`
  display: block;
  min-width: max-content;
`;
