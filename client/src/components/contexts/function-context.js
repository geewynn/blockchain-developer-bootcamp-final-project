import { useState, createContext } from "react";

export const FunctionContext = createContext()

const FunctionContextProvider = ({ children }) => {
    const [contract, setContract] = useState('')

    const setContractInstance = payload => {
        setContract(payload)
    }

    return(
        <FunctionContext.Provider value={{ contract, setContractInstance }}>
            { children }
        </FunctionContext.Provider>

    )
}

export default FunctionContextProvider