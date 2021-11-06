import styled from "styled-components";

const ContentWrapper = styled.div`

  display: flex;
  flex-direction: column;
  // justify-content: flex-start;
  height: 60vh;
  width: 80vw;
  align-items: center;
  
  h2 {
    margin-bottom: 5vh;
    color:  #131a35;
    opacity: 0.7;
  }
`


const DappContentWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  // align-items: flex-start;


 

  span {
    width: 60%;
    background: #000;
    height: 4px;
    border-radius: 5px;
  }

`

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 200px;
  
  box-sizing: border-box;

  input {
    box-sizing: border-box;
    border-radius: 5px;
    padding: 10px 10px;
    margin-bottom: 10px;
    display: block;
    font-size: 18px;
    width: 100%;
  }
  
  button {
    width: 100%;
    border-radius: 5px;
    padding: 10px 10px;
    cursor: pointer;
    color: #eee;
    font-size: 20px;
    background: #131a35;
    opacity: 0.8;
  }

`




const OverviewWrapper = styled.div`
  display: flex;
  box-sizing: border-box;
  width: 35%;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  background: #eee;
  opacity: 0.8;
  
  // margin-top: 1vh ;
  padding: 20px;
  border-radius: 5px;
  
  color: #131a35;
  
  &:hover {
    transform: scale(1.01);
    transition: 0.5s;
  }
  h3 {
  
  }
  
  p {
    display: flex;
    width: 80%;

    border: 1px solid #131a35;
    color: #131a35;
    padding: 10px 20px;
    justify-content: space-between;
    border-radius: 5px;
    margin-top: 0;
  }

`




const ProductWrapper = styled.div`
  display: flex;

  flex-direction: column;
  justify-content: flex-start;
  
  box-sizing: border-box;

  input {
    box-sizing: border-box;
    border-radius: 5px;
    padding: 10px 10px;
    margin-bottom: 10px;
    display: block;
    font-size: 18px;
    width: 100%;
  }
  
  button {
    width: 100%;
    border-radius: 5px;
    padding: 10px 10px;
    cursor: pointer;
    color: #eee;
    font-size: 20px;
    background: #131a35;
    opacity: 0.8;
  }

`

const ToolTip = styled.span`
  background: transparent;
  color: #fff;
  padding: 0;

`



export { ContentWrapper, DappContentWrapper, InputWrapper, OverviewWrapper, ProductWrapper, ToolTip }