require('dotenv').config();
const Caver = require('caver-js');

const privateKey = process.env.PRIVATE_KEY;
const rpcUrl = process.env.BAobab_RPC_URL;
const contractAddress = 'your_contract_address_here';
const contractABI = [/* ABI 배열을 여기에 복사합니다 */];

const caver = new Caver(rpcUrl);

const deployer = caver.wallet.keyring.createFromPrivateKey(privateKey);
caver.wallet.add(deployer);

const contract = new caver.klay.Contract(contractABI, contractAddress);

async function setMessage(message, password) {
    const receipt = await contract.methods.setMessage(message, password).send({
        from: deployer.address,
        gas: 2000000
    });
    console.log('Message set:', receipt);
}

async function verifyMessage(message, password, blockNumber, blockHash) {
    const result = await contract.methods.verifyMessage(message, password, blockNumber, blockHash).call();
    console.log('Message verification result:', result);
}

// 메시지 설정 예제
setMessage('Hello, Klaytn!', 'myPassword').catch(console.error);

// 메시지 검증 예제 (적절한 블록 번호와 블록 해시를 제공해야 합니다)
verifyMessage('Hello, Klaytn!', 'myPassword', 123456, '0x...').catch(console.error);
