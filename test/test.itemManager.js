const ItemManager = artifacts.require("./ItemManager.sol");

contract("ItemManager", accounts => {
    it("should be able to add an item", async function () {
        const itemManagerInstance = await ItemManager.deployed();
        const itemName = "Item1";
        const itemPrice = 500;
        const result = await itemManagerInstance.createItem(itemName, itemPrice, { from: accounts[0] });
        assert.equal(result.logs[0].args._itemIndex, 0, "It's not the first item");
        const item = await itemManagerInstance.items(0);
        assert.equal(item._identifier, itemName, "Identifier was not the same");

    })
});