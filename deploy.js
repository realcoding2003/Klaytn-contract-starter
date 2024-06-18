require('dotenv').config();
const Caver = require('caver-js');
const fs = require('fs');
const path = require('path');

const privateKey = process.env.PRIVATE_KEY;
const rpcUrl = process.env.BAOBAB_RPC_URL;
const caver = new Caver(rpcUrl);

const deployer = caver.wallet.keyring.createFromPrivateKey(privateKey);
caver.wallet.add(deployer);

async function deploy() {
    const contractPath = path.resolve(__dirname, 'contracts', 'MessageStoreAndVerify.sol');
    const contractSource = fs.readFileSync(contractPath, 'utf8');

    // 컴파일
    const compiledContract = await caver.klay.compileSolidity(contractSource);
    const contractData = compiledContract['<stdin>:MessageStoreAndVerify'];

    const contract = new caver.klay.Contract(JSON.parse(contractData.interface));

    const deployTx = contract.deploy({
        data: contractData.bytecode,
    });

    const receipt = await deployTx.send({
        from: deployer.address,
        gas: 2000000
    });

    console.log('Contract deployed at address:', receipt.contractAddress);
}

deploy().catch(console.error);
