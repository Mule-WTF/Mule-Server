module.exports = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"contract_address","type":"address"},{"indexed":false,"internalType":"string","name":"token_name","type":"string"},{"indexed":false,"internalType":"uint256","name":"total_supply","type":"uint256"}],"name":"TokenAdded","type":"event"},{"inputs":[],"name":"allContracts","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"}],"name":"contractByName","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"contracts","outputs":[{"internalType":"address","name":"creator","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"supply","type":"uint256"},{"internalType":"address","name":"contractAddress","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_creator","type":"address"}],"name":"contractsByCreator","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"creatorContracts","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_tokenName","type":"string"},{"internalType":"uint256","name":"_supply","type":"uint256"}],"name":"newToken","outputs":[{"internalType":"address","name":"contractAddress","type":"address"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"string","name":"str","type":"string"}],"name":"testStr","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"tokenContracts","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"tokenNames","outputs":[{"internalType":"address","name":"creator","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"supply","type":"uint256"},{"internalType":"address","name":"contractAddress","type":"address"}],"stateMutability":"view","type":"function"}];
