const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
const axios = require('axios');

const tokenAbi = [{"payable":false,"stateMutability":"nonpayable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_id","type":"uint256"},{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_block","type":"uint256"},{"indexed":false,"name":"_storage","type":"address"},{"indexed":false,"name":"_oldContract","type":"address"}],"name":"Initialize","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_block","type":"uint256"},{"indexed":false,"name":"_nextContract","type":"address"}],"name":"Retire","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_id","type":"uint256"},{"indexed":true,"name":"_from","type":"address"},{"indexed":false,"name":"_data","type":"string"}],"name":"Log","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_id","type":"uint256"}],"name":"UpdateDecimals","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_id","type":"uint256"}],"name":"UpdateName","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_id","type":"uint256"}],"name":"UpdateSymbol","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_id","type":"uint256"},{"indexed":false,"name":"_uri","type":"string"}],"name":"SetURI","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_id","type":"uint256"},{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"}],"name":"Assign","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_id","type":"uint256"},{"indexed":true,"name":"_creator","type":"address"}],"name":"AcceptAssignment","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_id","type":"uint256"},{"indexed":true,"name":"_creator","type":"address"},{"indexed":false,"name":"_isNonFungible","type":"bool"}],"name":"Create","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_id","type":"uint256"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_id","type":"uint256"}],"name":"UpdateMaxMeltFee","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_id","type":"uint256"}],"name":"UpdateMeltFee","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_operator","type":"address"},{"indexed":true,"name":"_id","type":"uint256"},{"indexed":false,"name":"_approved","type":"bool"}],"name":"OperatorApproval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_id","type":"uint256"},{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_id","type":"uint256"},{"indexed":true,"name":"_sender","type":"address"},{"indexed":true,"name":"_feeId","type":"uint256"},{"indexed":false,"name":"_feeValue","type":"uint256"}],"name":"TransferFee","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_id","type":"uint256"}],"name":"UpdateMaxTransferFee","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_id","type":"uint256"}],"name":"UpdateTransferable","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_id","type":"uint256"}],"name":"UpdateTransferFee","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_id","type":"uint256"},{"indexed":true,"name":"_account","type":"address"},{"indexed":false,"name":"_whitelisted","type":"address"},{"indexed":false,"name":"_on","type":"bool"}],"name":"Whitelist","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_id","type":"uint256"},{"indexed":true,"name":"_owner","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Melt","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_id","type":"uint256"},{"indexed":true,"name":"_sender","type":"address"}],"name":"DeployERCAdapter","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_tradeId","type":"uint256"},{"indexed":true,"name":"_firstParty","type":"address"},{"indexed":true,"name":"_secondParty","type":"address"},{"indexed":false,"name":"_escrowedEnjFirstParty","type":"uint256"}],"name":"CreateTrade","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_tradeId","type":"uint256"},{"indexed":true,"name":"_firstParty","type":"address"},{"indexed":true,"name":"_secondParty","type":"address"},{"indexed":false,"name":"_receivedEnjFirstParty","type":"uint256"},{"indexed":false,"name":"_changeEnjFirstParty","type":"uint256"},{"indexed":false,"name":"_receivedEnjSecondParty","type":"uint256"}],"name":"CompleteTrade","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_tradeId","type":"uint256"},{"indexed":true,"name":"_firstParty","type":"address"},{"indexed":false,"name":"_receivedEnjFirstParty","type":"uint256"}],"name":"CancelTrade","type":"event"},{"constant":true,"inputs":[{"name":"_interfaceID","type":"bytes4"}],"name":"supportsInterface","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_totalSupply","type":"uint256"},{"name":"_initialReserve","type":"uint256"},{"name":"_supplyModel","type":"address"},{"name":"_meltValue","type":"uint256"},{"name":"_meltFeeRatio","type":"uint16"},{"name":"_transferable","type":"uint8"},{"name":"_transferFeeSettings","type":"uint256[3]"},{"name":"_nonFungible","type":"bool"}],"name":"create","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_initialReserve","type":"uint256"}],"name":"minMeltValue","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"},{"name":"_to","type":"address[]"},{"name":"_values","type":"uint256[]"}],"name":"mintFungibles","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"},{"name":"_to","type":"address[]"}],"name":"mintNonFungibles","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"},{"name":"_to","type":"address[]"},{"name":"_data","type":"uint128[]"}],"name":"mintNonFungiblesWithData","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"reserve","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"},{"name":"_value","type":"uint128"}],"name":"releaseReserve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"},{"name":"_name","type":"string"}],"name":"updateName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"},{"name":"_creator","type":"address"}],"name":"assign","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"}],"name":"acceptAssignment","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"},{"name":"_account","type":"address"},{"name":"_whitelisted","type":"address"},{"name":"_on","type":"bool"}],"name":"setWhitelisted","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"},{"name":"_transferable","type":"uint8"}],"name":"setTransferable","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"},{"name":"_fee","type":"uint16"}],"name":"setMeltFee","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"},{"name":"_fee","type":"uint16"}],"name":"decreaseMaxMeltFee","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"},{"name":"_fee","type":"uint256"}],"name":"setTransferFee","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"},{"name":"_fee","type":"uint256"}],"name":"decreaseMaxTransferFee","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"},{"name":"_decimals","type":"uint8"},{"name":"_symbol","type":"string"}],"name":"deployERC20Adapter","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"},{"name":"_symbol","type":"string"}],"name":"deployERC721Adapter","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"},{"name":"_data","type":"string"}],"name":"addLog","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"typeCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint256"}],"name":"typeByIndex","outputs":[{"name":"_id","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"nonFungibleTypeCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint256"}],"name":"nonFungibleTypeByIndex","outputs":[{"name":"_id","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"fungibleTypeCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint256"}],"name":"fungibleTypeByIndex","outputs":[{"name":"_id","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"typeData","outputs":[{"name":"_name","type":"string"},{"name":"_creator","type":"address"},{"name":"_meltValue","type":"uint256"},{"name":"_meltFeeRatio","type":"uint16"},{"name":"_meltFeeMaxRatio","type":"uint16"},{"name":"_supplyModel","type":"address"},{"name":"_totalSupply","type":"uint256"},{"name":"_circulatingSupply","type":"uint256"},{"name":"_reserve","type":"uint256"},{"name":"_transferable","type":"uint8"},{"name":"_transferFeeData","type":"uint256[4]"},{"name":"_nonFungible","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"transferSettings","outputs":[{"name":"_transferable","type":"uint8"},{"name":"_transferFeeType","type":"uint8"},{"name":"_transferFeeCurrency","type":"uint256"},{"name":"_transferFeeValue","type":"uint256"},{"name":"_transferFeeMaxValue","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"},{"name":"_creator","type":"address"}],"name":"isCreatorOf","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"},{"name":"_account","type":"address"},{"name":"_whitelisted","type":"address"}],"name":"whitelisted","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"mintableSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"circulatingSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}, {"name":"_id","type":"uint256"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"getERC20Adapter","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"getERC721Adapter","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_id","type":"uint256"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_id","type":"uint256"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"safeTransfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_id","type":"uint256"},{"name":"_value","type":"uint256"},{"name":"_msgSender","type":"address"}],"name":"transferAdapter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_id","type":"uint256"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_id","type":"uint256"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_id","type":"uint256"},{"name":"_value","type":"uint256"},{"name":"_msgSender","type":"address"}],"name":"transferFromAdapter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_ids","type":"uint256[]"},{"name":"_values","type":"uint256[]"}],"name":"batchTransfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_ids","type":"uint256[]"},{"name":"_values","type":"uint256[]"},{"name":"_data","type":"bytes"}],"name":"safeBatchTransfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_ids","type":"uint256[]"},{"name":"_values","type":"uint256[]"}],"name":"batchTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_ids","type":"uint256[]"},{"name":"_values","type":"uint256[]"},{"name":"_data","type":"bytes"}],"name":"safeBatchTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address[]"},{"name":"_ids","type":"uint256[]"},{"name":"_values","type":"uint256[]"}],"name":"multicastTransfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address[]"},{"name":"_ids","type":"uint256[]"},{"name":"_values","type":"uint256[]"},{"name":"_data","type":"bytes"}],"name":"safeMulticastTransfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address[]"},{"name":"_to","type":"address[]"},{"name":"_ids","type":"uint256[]"},{"name":"_values","type":"uint256[]"}],"name":"multicastTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"},{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_id","type":"uint256"},{"name":"_currentValue","type":"uint256"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_id","type":"uint256"},{"name":"_currentValue","type":"uint256"},{"name":"_value","type":"uint256"},{"name":"_msgSender","type":"address"}],"name":"approveAdapter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_ids","type":"uint256[]"},{"name":"_currentValues","type":"uint256[]"},{"name":"_values","type":"uint256[]"}],"name":"batchApprove","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_operator","type":"address"},{"name":"_ids","type":"uint256[]"},{"name":"_approved","type":"bool"}],"name":"setApproval","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_operator","type":"address"},{"name":"_approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_operator","type":"address"},{"name":"_id","type":"uint256"},{"name":"_approved","type":"bool"},{"name":"_msgSender","type":"address"}],"name":"setApprovalAdapter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_operator","type":"address"},{"name":"_id","type":"uint256"}],"name":"isApproved","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"},{"name":"_value","type":"uint256"},{"name":"_from","type":"address"},{"name":"_to","type":"address"}],"name":"transferFees","outputs":[{"name":"_transferValue","type":"uint256"},{"name":"_minTransferValue","type":"uint256"},{"name":"_transferFeeCurrency","type":"uint256"},{"name":"_fee","type":"uint256"},{"name":"_maxFee","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_askingIds","type":"uint256[]"},{"name":"_askingValues","type":"uint128[]"},{"name":"_offeringIds","type":"uint256[]"},{"name":"_offeringValues","type":"uint128[]"},{"name":"_secondParty","type":"address"}],"name":"createTrade","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"tradeCompletable","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"}],"name":"completeTrade","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"}],"name":"cancelTrade","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_ids","type":"uint256[]"},{"name":"_values","type":"uint256[]"}],"name":"melt","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"ownerOf","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"},{"name":"_uri","type":"string"}],"name":"setURI","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"uri","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"nonFungibleCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"},{"name":"_index","type":"uint256"}],"name":"nonFungibleByIndex","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"},{"name":"_owner","type":"address"},{"name":"_index","type":"uint256"}],"name":"nonFungibleOfOwnerByIndex","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"isNonFungible","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"isContract","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_erc20ContractAddress","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"releaseERC20","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"releaseETH","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_erc721ContractAddress","type":"address"},{"name":"_to","type":"address"},{"name":"_token","type":"uint256"}],"name":"releaseERC721","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_erc1155ContractAddress","type":"address"},{"name":"_to","type":"address"},{"name":"_id","type":"uint256"},{"name":"_value","type":"uint256"}],"name":"releaseERC1155","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_storage","type":"address"},{"name":"_oldContract","type":"address"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_nextContract","type":"address"}],"name":"retire","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];
const enjinAbi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"releaseAdvisorTokens","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"allowTransfers","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"maxPresaleSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"endTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalAllocated","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"crowdFundAddress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"standard","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"withdrawTokens","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"minCrowdsaleAllocation","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"enjinTeamAllocation","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"retrieveUnsoldTokens","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"advisorAddress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"addToAllocation","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"incentivisationAllocation","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"ENJ_UNIT","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"incentivisationFundAddress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"releaseEnjinTeamTokens","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalAllocatedToAdvisors","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"enjinTeamAddress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalAllocatedToTeam","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"advisorsAllocation","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"_crowdFundAddress","type":"address"},{"name":"_advisorAddress","type":"address"},{"name":"_incentivisationFundAddress","type":"address"},{"name":"_enjinTeamAddress","type":"address"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_prevOwner","type":"address"},{"indexed":false,"name":"_newOwner","type":"address"}],"name":"OwnerUpdate","type":"event"}];
const tokenAddress = '0xfaafdc07907ff5120a76b34b731b278c38d6043c';
const enjinAddress = '0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c';

/** Enjin Adapter */
class EnjinAdapter {
  /**
   * Create adapter
   * @param {Object} web3 - Web3 provider
   */
  constructor(web3) {
    this.web3       = web3;
    this.tokenAddress = tokenAddress;
    this.enjinAddress = enjinAddress;
    this.enjinContract = false;
    this.tokenContract = false;
  }

  /**
   * Create contract objects for enjin token and enjin item
   */
  async init() {
    this.enjinContract = new this.web3.eth.Contract(enjinAbi, this.enjinAddress);
    this.tokenContract = new this.web3.eth.Contract(tokenAbi, this.tokenAddress);
    return true;
  }

  /**
   * Check if address has approved enjin to be spent from item contract
   * @param {string} targetAddress - Address to check
   */
  async isApproved(targetAddress) {
    try {
      let allowance = await this.enjinContract.methods.allowance(targetAddress, this.tokenAddress).call({from: targetAddress});
      if (!allowance || allowance == 0 || allowance == '0') {
        throw 'No allowance';
      }
      return allowance;
    } catch(ex) {
      let getApproval = await this.approveWalletSpend(targetAddress);
      if (!getApproval) {
        return false;
      }
      return getApproval;
    }
  }

  /**
   * Create Approve() transaction for address
   * @param {string} target - Target address to create transaction for
   */
  async approveWalletSpend(target) {
    try {
      let txData = await this.enjinContract.methods.approve(this.tokenAddress, this.web3.utils.toHex('0x00000000000000000000ffffffffffffffffffffffffffffffffffffffffffff')).encodeABI();
      let gas = await this.enjinContract.methods.approve(this.tokenAddress, this.web3.utils.toHex('0x00000000000000000000ffffffffffffffffffffffffffffffffffffffffffff')).estimateGas();
      let rawTx = {};
      rawTx['gas'] = gas;
      rawTx['data'] = txData;
      rawTx['to'] = this.enjinAddress;
      rawTx['from'] = target;
      return rawTx;
    } catch(ex) {
      return false;
    }
  }

  /**
   * Transfer item
   * @param {string} to - The address to send item to
   * @param {string} token_id - The id of the token to be sent ! no batches
   * @param {string} from - The address that is sending the item
   */
  async transfer(to, token_id, from) {
    let owner = await this.getOwner(from, token_id);
    if (!owner) {
      return {'error': 'Address does not own this token!'};
    }


    let gasEst = await this.estimateGas(to, token_id, from);
    if (!gasEst) {
      return {'error': "You don't have enough Enjin to send this item!"};
    }

    let encodeData = await this.encodeABI(to, token_id, from);
    if (!encodeData) {
      return {'error': 'Encoding ABI error!'};
    }

    return {
      'data': encodeData,
      'gas' : gasEst,
      'contract': this.tokenAddress
    }
  }

  /**
   * Check if address is the owner of an item
   * @param {string} address - Address in question of ownership
   * @param {string} token_id - Token id to check ownership of
   */
  async getOwner(address, token_id) {
    try {
      let owner = await this.tokenContract.methods.balanceOf(address, this.web3.utils.toHex(token_id)).call({from: address});
      if (!owner || owner <= 0 || owner == '0') {
        throw "Not Owner";
      }
      return true;
    } catch(ex) {
      return false;
    }
  }

  /**
   * Estimate Gas Cost
   * @param {string} to - Address receiving item
   * @param {string} token_id - Id of the item being sent
   * @param {string} from - Address of the sender
   */
  async estimateGas(to, token_id, from) {
    try {
      let gas = await this.tokenContract.methods.safeTransferFrom(from, to, this.web3.utils.toHex(token_id), 1, []).estimateGas({from: from});
      return gas;
    } catch(ex) {
      return false;
    }
  }

  /**
   * Encode transaction params to be signed by sender
   * @param {string} to - Address receiving item
   * @param {string} token_id - Id of the item being sent
   * @param {string} from - Address of the sender
   */
  async encodeABI(to, token_id, from) {
    try {
      let data = await this.tokenContract.methods.safeTransferFrom(from, to, this.web3.utils.toHex(token_id), 1, []).encodeABI();
      return data;
    } catch(ex) {
      return false;
    }
  }

  /**
   * Get information about a token
   * @param {string} id - Id of the token
   */
  async tokenInfo(id) {
    let [tokenName, tokenImage] = await this.getMetadata(id);
    let contractName = "Enjin";
    return {
      contract_name: contractName,
      token_name: tokenName,
      token_image: tokenImage,
      id: id
    }
  }

  /**
   * Get metadata of a token
   * @param {string} token_id - Id of the token
   */
  async getMetadata(token_id) {
    try {
      let metadataURI = await this.tokenContract.methods.uri(this.web3.utils.toHex(token_id)).call();
      let [name, image] = await this.metadata(metadataURI);
      return [name, image];
    } catch(ex) {
      return [false, false]
    }
  }

  /**
   * Fetch metadata from URI
   * @param {string} URI - FQDN for metadata
   */
  async metadata(URI) {
    try {
      let req = await axios.get(URI, {timeout: 5000});
      if (!req.data) {
        throw 'bad uri';
      }
      let name = req.data.name ? req.data.name : (req.data.properties && req.data.properties && req.data.properties.name ? req.data.properties.name : false);
      let image = req.data.image ? req.data.image : (req.data.properties && req.data.properties && req.data.properties.image ? req.data.properties.image : false);
      return [name, image];
    } catch(ex) {
      return [false, false];
    }
  }

}
module.exports = EnjinAdapter;
