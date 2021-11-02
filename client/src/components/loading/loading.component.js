
import { LoadingWrapper } from "./loading.style";
import BarLoader from "react-spinners/BarLoader"



const Loading = () => {

  return (
    <LoadingWrapper>
     <BarLoader color='purple' height={25} /> 
    </LoadingWrapper>
  )
}

export default Loading

