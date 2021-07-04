import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  ${({ theme }) => css`
    .DayPickerInput {
      width: 100%;
    }

    .DayPickerInput-Overlay {
      border-radius: 0.3rem;
    }

    .DayPicker {
      font-size: 1.4rem !important;

      .DayPicker-Day--selected:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside) {
        background-color: ${theme.colors.primary};
        color: #f0f8ff;
      }

      .DayPicker-Month {
        border-collapse: separate;
        table-layout: fixed;
        width: 100%;
      }

      .DayPicker-Day.DayPicker-Day--today {
        color: ${theme.colors.secondary};
      }

      .DayPicker-Day:not(.DayPicker-Day--today).DayPicker-Day--disabled {
        color: ${theme.colors.lightGray};
      }

      .DayPicker-wrapper {
        width: 31rem !important;
      }

      .DayPicker-Day,
      .DayPicker-Weekday {
        width: 38px;
        height: 38px;
      }
    }
  `}
`;
