import React from "react";
import styled, { createGlobalStyle } from "styled-components";

import { CssBaseline } from "@material-ui/core";
const GlobalStyle = createGlobalStyle`
  html,
  body,
  #root {
    height: 100%;
  }

  body {
    background: ${props => props.theme.body.background};
  }
  `;

const Root = styled.div`
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  display: flex;
  background-color: white;
  min-height: 100%;
  `;

function Auth({ children }) {
  return (
    <Root>
      <CssBaseline />
      <GlobalStyle />
      {children}
    </Root>
  );
}

export default Auth;
