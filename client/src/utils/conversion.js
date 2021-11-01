import web3 from 'web3';

const toWei = payload => web3.utils.toWei(payload.toString(), 'ether')
const fromWei = payload => web3.utils.fromWei(payload.toString(), 'ether')

export { toWei, fromWei }