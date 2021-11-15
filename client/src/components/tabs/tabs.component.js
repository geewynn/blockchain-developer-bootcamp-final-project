import { useContext } from "react";
import { TabsContext } from "../../contexts/tabs-context"
import { TabWrapper } from "./tabs.style"


const Tabs = () => {
    const { handleProductOverview, productOverview,  handleRestaurantDetails, restaurantDetails,  handleProductDetails, productDetails, handleCustomerDetails, customerDetails } = useContext(TabsContext)

    return(
        <TabWrapper>
            <h3
                onClick={() => handleProductOverview(true)}
                style={{background: productOverview ? 'red' : 'none', color: productOverview ? '#fff' : ' #fff', transition: '0.5s'}}
                >Overview</h3>

            <h3
                onClick={() => handleCustomerDetails(true)}
                style={{background: customerDetails ? 'red' : 'none', color: customerDetails ? '#fff' : ' #fff', transition: '0.5s'}}
                >Customer</h3>

            <h3
                onClick={() => handleRestaurantDetails(true)}
                style={{background: restaurantDetails ? 'red' : 'none', color: restaurantDetails ? '#fff' : ' #fff', transition: '0.5s'}}
                >Restaurant</h3>

            <h3
                onClick={() => handleProductDetails(true)}
                style={{background: productDetails ? 'red' : 'none', color: productDetails ? '#fff' : ' #fff', transition: '0.5s'}}
                >Product</h3>
        </TabWrapper>
    )
}

export default Tabs