import styled, { css, DefaultTheme } from 'styled-components';

type WrapperProps = {
  isEmpty: boolean;
  disabled?: boolean;
  isHoliday?: boolean;
  isSchoolWeekend?: boolean;
  isWeekend?: boolean;
  message?: string;
};

const tooltip = (theme: DefaultTheme, message: string) => css`
  &:hover {
    &::before {
      content: '${message}';
      position: absolute;
      bottom: calc(100% + 1.2rem);
      background: ${theme.colors.lightSilver};
      width: max-content;
      font-size: 1.4rem;
      padding: 1rem;
      left: 0;
      border-radius: 0.5rem;
      box-shadow: 0 0 1.5rem rgba(0, 0, 0, 0.5);
      z-index: 1;
    }

    &::after {
      content: '';
      position: absolute;
      top: -100%;
      left: 0;
      width: 1.2rem;
      height: 1.2rem;
      background: ${theme.colors.lightSilver};
      transform: rotate(45deg) translateX(200%);
      z-index: 1;
    }
  }
`;

const wrapperModifiers = {
  empty: () => css`
    background: transparent;
  `,
  disabled: (theme: DefaultTheme) => css`
    background: transparent;
    color: ${theme.colors.lightGray};
    cursor: default;
  `,
  holiday: (theme: DefaultTheme) => css`
    background: ${theme.colors.red};
    color: ${theme.colors.white};
  `,
  schoolWeekend: (theme: DefaultTheme) => css`
    background: ${theme.colors.tertiary};
    color: ${theme.colors.white};
  `,
  weekend: (theme: DefaultTheme) => css`
    color: ${theme.colors.red};
  `
};

export const Wrapper = styled.td<WrapperProps>`
  ${({
    theme,
    isEmpty,
    disabled,
    isHoliday,
    isSchoolWeekend,
    isWeekend,
    message
  }) => css`
    position: relative;
    color: ${theme.colors.black};
    text-align: center;
    cursor: pointer;

    ${isEmpty && wrapperModifiers.empty}
    ${disabled && wrapperModifiers.disabled(theme)}
    ${isHoliday && wrapperModifiers.holiday(theme)}
    ${isSchoolWeekend && wrapperModifiers.schoolWeekend(theme)}
    ${!disabled &&
    !isSchoolWeekend &&
    isWeekend &&
    wrapperModifiers.weekend(theme)}

    ${!!message && tooltip(theme, message)}
  `}
`;

type DayButtonProps = {
  disabled?: boolean;
};
export const DayButton = styled.button<DayButtonProps>`
  ${({ disabled }) => css`
    background: transparent;
    border: none;
    outline: 0;
    font-family: sans-serif;
    font-size: 1.6rem;
    color: inherit;
    padding: 0.5rem;
    width: max-content;
    height: max-content;

    ${disabled &&
    css`
      cursor: default;
    `};
  `}
`;
