import { useState, createContext } from 'react'


export const TabsContext = createContext()


const TabsContextProvider = ({ children }) => {
    const [productOverview, setProductOverview] = useState(true)
    const [RestaurantDetails, setRestaurantDetails] = useState(false)
    const [productDetails, setProductDetails] = useState(false)

    const handleProductOverview = () => {
        setProductOverview(true)
        setRestaurantDetails(false)
        setProductDetails(false)
    }

    const handleRestaurantDetails = () => {
        setRestaurantDetails(true)
        setProductOverview(false)
        setProductDetails(false)
    }


    const handleProductDetails = () => {
        setProductDetails(true)
        setProductOverview(false)
        setRestaurantDetails(true)
    }

    return(
        <TabsContext.Provider value={{
            handleProductOverview,
            productOverview,
            handleRestaurantDetails,
            RestaurantDetails,
            handleProductDetails,
            productDetails,
        }}
        >
            { children }
        </TabsContext.Provider>
    )
}

export default TabsContextProvider