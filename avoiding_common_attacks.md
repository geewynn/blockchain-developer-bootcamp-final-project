The contract applies the following measures to avoid common security pitfalls

-Proper setting of visibility for functions - SWC-100:
 - external for functions that are only called by externally
 - public for functions that are called both internally and externally
 - payable for function that receives ETH payment
 - internal and private for functions that are used within the contracts

 - Using a specific pragma compile - Solidity 0.8.4 is used and not floating pragma - SWC-103

 - Use require to check sender's balances and allowances, where applicable
 
 - Use Modifiers only for validations.

