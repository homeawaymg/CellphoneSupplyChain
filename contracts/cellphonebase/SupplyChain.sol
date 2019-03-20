pragma solidity ^ 0.4 .24;
// Define a contract 'Supplychain'
contract SupplyChain {

    // Define 'owner'
    address owner;

    // Define a variable called 'upc' for Universal Product Code (UPC)
    uint upc;

    // Define a variable called 'sku' for Stock Keeping Unit (SKU)
    uint sku;

    // Define a public mapping 'items' that maps the UPC to an Item.
    mapping(uint => Item) items;

    // Define a public mapping 'itemsHistory' that maps the UPC to an array of TxHash, 
    // that track its journey through the supply chain -- to be sent from DApp.
    mapping(uint => string[]) public itemsHistory;

    // Define enum 'State' with the following values:
    enum State {
        Manufactured, // 0
        Assembled, // 1
        Packed, // 2
        ForSale, // 3
        Sold, // 4
        Shipped, // 5
        Received, // 6
        Purchased // 7
    }

    State constant defaultState = State.Manufactured;

    // Define a struct 'Item' with the following fields:
    struct Item {
        uint sku; // Stock Keeping Unit (SKU)
        uint upc; // Universal Product Code (UPC), generated by the Farmer, goes on the package, can be verified by the Consumer
        address ownerID; // Metamask-Ethereum address of the current owner as the product moves through 8 stages
        address originManufacturerID; // Metamask-Ethereum address of the Farmer
        string originManufacturerName; // Farmer Name
        string originManufacturerInformation; // Farmer Information
        string originManufacturerLatitude; // Farm Latitude
        string originManufacturerLongitude; // Farm Longitude
        uint productID; // Product ID potentially a combination of upc + sku
        string productNotes; // Product Notes
        uint productPrice; // Product Price
        State itemState; // Product State as represented in the enum above
        address brandOwnerID; // Metamask-Ethereum address of the Distributor
        address retailerID; // Metamask-Ethereum address of the Retailer
        address consumerID; // Metamask-Ethereum address of the Consumer
    }

    // Define 8 events with the same 8 state values and accept 'upc' as input argument
    event Manufactured(uint upc);
    event Assembled(uint upc);
    event Packed(uint upc);
    event ForSale(uint upc);
    event Sold(uint upc);
    event Shipped(uint upc);
    event Received(uint upc);
    event Purchased(uint upc);

    // Define a modifer that checks to see if msg.sender == owner of the contract
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // Define a modifer that verifies the Caller
    modifier verifyCaller(address _address) {
        require(msg.sender == _address);
        _;
    }

    // Define a modifier that checks if the paid amount is sufficient to cover the price
    modifier paidEnough(uint _price) {
        require(msg.value >= _price);
        _;
    }

    // Define a modifier that checks the price and refunds the remaining balance
    modifier checkValue(uint _upc) {
        _;
        uint _price = items[_upc].productPrice;
        uint amountToReturn = msg.value - _price;
        items[_upc].consumerID.transfer(amountToReturn);
    }

    // Define a modifier that checks if an item.state of a upc is Manufactured
    modifier manufactured(uint _upc) {
        require(items[_upc].itemState == State.Manufactured);
        _;
    }

    // Define a modifier that checks if an item.state of a upc is Assembled
    modifier assembled(uint _upc) {
        require(items[_upc].itemState == State.Assembled);
        _;
    }

    // Define a modifier that checks if an item.state of a upc is Packed
    modifier packed(uint _upc) {
        require(items[_upc].itemState == State.Packed);
        _;
    }

    // Define a modifier that checks if an item.state of a upc is ForSale
    modifier forSale(uint _upc) {
        require(items[_upc].itemState == State.ForSale);
        _;
    }

    // Define a modifier that checks if an item.state of a upc is Sold
    modifier sold(uint _upc) {
        require(items[_upc].itemState == State.Sold);
        _;
    }

    // Define a modifier that checks if an item.state of a upc is Shipped
    modifier shipped(uint _upc) {
        require(items[_upc].itemState == State.Sold);
        _;
    }

    // Define a modifier that checks if an item.state of a upc is Received
    modifier received(uint _upc) {
        require(items[_upc].itemState == State.Received);
        _;
    }

    // Define a modifier that checks if an item.state of a upc is Purchased
    modifier purchased(uint _upc) {
        require(items[_upc].itemState == State.Purchased);
        _;
    }

    // In the constructor set 'owner' to the address that instantiated the contract
    // and set 'sku' to 1
    // and set 'upc' to 1
    constructor() public payable {
        owner = msg.sender;
        sku = 1;
        upc = 1;
    }

    // Define a function 'kill' if required
    function kill() public {
        if (msg.sender == owner) {
            selfdestruct(owner);
        }
    }

    // Define a function 'harvestItem' that allows a farmer to mark an item 'Harvested'
    function manufactureItem(uint _upc, 
                            address _originManufacturerID, 
                            string _originManufacturerName, 
                            string _originManufacturerInformation, 
                            string _originManufacturerLatitude,
                            string _originManufacturerLongitude, 
                            string _productNotes) public {
        // Add the new item as part of Harvest
        Item memory newPhone = Item(sku, 
                                    _upc, 
                                    _originManufacturerID, 
                                    _originManufacturerID, 
                                    _originManufacturerName, 
                                    _originManufacturerInformation, 
                                    _originManufacturerLatitude, 
                                    _originManufacturerLongitude, 
                                    sku + _upc, 
                                    _productNotes, 
                                    0, 
                                    State.Manufactured, 
                                    owner, 
                                    address(0), 
                                    address(0));
        // Define a public mapping 'items' that maps the UPC to an Item.
        items[_upc] = newPhone;
        // Define a public mapping 'itemsHistory' that maps the UPC to an array of TxHash, 
        // that track its journey through the supply chain -- to be sent from DApp.

        // TODO itemsHistory[_upc] ;
        // Increment sku
        sku = sku + 1;
        // Emit the appropriate event
        emit Manufactured(_upc);
    }

    // Define a function 'assembleItem' that allows a farmer to mark an item 'Processed'
    function assembleItem(uint _upc) public onlyOwner manufactured(_upc) {
        // Call modifier to check if upc has passed previous supply chain stage
        // Call modifier to verify caller of this function
        // Update the appropriate fields
        Item storage t = items[_upc];
        t.itemState = State.Assembled;
        items[_upc] = t;
        // Emit the appropriate event
        emit Assembled(_upc);

    }

    // Define a function 'packItem' that allows a farmer to mark an item 'Packed'
    function packItem(uint _upc) public onlyOwner assembled(_upc)
    // Call modifier to check if upc has passed previous supply chain stage
    // Call modifier to verify caller of this function
    {
        Item storage t = items[_upc];
        t.itemState = State.Packed;
        items[_upc] = t;
        // Emit the appropriate event
        emit Packed(_upc);
    }

    // Define a function 'sellItem' that allows a farmer to mark an item 'ForSale'
    function sellItem(uint _upc, uint _price) public onlyOwner packed(_upc)
    // Call modifier to check if upc has passed previous supply chain stage

    // Call modifier to verify caller of this function

    {
        Item storage t = items[_upc];
        t.itemState = State.ForSale;
        t.productPrice = _price;
        items[_upc] = t;

        // Emit the appropriate event
        emit ForSale(_upc);
    }

    // Define a function 'buyItem' that allows the disributor to mark an item 'Sold'
    // Use the above defined modifiers to check if the item is available for sale, if the buyer has paid enough, 
    // and any excess ether sent is refunded back to the buyer
    function buyItem(uint _upc) public payable forSale(_upc) paidEnough() checkValue(_upc) 
    // Call modifier to check if upc has passed previous supply chain stage

    // Call modifer to check if buyer has paid enough

    // Call modifer to send any excess ether back to buyer

    {
         Item storage t = items[_upc];
         

        // Update the appropriate fields - ownerID, distributorID, itemState

        // Transfer money to farmer

        // emit the appropriate event
        emit Sold(_upc);

    }

    // Define a function 'shipItem' that allows the distributor to mark an item 'Shipped'
    // Use the above modifers to check if the item is sold
    function shipItem(uint _upc) public
    // Call modifier to check if upc has passed previous supply chain stage

    // Call modifier to verify caller of this function

    {
        // Update the appropriate fields

        // Emit the appropriate event

    }

    // Define a function 'receiveItem' that allows the retailer to mark an item 'Received'
    // Use the above modifiers to check if the item is shipped
    function receiveItem(uint _upc) public
    // Call modifier to check if upc has passed previous supply chain stage

    // Access Control List enforced by calling Smart Contract / DApp
    {
        // Update the appropriate fields - ownerID, retailerID, itemState

        // Emit the appropriate event

    }

    // Define a function 'purchaseItem' that allows the consumer to mark an item 'Purchased'
    // Use the above modifiers to check if the item is received
    function purchaseItem(uint _upc) public
    // Call modifier to check if upc has passed previous supply chain stage

    // Access Control List enforced by calling Smart Contract / DApp
    {
        // Update the appropriate fields - ownerID, consumerID, itemState

        // Emit the appropriate event

    }

    // Define a function 'fetchItemBufferOne' that fetches the data
    function fetchItemBufferOne(uint _upc) public view returns
        (
            uint itemSKU,
            uint itemUPC,
            address ownerID,
            address originManufacturerID,
            string originManufacturerName,
            string originManufacturerInformation,
            string originManufacturerLatitude,
            string originManufacturerLongitude
        ) {
            // Assign values to the 8 parameters
            Item storage t = items[_upc];
            //100, 0x14723a09acff6d2a60dcdf7aa4aff308fddc160c, "mana", "managuru", "107", "99", "myNotes"

            return (
                t.sku,
                t.upc,
                t.ownerID,
                t.originManufacturerID,
                t.originManufacturerName,
                t.originManufacturerInformation,
                t.originManufacturerLatitude,
                t.originManufacturerLongitude
            );
        }

    // Define a function 'fetchItemBufferTwo' that fetches the data
    function fetchItemBufferTwo(uint _upc) public view returns
        (
            uint itemSKU,
            uint itemUPC,
            uint productID,
            string productNotes,
            uint productPrice,
            uint itemState,
            address distributorID,
            address retailerID,
            address consumerID
        ) {
            // Assign values to the 9 parameters
            Item storage t = items[_upc];
            // State     itemState;    // Product State as represented in the enum above

            return (
                t.sku,
                t.upc,
                t.productID,
                t.productNotes,
                t.productPrice,
                uint(t.itemState),
                t.brandOwnerID,
                t.retailerID,
                t.consumerID
            );
        }
}