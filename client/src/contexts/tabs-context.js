import { useState, createContext } from 'react'


export const TabsContext = createContext()


const TabsContextProvider = ({ children }) => {
    const [productOverview, setProductOverview] = useState(true)
    const [restaurantDetails, setRestaurantDetails] = useState(false)
    const [productDetails, setProductDetails] = useState(false)
    const [customerDetails, setCustomerDetails] = useState(false)

    const handleProductOverview = () => {
        setProductOverview(true)
        setRestaurantDetails(false)
        setProductDetails(false)
        setCustomerDetails(false)
    }

    const handleRestaurantDetails = () => {
        setRestaurantDetails(true)
        setProductOverview(false)
        setProductDetails(false)
        setCustomerDetails(false)
    }


    const handleProductDetails = () => {
        setProductDetails(true)
        setProductOverview(false)
        setRestaurantDetails(false)
        setCustomerDetails(false)
    }


    const handleCustomerDetails = () => {
        setCustomerDetails(true)
        setProductDetails(false)
        setProductOverview(false)
        setRestaurantDetails(false)
    }

    return(
        <TabsContext.Provider value={{
            handleProductOverview,
            productOverview,
            handleRestaurantDetails,
            restaurantDetails,
            handleProductDetails,
            productDetails,
            handleCustomerDetails,
            customerDetails
        }}
        >
            { children }
        </TabsContext.Provider>
    )
}

export default TabsContextProvider