const SupplyChain = artifacts.require('SupplyChain')
let supplyChain, accounts, deployer, restaurant, dispatcher, consumer, randomAccount

// harvest parameters
let originRestaurantID
let originRestaurantName = 'Chop Complete'
let originRestaurantInfo = 'Best Healthy Meal'

let productNotes = 'Healthy Food'

// conversion helpers
const toWei = payload => web3.utils.toWei(payload.toString(), 'ether')
const fromWei = payload => web3.utils.fromWei(payload.toString(), 'ether')
const ETHBalance = payload => web3.eth.getBalance(payload)


contract('Supply Chain', async accountsPayload => {
    accounts = accountsPayload
    deployer = accounts[0]
    consumer = accounts[1]
    restaurant = accounts[2]
    dispatcher = accounts[3]
    randomAccount = accounts[5]

    originRestaurantID = restaurant


    before(async() => {
        supplyChain = await SupplyChain.deployed()
    })

    contract('Deployment', () => {
        it('Sets sku to 0 and deployer as owner', async() => {
            const skuCount = await supplyChain.getTotalItems()
            const deployerAccount = await supplyChain.getOwner()
            assert.equal(skuCount.toNumber(), 0)
            assert.equal(deployerAccount, deployer)
        })
    })

  contract('Revert Non-Restaurant', () => {
        let ownerID = deployer
        let originRestaurantID = deployer
        let originRestaurantID2 = restaurant

        it('Disallows non-restaurant attempt to cook orders', async() => {
          const REVERT  = 'Returned error: VM Exception while processing transaction: revert only restaurant can call function'
            try {
                await supplyChain
                    .CookOrder(originRestaurantName, originRestaurantInfo, productNotes, { from: dispatcher})
                    throw null
            } catch(err) {
                assert(err.message.startsWith(REVERT), `Expected ${REVERT} but got ${err.message} instead`)
            }
        })
    })

    contract('Supply Chain Phases', () => {
      it('Allows consumer to order item', async () => {
        const sku =1

        await supplyChain.transferOwnershipToAccount(consumer, {from: deployer})

        await supplyChain.enableConsumerAccount(sku, consumer, {from: deployer})

        let eventEmitted = false
        await supplyChain.OrderItem(sku, {from: consumer})
        await supplyChain.LogItemOrder((err, res) => eventEmitted = true)

        
        const orderProductDetails = await supplyChain.fetchProductDetails(sku)
        const { status } = orderProductDetails

        assert.equal(status, 'Ordered')
        assert.equal(eventEmitted, true, 'Error: ItemCooked event not emitted')

      })

      it('Allows consumer to pay for item', async () => {
        const sku =1

        let eventEmitted = false
        await supplyChain.PayForItem(sku, {from: consumer})
        await supplyChain.LogItemPaid((err, res) => eventEmitted = true)

        const orderProductDetails = await supplyChain.fetchProductDetails(sku)
        const { status } = orderProductDetails

        assert.equal(status, 'Paid')
        assert.equal(eventEmitted, true, 'Error: event not emitted')

      })

      it('Allows restaurant to mark order as received', async () => {
        const sku =1

        await supplyChain.transferOwnershipToAccount(restaurant, {from: consumer})
        await supplyChain.addRestaurant(restaurant, {from: deployer})

        let eventEmitted = false
        await supplyChain.ReceiveOrder(sku, {from: restaurant})
        await supplyChain.LogItemReceived((err, res) => eventEmitted = true)

        const orderProductDetails = await supplyChain.fetchProductDetails(sku)
        const { status } = orderProductDetails

        assert.equal(status, 'Received')
        assert.equal(eventEmitted, true, 'Error: event not emitted')
      })

      it('Allows restaurant to cook order', async () => {
        const sku =1

        let eventEmitted = false

        await supplyChain.CookOrder(originRestaurantName, originRestaurantInfo, productNotes, {from: restaurant})
        await supplyChain.LogItemCooked((err, res) => eventEmitted = true)
        

        const cookRestaurantDetails = await supplyChain.fetchRestaurantDetails.call(sku)

        const { 
          itemSKU, 
          ownerID: fetchedOwner, 
          originRestaurantID: fetchedRestaurant, 
          originRestaurantName: fetchedRestaurantName,
          originRestaurantInfo: fetchedRestaurantInfo,
        } = cookRestaurantDetails
        

        const orderProductDetails = await supplyChain.fetchProductDetails(sku)
        const { itemUPC, productNotes: fetchedProductNotes, status } = orderProductDetails

        // restaurant 
        assert.equal(itemSKU, sku)
        assert.equal(fetchedOwner, restaurant)
        assert.equal(fetchedRestaurant, restaurant)
        assert.equal(fetchedRestaurantName, originRestaurantName)
        assert.equal(fetchedRestaurantInfo, originRestaurantInfo)

        // product
        assert.equal(itemUPC, sku)
        assert.equal(fetchedProductNotes, productNotes)
        assert.equal(status, 'Cooked')
        assert.equal(eventEmitted, true, 'Error: LogItemCooked event not emitted')

      })

      it('Allows restaurant to process order', async () => {

        // event
        let eventEmitted = false
        const sku = 1
        await supplyChain.ProcessOrder(sku, {from: restaurant})
        await supplyChain.LogItemProcessed((err, res) => eventEmitted = true)
        
        const orderProductDetails = await supplyChain.fetchProductDetails(sku)
        const { status } = orderProductDetails
  
        // product
        assert.equal(status, 'Processed')
        assert.equal(eventEmitted, true, 'Error: LogItemProcessed event not emitted')
      })


      it('Allows restaurant to pack order', async () => {

        // event
        let eventEmitted = false
        const sku = 1

        await supplyChain.PackageOrder(sku, {from: restaurant})
        await supplyChain.LogItemPacked((err, res) => eventEmitted = true)
        
        const orderProductDetails = await supplyChain.fetchProductDetails(sku)
        const { status } = orderProductDetails
  
        // product
        assert.equal(status, 'Packed')
        assert.equal(eventEmitted, true, 'Error: LogItemPacked event not emitted')
      })

      it('Allows restaurant to send order to dispatcher', async () => {

        // event
        let eventEmitted = false
        const sku = 1

        await supplyChain.DispatchOrder(sku, {from: restaurant})
        await supplyChain.LogItemDispatched((err, res) => eventEmitted = true)
        
        const orderProductDetails = await supplyChain.fetchProductDetails(sku)
        const { status } = orderProductDetails
  
        // product
        assert.equal(status, 'Dispatched')
        assert.equal(eventEmitted, true, 'Error: LogItemDispatched event not emitted')
      })


      it('Allows dispatcher to receive order', async () => {
        const sku =1

        await supplyChain.transferOwnershipToAccount(dispatcher, {from: restaurant})
        await supplyChain.enableDisapatcherAccount(sku, dispatcher, {from: deployer})

        let eventEmitted = false
        await supplyChain.ReceiveDispatchedOrder(sku, {from: dispatcher})
        await supplyChain.LogDis((err, res) => eventEmitted = true)

        const orderProductDetails = await supplyChain.fetchProductDetails(sku)
        const { status } = orderProductDetails

        assert.equal(status, 'DispatchedReceived')
        assert.equal(eventEmitted, true, 'Error: event not emitted')
      })

      it('Allows dispatcher to send order to consumer', async () => {
        const sku =1

        // await supplyChain.transferOwnershipToAccount(dispatcher, {from: restaurant})
        // await supplyChain.enableDisapatcherAccount(sku, dispatcher, {from: deployer})

        let eventEmitted = false
        await supplyChain.DispatcherDispatchesOrder(sku, {from: dispatcher})
        await supplyChain.LogDispatchSent((err, res) => eventEmitted = true)

        const orderProductDetails = await supplyChain.fetchProductDetails(sku)
        const { status } = orderProductDetails

        assert.equal(status, 'DispatchSent')
        assert.equal(eventEmitted, true, 'Error: event not emitted')
      })



      it('Allows consumer to mark order as confirmed', async () => {
        const sku =1

        // await supplyChain.transferOwnershipToAccount(consumer, {from: restaurant})
        // await supplyChain.enableConsumerAccount(sku, consumer, {from: deployer})

        let eventEmitted = false
        await supplyChain.ConsumerReceivesItem(sku, {from: consumer})
        await supplyChain.LogItemConfirmed((err, res) => eventEmitted = true)

        const orderProductDetails = await supplyChain.fetchProductDetails(sku)
        const { status } = orderProductDetails

        assert.equal(status, 'Confirmed')
        assert.equal(eventEmitted, true, 'Error: event not emitted')
      })




    })

})