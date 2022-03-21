import { useState } from 'react';

import * as S from './styles';

type TabItem = {
  title: React.ReactChild;
  element: React.ReactElement;
};

type TabProps = {
  items: TabItem[];
};

const Tab = ({ items }: TabProps): JSX.Element => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <S.Wrapper>
      <S.Navigation>
        {items.map(({ title }, index) => (
          <S.NavItem
            key={title.toString()}
            active={index === currentIndex}
            onClick={() => setCurrentIndex(index)}
          >
            {title}
          </S.NavItem>
        ))}
      </S.Navigation>
      <S.Content>{items[currentIndex]?.element}</S.Content>
    </S.Wrapper>
  );
};

export default Tab;
