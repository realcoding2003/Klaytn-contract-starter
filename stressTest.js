const Caver = require('caver-js');
const fs = require('fs');
const dotenv = require('dotenv');
const crypto = require('crypto');

// 환경 변수 로드
dotenv.config();

// 환경 변수에서 RPC URL, 개인 키, 지갑 주소 가져오기
const rpcURL = process.env.RPC_URL;
const privateKey = process.env.PRIVATE_KEY;
const senderAddress = process.env.ADDRESS;

// 클레이튼 네트워크 설정
const caver = new Caver(rpcURL);

// 파일에서 ABI 정보 및 계약 주소 읽기
const contractAddress = fs.readFileSync('deployed/Address.txt', 'utf8').trim();
const contractABI = JSON.parse(fs.readFileSync('deployed/ABI.json', 'utf8'));

// 컨트랙트 인스턴스 생성
const contract = new caver.klay.Contract(contractABI, contractAddress);

// Klaytn 계정 설정
caver.klay.accounts.wallet.add(privateKey);

/**
 * @notice 메시지와 키를 연결하고 SHA256 해시를 계산한 후 블록체인에 저장합니다.
 * @param {string} message - 저장할 메시지.
 * @param {string} key - 메시지와 결합할 키 (예: 비밀번호).
 * @returns {number|null} - 해시가 저장된 블록 번호 또는 오류 발생 시 null.
 */
async function storeHash(message, key) {
    try {
        console.log(`- Storing hash for message: "${message}" with key: "${key}"`);
        console.time('==> storeHash'); // Start timing

        // storeHash 함수 호출 및 트랜잭션 전송
        const receipt = await contract.methods.storeHash(message, key).send({
            from: senderAddress,
            gas: '3000000' // 충분한 가스 한도 설정
        });

        // 트랜잭션 영수증에서 트랜잭션 해시와 블록 번호 출력
        console.log(`- Transaction hash: ${receipt.transactionHash}`);
        console.log(`- Block number: ${receipt.blockNumber}`);
        console.timeEnd('==> storeHash'); // End timing
        return receipt.blockNumber; // 저장된 해시가 포함된 블록 번호 반환
    } catch (error) {
        console.error(`Error storing hash: ${error.message}`);
        if (error.receipt) {
            console.error(`- Transaction hash: ${error.receipt.transactionHash}`);
            console.error(`- Block number: ${error.receipt.blockNumber}`);
            console.error(`- Error details: ${JSON.stringify(error.receipt, null, 2)}`);
        }
        return null; // 오류 발생 시 null 반환
    }
}

/**
 * @notice 무작위 문자열을 생성합니다.
 * @param {number} length - 생성할 문자열의 길이.
 * @returns {string} - 생성된 무작위 문자열.
 */
function generateRandomString(length) {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
}

/**
 * @notice 무작위 메시지와 키를 생성하여 storeHash 함수를 반복 호출합니다.
 */
async function randomHashStorageTest() {
    let i = 1;
    while (true) {
        const message = generateRandomString(32);
        const key = generateRandomString(16);
        console.log(`\n-----------------------------------------------------\n반복 ${i}: 메시지 "${message}"와 키 "${key}"에 대한 해시 저장 중`);

        try {
            await Promise.race([
                storeHash(message, key),
                new Promise((_, reject) => setTimeout(() => reject(new Error('타임아웃')), 3000))
            ]);
        } catch (error) {
            console.error(`반복 ${i} 중 오류 발생: ${error.message}`);
        }

        i++;
    }
}

// 테스트 실행
randomHashStorageTest().then(r => {});
