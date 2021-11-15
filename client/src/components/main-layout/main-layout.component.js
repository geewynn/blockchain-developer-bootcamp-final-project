import { useContext, useEffect } from "react";
import { AccountContext } from "../../contexts/account-context";
import { FunctionContext } from "../../contexts/function-context"
import { getWeb3 } from "../../utils/getWeb3"
import Content from '../content/content.component'
import { MainLayoutWrapper } from "./main-layout.style"
import SupplyChainContract from "../../abi/SupplyChain.json"



const MainLayout = () => {
    const { setAccountDetails } = useContext(AccountContext)
    const { setContractInstance } = useContext(FunctionContext)

    const enableWeb3 = async () => {
        try {
            const web3 = await getWeb3()
            const accounts = await web3.eth.getAccounts()
            setAccountDetails(accounts[0])

            const networkId = await web3.eth.net.getId()
            const deployedNetwork = await SupplyChainContract.networks[networkId]
            const supplyChain = await new web3.eth.Contract(SupplyChainContract.abi, deployedNetwork && deployedNetwork.address)
            setContractInstance(supplyChain)
            console.log('network id', networkId)
        } catch(err) {
            console.log(err)
        }
    }

    useEffect(() => {
        enableWeb3()
    
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])
    

    return (
        <MainLayoutWrapper>
            <Content />
        </MainLayoutWrapper>
    )
}

export default MainLayout