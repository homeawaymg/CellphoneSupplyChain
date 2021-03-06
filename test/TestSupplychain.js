// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact

var ValueChain = artifacts.require('ValueChain')

contract('ValueChain', function (accounts) {
    // Declare few constants and assign a few sample accounts generated by ganache-cli
    var sku = 1
    var upc = 1
    const ownerID = accounts[0]
    const originManufacturerID = accounts[1]
    const originManufacturerName = "John Doe"
    const originManufacturerInformation = "Yarray Valley"
    const originManufacturerLatitude = "-38.239770"
    const originManufacturerLongitude = "144.341490"
    var productID = sku + upc
    const productNotes = "Best beans for Espresso"
    const productPrice = web3.utils.toWei("1", "ether")
    var itemState = 0
    const brandOwnerID = accounts[2]
    const retailerID = accounts[3]
    const consumerID = accounts[4]
    const emptyAddress = '0x00000000000000000000000000000000000000'

    ///Available Accounts
    ///==================
    /* Accounts:
    (0) 0xf254bd2bdb31b6a982ab3451424ec0b0168ff036
    (1) 0xe62f5d49a903925d631a06bf09df98298d59f77d
    (2) 0x11c3928061092dbb72876059154e9edc702232a2
    (3) 0x2fe74337b9a0a6b66def5a6679e56704c3ef2fa9
    (4) 0x83473166a7e9a58199597181a4d17349a60791ec
    (5) 0xe2ca48c537b3d4203e9d0fea962f65a88fb3b77b
    (6) 0xc09d1ac6658e265f76e7c56eb59738ef2120cdc9
    (7) 0xc535d758f2af466a81c8a87891bfcd50398c08d4
    (8) 0x7ab7ba331e845f02d31dc311b1b446d748eb60f2
    (9) 0xc6ba1bd6d1d5af68821d2f861a75a3ab482b6f10
    */

    console.log("ganache-cli accounts used here...")
    console.log("Brand Owner: accounts[0] ", brandOwnerID)
    console.log("Manufacturer: accounts[1] ", originManufacturerID)
    console.log("Distributor: accounts[2] ", accounts[2])
    console.log("Retailer: accounts[3] ", retailerID)
    console.log("Consumer: accounts[4] ", consumerID)

    it("Testing setting up of smart contract function that allows a Manufacturer of cellphone be created", async () => {
        const valueChain = await ValueChain.deployed();
        let result = await valueChain.addManufacturer(originManufacturerID);
        assert.equal(result.logs[0].event, 'ManufacturerAdded', 'ManufacturerAdded' + ' event should fire.');

    })
    it("Testing setting up of smart contract function that allows a BrandOwner of cellphone be created", async () => {
        const valueChain = await ValueChain.deployed();
        let result2 = await valueChain.addRetailer(retailerID);
        assert.equal(result2.logs[0].event, 'RetailerAdded', 'RetailerAdded' + ' event should fire.');

    })
    it("Testing setting up of smart contract function that allows a  Retailer of cellphone be created", async () => {
        const valueChain = await ValueChain.deployed();
        let result3 = await valueChain.addBrandOwner(brandOwnerID);
        assert.equal(result3.logs[0].event, 'BrandOwnerAdded', 'BrandOwnerAdded' + ' event should fire.');
    })
    // 1st Test
    it("Testing smart contract function manufactureItem() that allows a Manufacturer to manufacture cellphone", async () => {
        const valueChain = await ValueChain.deployed()

        // Declare and Initialize a variable for event
        //var eventEmitted = false

        // Watch the emitted event Manufactured()
        //var event = valueChain.Manufactured()
        //await event.watch((err, res) => {
        //    eventEmitted = true
        //}) UDACITY Account 0

        // Mark an item as Manufactured by calling function manufactureItem()
        let result = await valueChain.manufactureItem(upc, originManufacturerID, originManufacturerName, 
                                            originManufacturerInformation, originManufacturerLatitude, 
                                            originManufacturerLongitude, productNotes,{from: originManufacturerID});
        //console.log(result.logs);
        assert.equal(result.logs[0].event, 'Manufactured', 'Manufactured' + ' event should fire.');

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await valueChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await valueChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        //assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        //const resultBufferOne = await valueChain.fetchItemBufferOne.call(upc)
        //console.log(resultBufferOne);
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], originManufacturerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originManufacturerID, 'Error: Missing or Invalid originManufacturerID')
        assert.equal(resultBufferOne[4], originManufacturerName, 'Error: Missing or Invalid originManufacturerName')
        assert.equal(resultBufferOne[5], originManufacturerInformation, 'Error: Missing or Invalid originManufacturerInformation')
        assert.equal(resultBufferOne[6], originManufacturerLatitude, 'Error: Missing or Invalid originManufacturerLatitude')
        assert.equal(resultBufferOne[7], originManufacturerLongitude, 'Error: Missing or Invalid originManufacturerLongitude')
        assert.equal(resultBufferTwo[5], 0, 'Error: Invalid item State')
        //assert.equal(eventEmitted, true, 'Invalid event emitted')        
    })

    // 2nd Test
    it("Testing smart contract function assembleItem() that allows a Manufacturer to process cellphone Assembly", async () => {
        const valueChain = await ValueChain.deployed()
        // Declare and Initialize a variable for event
        let result = await valueChain.assembleItem(upc,{from: originManufacturerID});
        // Watch the emitted event Processed()
        //console.log(result.logs);
        assert.equal(result.logs[0].event, 'Assembled', 'Assembled event should fire.');
        // Mark an item as Processed by calling function processtItem()
        //valueChain.itemsHistory[upc].push(result.logs[0].transactionHash);
        //console.log(result.logs[0].transactionHash);
        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await valueChain.fetchItemBufferTwo.call(upc)
        assert.equal(resultBufferTwo[5], 1, 'Error: Invalid item State')


        // Verify the result set

    })

    // 3rd Test
    it("Testing smart contract function packItem() that allows a Manufacturer to pack cellphone", async () => {
        const valueChain = await ValueChain.deployed()

        // Declare and Initialize a variable for event

        let result = await valueChain.packItem(upc, {from: originManufacturerID});
        // Watch the emitted event Packed()
        //console.log(result.logs);
        assert.equal(result.logs[0].event, 'Packed', 'Packed event should fire.');

        // Mark an item as Packed by calling function packItem()


        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await valueChain.fetchItemBufferTwo.call(upc);

        // Verify the result set

        assert.equal(resultBufferTwo[5], 2, 'Error: Invalid item State');
    })

    // 4th Test
    it("Testing smart contract function sellItem() that allows a Manufacturer to sell cellphone", async () => {
        const valueChain = await ValueChain.deployed()

        // Declare and Initialize a variable for event
        // Mark an item as ForSale by calling function sellItem()
        let result = await valueChain.sellItem(upc, productPrice, {from: originManufacturerID});

        // Watch the emitted event ForSale()
        //console.log(result.logs);
        assert.equal(result.logs[0].event, 'ForSale', 'ForSale event should fire.');


        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await valueChain.fetchItemBufferTwo.call(upc);


        // Verify the result set
        //console.log(resultBufferTwo);
        assert.equal(resultBufferTwo["productPrice"], productPrice, 'Error: Invalid Product price State')
        assert.equal(resultBufferTwo[5], 3, 'Error: Invalid item State');
    })

    // 5th Test
    it("Testing smart contract function buyItem() that allows a distributor to buy cellphone", async () => {
        const valueChain = await ValueChain.deployed()
        let cashOnHand =  web3.utils.toWei("2",'ether');
        // Declare and Initialize a variable for event
        let result = await valueChain.buyItem(upc,{from: brandOwnerID, value:cashOnHand});

        // Watch the emitted event Sold()
        assert.equal(result.logs[0].event, 'Sold', 'Sold event should fire.');


        // Mark an item as Sold by calling function buyItem()


        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        // Verify the result set
        const resultBufferTwo = await valueChain.fetchItemBufferTwo.call(upc);
        //console.log(resultBufferTwo);
        assert.equal(resultBufferTwo["brandOwnerID"], brandOwnerID, 'Error: Invalid brandOwnerID ')
        assert.equal(resultBufferTwo[5], 4, 'Error: Invalid item State');

        // Verify the result set

    })

    // 6th Test
    it("Testing smart contract function shipItem() that allows a brandOwner to ship cellphone", async () => {
        const valueChain = await ValueChain.deployed()

        // Declare and Initialize a variable for event
        let result = await valueChain.shipItem(upc,{from: brandOwnerID});

        // Watch the emitted event Shipped()
        assert.equal(result.logs[0].event, 'Shipped', 'Shipped event should fire.');

        // Mark an item as Sold by calling function buyItem()


        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await valueChain.fetchItemBufferTwo.call(upc);
        //console.log(resultBufferTwo);
        assert.equal(resultBufferTwo[5], 5, 'Error: Invalid item State');

        // Verify the result set

    })

    // 7th Test
    it("Testing smart contract function receiveItem() that allows a retailer to mark coffee received", async () => {
        const valueChain = await ValueChain.deployed()

        // Declare and Initialize a variable for event
        let result = await valueChain.receiveItem(upc,{from: retailerID});

        // Watch the emitted event Received()
        
        assert.equal(result.logs[0].event, 'Received', 'Received event should fire.');

        // Mark an item as Sold by calling function buyItem()


        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await valueChain.fetchItemBufferTwo.call(upc);
        //console.log(resultBufferTwo);
        assert.equal(resultBufferTwo[5], 6, 'Error: Invalid item State');
        assert.equal(resultBufferTwo["brandOwnerID"], brandOwnerID, 'Error: Invalid brandOwnerID ')


        // Verify the result set

    })

    // 8th Test
    it("Testing smart contract function purchaseItem() that allows a consumer to purchase cellphone", async () => {
        const valueChain = await ValueChain.deployed()

        // Declare and Initialize a variable for event
        let result = await valueChain.purchaseItem(upc,{from: consumerID});

        // Watch the emitted event Purchased()
        //console.log(result.logs);
        assert.equal(result.logs[0].event, 'ConsumerAdded', 'ConsumerAdded event should fire.');
        assert.equal(result.logs[1].event, 'Purchased', 'Purchased event should fire.');



        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await valueChain.fetchItemBufferOne.call(upc)

        const resultBufferTwo = await valueChain.fetchItemBufferTwo.call(upc);
        //console.log(resultBufferTwo);

        assert.equal(resultBufferTwo[5], 7, 'Error: Invalid item State');
        assert.equal(resultBufferOne["ownerID"], consumerID, 'Error: Invalid ownerID ')
        assert.equal(resultBufferTwo["consumerID"], consumerID, 'Error: Invalid consumerID ')

        // Verify the result set

    })

    // 9th Test
    it("Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain", async () => {
        const valueChain = await ValueChain.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await valueChain.fetchItemBufferOne.call(upc);
        // Verify the result set:

        //console.log(resultBufferOne);
        assert.equal(resultBufferOne["ownerID"], consumerID, 'Error: Invalid ownerID ')
        assert.equal(resultBufferOne["itemUPC"], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne["originManufacturerID"], originManufacturerID, 'Error: Missing or Invalid originManufacturerID')
        assert.equal(resultBufferOne["originManufacturerName"], originManufacturerName, 'Error: Missing or Invalid originManufacturerName')
        assert.equal(resultBufferOne["originManufacturerInformation"], originManufacturerInformation, 'Error: Missing or Invalid originManufacturerInformation')
        assert.equal(resultBufferOne["originManufacturerLatitude"], originManufacturerLatitude, 'Error: Missing or Invalid originManufacturerLatitude')
        assert.equal(resultBufferOne["originManufacturerLongitude"], originManufacturerLongitude, 'Error: Missing or Invalid originManufacturerLongitude')
    })

    // 10th Test
    it("Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain", async () => {
        const valueChain = await ValueChain.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await valueChain.fetchItemBufferTwo.call(upc);
        //console.log(resultBufferTwo);


        // Verify the result set:
        assert.equal(resultBufferTwo["itemUPC"], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferTwo["productID"], productID, 'Error: Invalid item productID')
        assert.equal(resultBufferTwo["productNotes"], productNotes, 'Error: Invalid item productNotes')
        assert.equal(resultBufferTwo["productPrice"], productPrice, 'Error: Invalid item productPrice')
        assert.equal(resultBufferTwo["brandOwnerID"], brandOwnerID, 'Error: Invalid item productPrice')
        assert.equal(resultBufferTwo["retailerID"], retailerID, 'Error: Invalid item productPrice')

        assert.equal(resultBufferTwo[5], 7, 'Error: Invalid item State');
        assert.equal(resultBufferTwo["consumerID"], consumerID, 'Error: Invalid consumerID ')


    })

});