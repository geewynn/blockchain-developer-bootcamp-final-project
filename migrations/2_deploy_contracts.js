const SupplyChain = artifacts.require('SupplyChain')


module.exports = async deployer => {
  
  try {
    await deployer.deploy(SupplyChain)
    const supplyChain = await SupplyChain.deployed()
    console.log('supplyChain address: ', supplyChain.address)

  } catch(err) {
    console.log(err)
  }
  

}