# consensys-academy

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Run your unit tests
```
npm run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


## Issues Encountered 

### EthPM & open-zeppelin
When I first started developing the project I had installed the open-zeppelin libraries through EthPM.
Sadly the latest version of open-zeppelin on `npm` differs greatly from the one on `ethPM`. 
Even though they just released a new version, the ethPM registry still points to the old version.

Therefore I just imported the contracts I needed from that library manually. 

### Web3JS 
I encountered multiple issues when working with versions beyond web3js 1.0.0-beta34. 
The most important being that it uses a wrong version for xhr. 

I switched back to my favorite ethereum libary, ethers.js, for the remainder of the project. 

### Uport 
When the IPFS Infura gateway is not reachable, the QR modal to authenticate does not show. This happened on multiple occasions. 