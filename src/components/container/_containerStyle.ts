import styled, { css } from 'styled-components'
import { marginStyle, MarginProps, PaddingProps, paddingStyle } from 'Consts/sizing'

interface StyledContainerProps extends MarginProps, PaddingProps {
  page?: boolean
}

export const StyledContainer = styled.div<StyledContainerProps>`
  ${({ page }) => {
    if (page)
      return css`
        padding: 50.67px 0 70px 0;
      `
    return css`
      padding: 0 16px;
    `
  }}
  ${marginStyle}
  ${paddingStyle}
`
