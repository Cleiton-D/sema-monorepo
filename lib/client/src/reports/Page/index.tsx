import { useRef } from 'react';

import * as S from './styles';

type PageProps = {
  orientation?: 'landscape' | 'portrait';
  children: React.ReactNode;
};
const Page = ({ children, orientation }: PageProps) => {
  const wrapperRef = useRef<HTMLElement>(null);

  return (
    // <div
    //   style={{
    //     width: `210mm`,
    //     height: `296mm`,
    //     ...(orientation === 'landscape' ? { overflow: 'hidden' } : {})
    //   }}
    // >
    // </div>
    (<S.Wrapper orientation={orientation} ref={wrapperRef}>
      {children}
    </S.Wrapper>)
  );
};

export default Page;
