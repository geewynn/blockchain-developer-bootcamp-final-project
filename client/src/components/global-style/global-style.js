import styled, { createGlobalStyle } from 'styled-components'


const GlobalStyle = createGlobalStyle`

  body {
    margin: 0;
    padding: 0;

    font-family: 'Poppins', sans-serif;
  }
`


const RootInterface = styled.div`
  width: 100vw;
  height: 100vh;
  background: #131a35;
  overflow-x: hidden;

`

export { GlobalStyle, RootInterface }

