import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

export const Wrapper = styled.section`
  position: relative;
  width: 100%;
`;

export const ItemsContainer = styled.div`
  display: flex;
  flex: 1;
`;

export const Item = styled(motion.div)`
  flex: 1;
  border-radius: 5px;
  width: 100%;
`;

export const SectionButtons = styled.div`
  ${({ theme }) => css`
    margin-top: ${theme.spacings.small};
    display: flex;
    justify-content: flex-end;

    button {
      width: 17.1rem;
      height: 4.6rem;

      & + button {
        margin-left: ${theme.spacings.xsmall};
      }
    }
  `}
`;
