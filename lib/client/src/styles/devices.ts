import { generateMedia } from 'styled-media-query';

export const sizes = {
  mobileS: '320px',
  mobileM: '375px',
  mobileL: '425px',
  tabletS: '575px',
  tablet: '768px',
  tabletL: '1000px',
  laptop: '1024px',
  laptopM: '1250px',
  laptopL: '1440px',
  desktop: '2560px'
};

export const customMedia = generateMedia(sizes);
