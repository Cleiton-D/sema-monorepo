import { AnimatePresence } from 'framer-motion';

import * as S from './styles';

type AnimatedSectionProps = {
  children: React.ReactNode;
};

const AnimatedSection = ({ children }: AnimatedSectionProps) => {
  return (
    <S.Wrapper>
      <AnimatePresence>{children}</AnimatePresence>
    </S.Wrapper>
  );
};

export default AnimatedSection;
