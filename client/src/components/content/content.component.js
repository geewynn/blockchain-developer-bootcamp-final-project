import { useState, useContext } from 'react'
import { AccountContext } from '../../contexts/account-context'
import { FunctionContext } from '../../contexts/function-context'
import { TabsContext } from '../../contexts/tabs-context'
import Tabs from '../tabs/tabs.component'


import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'

import { ContentWrapper, DappContentWrapper, InputWrapper, OverviewWrapper, ProductWrapper, ToolTip } from './content.style'
import { toWei, fromWei } from '../../utils/conversion'


const Content = () => {
    const { productOverview, customerDetails, restaurantDetails, productDetails } = useContext(TabsContext)
    const [restaurantResult, setRestaurantResult] = useState('')
    const [productResult, setProductResult] = useState('')

    const { itemSKU, originRestaurantID } = restaurantResult
    const { productPrice, productNotes: fetchedProductNotes, status, dispatcherID, consumerID } = productResult

    const { contract } = useContext(FunctionContext)
    const { web3Account } = useContext(AccountContext)
    const [sku, setSKU] = useState('')

    const initialRestaurantState = {
        SKU: '',
        address: ''
    }

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
        setConsumer(prev => ({...prev, [name]: value}))
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

    // const initialCookState = {
    //     restaurantName: '',
    //     restaurantInfo: '',
    //     productNotes: ''
    // }

    const [tokenId1, setTokenId1] = useState('')

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
    // const [cookData, setCookData] = useState(initialCookState)
    const [cookSKU, setCookData] = useState('')
    // const { restaurantName, restaurantInfo, productNotes } = cookData

    const handleChange = e => {
        const { value, name } = e.target
        setCookData(prev => ({...prev, [name]: value}))
    }

    const handleCook = async() => {
        try {
        const cookOrder = await contract.methods.CookOrder(cookSKU).send({ from: web3Account })
        // setCookData(initialRestaurantState)
        setRestaurantResult(cookOrder)
    
        } catch(err) {
        console.log(err)
        }
    }
    
    // overview
    const handleOverview = async () => {
        try {
            const fetchedRestaurantDetails = await contract.methods.fetchRestaurantDetails(sku).call()
            const fetchedProductDetails = await contract.methods.fetchProductDetails(sku).call()
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
     const [receiveDispatcherDispatchSKU, setDispatcherDispatchSKU] = useState('')

     const handleDispatcherDispatch = async () => {
         try {
         const receivedResult = await contract.methods.DispatcherDispatchesOrder(receiveDispatcherDispatchSKU).send({from: web3Account})
         console.log('dispatcher dispatches order', receivedResult)
         } catch(err) {
         console.log(err)
         }
     }

     
    /* Handle consumer receives Item ************************ */
    const [receiveConsumerReceivesSKU, setConsumerReceivesSKU] = useState('')

    const handleConsumerReceives = async () => {
        try {
        const receivedResult = await contract.methods.ConsumerReceivesItem(receiveConsumerReceivesSKU).send({from: web3Account})
        console.log('consumer receive item result', receivedResult)
        } catch(err) {
        console.log(err)
        }
    }

   

    return (
        <ContentWrapper>
            <Tabs />
            <DappContentWrapper>
                <InputWrapper style={{display: productOverview ? 'flex': 'none'}}>
                    <Tippy content={<ToolTip>Enter SKU to get food and product details </ToolTip>}>
                        <input type="number" placeholder='Enter SKU' onChange={e => setSKU(e.target.value) }  value={ sku } />
                    </Tippy>
                    <button onClick={ handleOverview }>Overview</button>
                </InputWrapper>

                <OverviewWrapper style={{display: productOverview ? 'flex' : 'none'}}>
                    <h3>Restaurant Overview</h3>
                    { itemSKU ? <p>SKU: { itemSKU }</p> : null}
                    {/* { originRestaurantName ? <p>Restaurant Name: { originRestaurantName }</p> : null} */}
                    { originRestaurantID ? <p>Restaurant ID:  { originRestaurantID.substring(0, 30) }</p> : null}
                    {/* { originRestaurantInfo ? <p>Restaurant Info: { originRestaurantInfo }</p> : null} */}
                </OverviewWrapper >

                <OverviewWrapper style={{display: productOverview ? 'flex' : 'none'}}>
                    <h3>Product Overview</h3>
                    { status ? <p>Status: { status }</p> : null}
                    { productPrice ? <p>Product Price: { fromWei(productPrice) }ETH</p> : null}
                    { fetchedProductNotes ? <p>Product Notes: { fetchedProductNotes }</p> : null }
                    {/* { ownerID ? <p>Owner: { ownerID.substring(0, 30) }</p> : null } */}
                    { dispatcherID ? <p>Distributor: { dispatcherID.substring(0, 30) }</p> : null}
                    { consumerID ? <p>Consumer: { consumerID.substring(0, 30) }</p> : null }
                </OverviewWrapper > 

                <InputWrapper style={{display: restaurantDetails ? 'flex' : 'none'}}>
                    <h3> Deployer should add Restaurant </h3>
                    <Tippy content={<ToolTip>Only deployer can add restaurant</ToolTip>}>
                        <input type="number" placeholder='Enter SKU' onChange={ handleAddRestaurantChange } name='SKU' value={ restaurant.SKU } /> 
                        
                    </Tippy>
                        <input type="text" placeholder='Enter Prospective Restaurant Address' onChange={ handleAddRestaurantChange } name='address'  value={ restaurant.address } />
                    <button onClick={ addRestaurantAccount }>Add Restaurant</button>
                </InputWrapper>

                <InputWrapper style={{display: restaurantDetails ? 'flex' : 'none'}}>
                    <h3> Restaurant should confirm consumer order </h3>
                    <Tippy content={ <ToolTip>Only restaurant can confirm order</ToolTip>}>
                        <input type="number" placeholder='Enter SKU' onChange={e => setReceiveSKU(e.target.value) }  name='SKU' value={ receiveSKU } />
                    </Tippy>
                    <button onClick={ handleReceive }>Dispatch</button>
                </InputWrapper>


                <InputWrapper style={{display: restaurantDetails ? 'flex' : 'none'}}>
                    <h3> Restaurant should cook item </h3>
                    <Tippy content={<ToolTip>Only restaurant can cook item</ToolTip>}>
                        <input type="number" placeholder='Enter SKU' onChange={e => setCookData(e.target.value) } name='SKU'  value={ cookSKU } />
                    </Tippy>
                    <button onClick={ handleCook }>Cook</button>
                </InputWrapper>

                <InputWrapper style={{display: restaurantDetails ? 'flex' : 'none'}}>
                    <h3> Restaurant should process item </h3>
                    <Tippy content={<ToolTip>Only restaurant can process item</ToolTip>}>
                        <input type="number" placeholder='Enter SKU' onChange={e => setProcessSKU(e.target.value) }  value={ processSKU } />
                    </Tippy>
                    <button onClick={ handleProcess }>Process</button>
                </InputWrapper>
                

                <InputWrapper style={{display: restaurantDetails ? 'flex' : 'none'}}>
                    <h3> Restaurant should pack item </h3>
                    <Tippy content={ <ToolTip>Only restaurant can pack item</ToolTip>}>
                        <input type="number" placeholder='Enter SKU' onChange={e => setPackSKU(e.target.value) }  value={ packSKU } />
                    </Tippy>
                    <button onClick={ handlePack }>Pack</button>
                </InputWrapper>
                
                <ProductWrapper style={{display: restaurantDetails ? 'flex' : 'none'}}>
                    <h3> Restaurant should send item to dispatcher </h3>
                    <Tippy content={ <ToolTip>Only restaurant can send item to Dispatcher</ToolTip>}>
                        <input type="number" placeholder='Enter SKU' onChange={e => setDispatchSKU(e.target.value) } value={ dispatchSKU } />
                    </Tippy>
                    <button onClick={ handleDispatch }>Dispatch</button>
                </ProductWrapper>

                {/* Consumer ************************ ************************ ************************  */}

                <InputWrapper style={{display: customerDetails ? 'flex' : 'none'}}>
                    <h3> Deployer should add consumer </h3>
                    <Tippy content={<ToolTip>Only deployer can add consumer</ToolTip>}>
                        <input type="number" placeholder='Enter SKU' onChange={ handleAddConsumerChange } name='SKU' value={ consumer.SKU } />
                    </Tippy>
                    <input type="text" placeholder='Enter Prospective Consumer Address' onChange={ handleAddConsumerChange } name='address'  value={ consumer.address } />
                    <button onClick={ addConsumerAccount }>Add Consumer</button>
                </InputWrapper>

                <InputWrapper style={{display: customerDetails ? 'flex' : 'none'}}>
                    <h3> Consumer should order </h3>
                    <Tippy content={<ToolTip>Only consumer can order item</ToolTip>}>
                        <input type="number" placeholder='Enter SKU' onChange={e => setOrderSKU(e.target.value) }  value={ orderSKU }/>
                    </Tippy>
                    <button onClick={ handleOrder }>Purchase</button>
                </InputWrapper>

                <InputWrapper style={{display: customerDetails ? 'flex' : 'none'}}>
                    <h3> Consumer should pay </h3>
                    <Tippy content={<ToolTip>Only consumer can pay for order</ToolTip>}>
                        <input type="number" placeholder='Enter SKU' onChange={handlePayChange}  name='SKU' value={ paySKU.SKU }/>
                    </Tippy>
                    <input type="number" placeholder='Enter Amount in ETH' onChange={handlePayChange} name='price' value={ paySKU.price }  />
                    <button onClick={ handlePay }>Pay</button>
                </InputWrapper>

                <InputWrapper style={{display: productDetails ? 'flex' : 'none'}}>
                    <h3> Deployer should add dispatcher </h3>
                    <Tippy content={<ToolTip>Only deployer can add dispatcher</ToolTip>}>
                        <input type="number" placeholder='Enter SKU' onChange={ handleDispatcherChange } name='SKU'  value={ dispatcher.SKU } />
                    </Tippy>
                    {/* {console.log('receive sku', receiveSKU)} */}
                    <input type="text" placeholder='Enter Prospective Dispatcher Address' onChange={ handleDispatcherChange } name='address'  value={ dispatcher.address } />
                    <button onClick={ addDispatcherAccount }>Add Dispatcher</button>
                </InputWrapper>
                    
                <InputWrapper style={{display: productDetails ? 'flex' : 'none'}}>
                    <h3> Dispatcher should receive item from restaurant </h3>
                    <Tippy content={<ToolTip>Only dispatcher can receive order from restaurant</ToolTip>}>
                        <input type="number" placeholder='Enter SKU' onChange={ e => setReceiveDispatchedSKU(e.target.value) }  value={ receiveDispatchedSKU } />
                    </Tippy>
                    <button onClick={ handlereceiveDispatched }>Dispatcher Receives</button>
                </InputWrapper>

                <InputWrapper style={{display: productDetails ? 'flex' : 'none'}}>
                    <h3> Dispatcher should send item to consume </h3>
                    <Tippy content={<ToolTip>Only dispatcher can send order to consumer</ToolTip>}>
                        <input type="number" placeholder='Enter SKU' onChange={ e => setDispatcherDispatchSKU(e.target.value) }  value={ receiveDispatcherDispatchSKU } />
                    </Tippy>
                    <button onClick={ handleDispatcherDispatch }>Dispatcher Sends</button>
                </InputWrapper>

                <InputWrapper style={{display: productDetails ? 'flex' : 'none'}}>
                    <h3> Consumer should receive item from dispatcher </h3>
                    <Tippy content={<ToolTip>Only consumer can confirm order order from dispatcher</ToolTip>}>
                        <input type="number" placeholder='Enter SKU' onChange={ e => setConsumerReceivesSKU(e.target.value) }  value={ receiveConsumerReceivesSKU } />
                    </Tippy>
                    <button onClick={ handleConsumerReceives }>Consumer Confirm</button>
                </InputWrapper>



            </DappContentWrapper>
        </ContentWrapper>
    )
}
export default Content