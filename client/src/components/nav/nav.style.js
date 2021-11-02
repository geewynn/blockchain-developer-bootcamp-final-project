import styled from "styled-components";

const NavBarWrapper = styled.nav`
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  margin-bottom: 5vh;

  align-items: center;
  min-width: 100vw;
  height: 10vh;

  // border-bottom: 1px solid #736598;

  background: #131a35;
  // background: #6ffbff;
  
  // background: #ff72f9;
  // background: #6868fc;
  // background: #5ac4be;

  // color: #5ac4be;



  @media(max-width: 600px) {
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    height: ${({ toggleNav }) => toggleNav ? '30vh' : '10vh'};

    // height: 40vh;
  }

  @media(max-width: 122px) {
    width: 100%;
  }
  

`

  

const Logo = styled.h1`
  
  a {
    // color: #eee;
    color: #6ffbff;
    letter-spacing: 2px;
    // color: #5ac4be;
    text-decoration: none;
    margin-left: 50px;
    font-size: 30px;
  

  @media(max-width: 600px) {
    transition: .5s ease-in;
    width: 100%;
    margin-left: 0;
    padding-top: 150px;

  }

  @media(max-width: 500px) {
    font-size: 25px;
    margin-left: 0;
  }
`

const Hamburger = styled.a`
  position: absolute;
  top: 4vh;
  right: 5vh;
  display: none;
  flex-direction: column;
  justify-content: space-between;
  height: 21px;
  width: 30px;
  cursor: pointer;

  @media(max-width: 600px) {
    top: 3.5vh;
    right: 2vh;
    display: flex;
  }


  @media(max-width: 300px) {
    width: 20px;
    heigth: 8px;
  }

  span {
    height: 3px;
    width: 100%;
    background: #5ac4be;
    border-radius: 10px;
  }

`


const NavBarItems = styled.div`
  ul{
    padding: 50px;
    display: flex;
    align-items: center;
    list-style: none;

    @media(max-width: 600px) {
      flex-direction: column;
      display:  ${({ toggleNav }) => toggleNav ? 'flex' : 'none'};

      width: 100%;
      margin-bottom: 20px;

    }
      
    a {

      text-decoration: none;
      margin-right: 70px;
      list-style: none;
      font-size: 25px;
      font-weight: light;
      // color: #eee;
      color:  #5ac4be;
      cursor: pointer;
      transition: 0.3s ease-in;
      
      @media (max-width: 600px) {
        transition: .3s ease-in;
        text-align: center;

        width: 100%;
      }

    button {
      
      margin-right: 70px;
      background: red;
      font-size: 25px;
      font-weight: light;
      // color: #eee;
      color:  #5ac4be;
      cursor: pointer;
      transition: 0.3s ease-in;
      
      @media (max-width: 600px) {
        transition: .3s ease-in;
        text-align: center;

        width: 100%;
      }
    }



      @media(max-width: 500px) {
        text-align: center;
        font-size: 23px;
      }


      @media(max-width: 700px) {
        margin-right: 10px;
      
      }
      
      &:hover {
        border-bottom: 2px solid red;
      }

    }
  }

 

`

const ConnectWallet = styled.button`
  margin-right: 70px;
  background: transparent;
  // border: 1px solid #9f5afd;
  border: 1px solid #d5b8ff;
  padding: 10px 20px;
  border-radius: 5px;

  font-size: 25px;
  font-weight: light;
  color: #eee;
  cursor: pointer;
  transition: 0.3s ease-in;

  &:hover {
    color: #d5b8ff;
  }

  @media (max-width: 600px) {
    transition: .3s ease-in;
    text-align: center;

    width: 100%;
  }

}


`


export { NavBarWrapper, Logo, NavBarItems, Hamburger, ConnectWallet } 