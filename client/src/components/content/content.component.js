import { useState, useContext } from 'react'
import { AccountContext } from '../contexts/account-context'
import { FunctionContext } from '../contexts/function-context'
import { TabsContext } from '../contexts/tabs-context'
import Tabs from '../tabs/tabs.component'


import { ContentWrapper, DappContentWrapper, InputWrapper, OverviewWrapper, ProductWrapper, ToolTip } from './content.style'
import { toWei, fromWei } from '../utils/conversion'


const Content = () => {
    const { productOverview, restaurantDetails, productDetails } = useContext(TabsContext)
    const [restaurantResult, setRestaurantResult] = useState('')
    const [productResult, setProductResult] = useState('')

    const { itemSKU, originRestaurantName,originRestaurantInfo, originRestaurantID, ownerID } = restaurantResult
    const { productPrice, productNotes: fetchedProductNotes, status, dispatcherID, consumerID } = productResult

    const { contract } = useContext(FunctionContext)
    const { web3Account } = useContext(AccountContext)
    const [sku, setSKU] = useState('')

    const initialRestaurantState = {
        SKU: '',
        address: ''
    }

    const [tokenId1, setTokenId1] = useState('')


    /* Handle Add Restuarant ************************ */
    const [restaurant, setRestaurant] = useState(initialRestaurantState)
    const handleAddRestaurantChange = e => {
        const { name, value } = e.target
        setRestaurant(prev => ({...prev, [name]: value}))
    }
    
        
    const addRestaurantAccount  = async () => {
        try {
        await contract.methods.addRestaurantAccount(restaurant.SKU, restaurant.address).send({from: web3Account})

        } catch(err) {
        console.log(err)
        }
    }


    /* Handle Add Consumer ************************ */
    const initialConsumerState = {
        SKU: '',
        address: ''
    }

    const [consumer, setConsumer] = useState(initialConsumerState)
    const handleAddConsumerChange = e => {
        const { name, value } = e.target
        setRestaurant(prev => ({...prev, [name]: value}))
    }
   
    const addConsumerAccount  = async () => {
        try {
        await contract.methods.enableConsumerAccount(consumer.SKU, consumer.address).send({from: web3Account})

        } catch(err) {
        console.log(err)
        }
    }


    /* Handle Order Item ************************ */
    const [orderSKU, setOrderSKU] = useState('')

    const handleOrder  = async () => {
        try {
        const fetchedRestaurantDetails = await contract.methods.OrderItem(orderSKU).send({from: web3Account})
        console.log('fetched details', fetchedRestaurantDetails)
        setRestaurantResult(fetchedRestaurantDetails)

        } catch(err) {
        console.log(err)
        }
    }


    /* Handle Pay for Item ************************ */
    const initialPayState = {
        SKU: '', 
        price: ''
    }
    const [paySKU, setPaySKU] = useState(initialPayState)

    const handlePayChange = e => {
        const { name, value } = e.target
        setPaySKU(prev => ({...prev, [name]: value}))
    }

    const handlePay = async () => {
        try {
        await contract.methods.PayForItem(paySKU.SKU).send({from: web3Account, value: toWei(paySKU.price)})
        } catch(err) {
        console.log(err)
        }
    }

    const initialCookState = {
        restaurantName: '',
        restaurantInfo: '',
        productNotes: ''
    }

    /* Handle Receive Order ************************ */
    const [receiveSKU, setReceiveSKU] = useState('')

    const handleReceive  = async () => {
        try {
        const receiveOrder = await contract.methods.ReceiveOrder(receiveSKU).send({from: web3Account})
        console.log('restaurant received order', receiveOrder)
        setRestaurantResult(receiveOrder)

        } catch(err) {
        console.log(err)
        }
    }


    /* Handle Cooking ************************ */
    const [cookData, setCookData] = useState(initialCookState)
    const { restaurantName, restaurantInfo, productNotes } = cookData

    const handleChange = e => {
        const { value, name } = e.target
        setCookData(prev => ({...prev, [name]: value}))
    }

    const handleCook = async() => {
        try {
        await contract.methods.CookOrder(restaurantName, restaurantInfo, productNotes).send({ from: web3Account })
        setCookData(initialRestaurantState)
    
        } catch(err) {
        console.log(err)
        }
    }
    
    // overview
    const handleOverview = async () => {
        try {
        const fetchedRestaurantDetails = await contract.methods.fetchRestaurantDetails(sku).call()
        const fetchedProductDetails = await contract.methods.fetchProductDetails(sku).call()
        console.log('fetched details', fetchedRestaurantDetails)
        setRestaurantResult(fetchedRestaurantDetails)
        setProductResult(fetchedProductDetails)
        

        } catch(err) {
        console.log(err)
        }
    }

    /* Handle Process Item ************************ */
    const [processSKU, setProcessSKU] = useState('')
    
    const handleProcess  = async () => {
        try {
        const fetchedRestaurantDetails = await contract.methods.ProcessOrder(processSKU).send({from: web3Account})
        console.log('fetched details', fetchedRestaurantDetails)
        setRestaurantResult(fetchedRestaurantDetails)

        } catch(err) {
        console.log(err)
        }
    }


    
    /* Handle Pack Item ************************ */
    const [packSKU, setPackSKU] = useState('')

    const handlePack  = async () => {
        try {
        const fetchedRestaurantDetails = await contract.methods.PackageOrder(packSKU).send({from: web3Account})
        console.log('fetched details', fetchedRestaurantDetails)
        setRestaurantResult(fetchedRestaurantDetails)

        } catch(err) {
        console.log(err)
        }
    }


    /* Handle Dipatch Item ************************ */
    const [dispatchSKU, setDispatchSKU] = useState('')

    const handleDispatch  = async () => {
        try {
        const fetchedRestaurantDetails = await contract.methods.DispatchOrder(dispatchSKU).send({from: web3Account})
        console.log('fetched details', fetchedRestaurantDetails)
        setRestaurantResult(fetchedRestaurantDetails)

        } catch(err) {
        console.log(err)
        }
    }


    /* Handle Add Dispatcher ************************ */
    const initialDispatcherState = {
        SKU: '',
        address: ''
    }

    const [dispatcher, setDispatcher] = useState(initialDispatcherState)

    const handleDispatcherChange = e => {
        const { name, value } = e.target
        setDispatcher(prev => ({...prev, [name]: value}))
    }
    
    const addDispatcherAccount  = async () => {
        try {
        const result = await contract.methods.enableDisapatcherAccount(dispatcher.SKU, dispatcher.address).send({from: web3Account})
        console.log('result here', result)

        } catch(err) {
        console.log(err)
        }
    }


    /* Handle Receive Item ************************ */
    const [receiveDispatchedSKU, setReceiveDispatchedSKU] = useState('')

    const handlereceiveDispatched = async () => {
        try {
        const receivedResult = await contract.methods.ReceiveDispatchedOrder(receiveDispatchedSKU).send({from: web3Account})
        console.log('dispatcher recieves order', receivedResult)
        } catch(err) {
        console.log(err)
        }
    }


    /* Handle Dispatcher dispatch Item ************************ */
    const [receiveDispatcherDispatchSKU, setConsumerReceivesSKU] = useState('')

    const handleConsumerReceives = async () => {
        try {
        const receivedResult = await contract.methods.DispatcherDispatchesOrder(receiveDispatcherDispatchSKU).send({from: web3Account})
        console.log('dispatcher dispatches order', receivedResult)
        } catch(err) {
        console.log(err)
        }
    }

    /* Handle Consumer Receive Item ************************ */
    const [receiveConsumerReceivesSKU, setDispatcherDispatchSKU] = useState('')

    const handleDispatcherDispatch = async () => {
        try {
        const receivedResult = await contract.methods.ConsumerReceivesItem(receiveConsumerReceivesSKU).send({from: web3Account})
        console.log('consumer receive item result', receivedResult)
        } catch(err) {
        console.log(err)
        }
    }


    



    



    return (
        <ContentWrapper>
            <h1>Coming soon!!!</h1>
        </ContentWrapper>
    )
}
export default Content