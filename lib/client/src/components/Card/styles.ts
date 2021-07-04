import styled, { css, DefaultTheme } from 'styled-components';
import { ArrowRight } from '@styled-icons/feather';

export const Wrapper = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    height: 13.3rem;
    width: 21rem;
    padding: ${theme.spacings.xxsmall};
    background: ${theme.colors.white};
    box-shadow: 0px 0px 4px rgba(51, 73, 77, 0.3);
    border-radius: ${theme.border.radius};
    overflow: hidden;
  `}
`;

export type ContentProps = {
  hasIcon: boolean;
  iconAlign: 'right' | 'center' | 'left';
};

const contentModifiers = {
  withIcon: (theme: DefaultTheme, align: ContentProps['iconAlign']) => css`
    > svg {
      width: 4rem;
      stroke-width: 2;
      color: ${theme.colors.primary};

      align-self: ${align === 'left'
        ? 'flex-start'
        : align === 'center'
        ? 'center'
        : 'flex-end'};
    }
  `
};

export const Content = styled.div<ContentProps>`
  ${({ theme, hasIcon, iconAlign }) => css`
    display: flex;
    flex-direction: column;
    padding: 0 ${theme.spacings.xxsmall};
    border-bottom: 0.1rem solid ${theme.colors.lightSilver};
    overflow: hidden;

    ${!!hasIcon && contentModifiers.withIcon(theme, iconAlign)};
  `}
`;

export const Text = styled.h1`
  ${({ theme }) => css`
    font-family: ${theme.font.inter};
    font-weight: ${theme.font.bold};
    font-size: ${theme.font.sizes.xlarge};
    color: ${theme.colors.primary};
    margin-bottom: ${theme.spacings.xxsmall};
  `}
`;

export const Description = styled.p`
  ${({ theme }) => css`
    font-family: ${theme.font.poppins};
    font-weight: ${theme.font.medium};
    font-size: ${theme.font.sizes.large};
    color: ${theme.colors.silver};
    margin-bottom: ${theme.spacings.xxsmall};
  `}
`;

export const Link = styled.a`
  ${({ theme }) => css`
    display: flex;
    justify-content: center;
    cursor: pointer;
    align-items: center;
    flex: 1;
    font-family: ${theme.font.poppins};
    font-style: ${theme.font.normal};
    font-weight: ${theme.font.normal};
    font-size: ${theme.font.sizes.large};
    color: ${theme.colors.primary};
    text-decoration: none;
  `}
`;

export const ArrowIcon = styled(ArrowRight)`
  ${({ theme }) => css`
    stroke-width: 2;
    width: ${theme.spacings.xsmall};
  `}
`;
