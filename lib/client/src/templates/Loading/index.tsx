import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

import Base from 'templates/Base';

import loading from 'assets/images/loading.json';

import * as S from './styles';

const Loading = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const startAnimation = () => {
    const container = containerRef.current;
    if (!container) return undefined;

    return lottie.loadAnimation({
      container,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: loading,
      rendererSettings: {
        viewBoxOnly: true
      }
    });
  };

  useEffect(() => {
    const animation = startAnimation();

    return () => {
      if (animation) animation.destroy();
    };
  }, []);

  return (
    <Base>
      <S.Wrapper ref={containerRef} />
    </Base>
  );
};

export default Loading;
