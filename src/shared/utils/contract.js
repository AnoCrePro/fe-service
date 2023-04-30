const createContract = async (web3, contractAbi, contractAddress) => {
  const contract = await new web3.eth.Contract(contractAbi, contractAddress);
  return contract
}

module.exports = {
  createContract
}