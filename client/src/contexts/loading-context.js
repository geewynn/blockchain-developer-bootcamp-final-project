import { useState, createContext } from "react";

export const LoadingContext = createContext()

const LoadingContextProvider = ({ children }) => {
    const [ isLoading, setIsLoading ] = useState(true);

    const setLoading = payload => {
        setIsLoading(payload)
    }

    return(
        <LoadingContext.Provider value={{ setLoading, isLoading }}>
            { children }
        </LoadingContext.Provider>

    )
}

export default LoadingContextProvider