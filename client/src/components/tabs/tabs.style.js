import styled from "styled-components";

const TabWrapper = styled.div`
  margin-top: -10vh;
  display: flex;
  
  transition: 0.5s ease-in-out;
  justify-content: space-between;
  align-items: center;
  // background: #1112;
  background: #131a35;
  opacity: 0.9;
  // color: #6ffbff;
  

  overflow: hidden;

  width: 100%;
  height: 8vh;


  margin-bottom: 10vh;
  
  h3 {
    cursor: pointer;
    padding: 30px 150px;
    // text-wrap: none;
    text-align: center;
    height: 5vh;
    
  }



`


export { TabWrapper }