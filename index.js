import AlienFrensTokenABI from './alien_frens.js';

document.addEventListener("DOMContentLoaded", () => {
  const web3 = new Web3(window.ethereum)

  document.getElementById("load_button").addEventListener("click", async () => {
    const contract = new web3.eth.Contract(AlienFrensTokenABI, "0x123b30E25973FeCd8354dd5f41Cc45A3065eF88C")
    const walletAddress = document.getElementById("wallet_address").value
    contract.defaultAccount = walletAddress
    const AlienFrensBalance = await contract.methods.balanceOf(walletAddress).call()
    
    document.getElementById("nfts").innerHTML = ""

    for(let i = 0; i < AlienFrensBalance; i++) {
      const tokenId = await contract.methods.tokenOfOwnerByIndex(walletAddress, i).call()

      let tokenMetadataURI = await contract.methods.tokenURI(tokenId).call()

      if (tokenMetadataURI.startsWith("ipfs://")) {
        tokenMetadataURI = `https://ipfs.io/ipfs/${tokenMetadataURI.split("ipfs://")[1]}`
      }

      const tokenMetadata = await fetch(tokenMetadataURI).then((response) => response.json())

      const AlienFrensTokenElement = document.getElementById("nft_template").content.cloneNode(true)
      AlienFrensTokenElement.querySelector("h1").innerText = tokenMetadata["name"]
      AlienFrensTokenElement.querySelector("a").href = `https://opensea.io/assets/0x123b30E25973FeCd8354dd5f41Cc45A3065eF88C/${tokenId}`
      AlienFrensTokenElement.querySelector("img").src = tokenMetadata["image"]
      AlienFrensTokenElement.querySelector("img").alt = tokenMetadata["description"]

      document.getElementById("nfts").append(AlienFrensTokenElement)
    }
  })
})
