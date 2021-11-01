import Web3 from 'web3';

const getWeb3 = () => 
    new Promise((resolve, reject) => {
        window.addEventListener("load", async () => {
            const { ethereum } = window
            if (window.ethereum) {
                const web3 = new Web3(ethereum);
                try {
                    await ethereum.request({ method: 'eth_requestAccounts' });
                    ethereum.on('accountsChanged', () => {
                        window.location.reload()
                    })

                    ethereum.on('chainChanged', () => {
                        window.location.reload()
                    })

                    resolve(web3);
                } catch (error) {
                    reject(error);
                }
            }
            else if (window.web3) {
                const web3 = window.web3;
                console.log("Injected web3 detected");
                resolve(web3);
            }
            else {
                alert('you need to install MetaMask')
            }
        });
    });

export { getWeb3 };