const Caver = require('caver-js');
const fs = require('fs');
const dotenv = require('dotenv');

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
        console.log("[Starting storeHash function]");
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
 * @notice 특정 블록에 저장된 해시 값을 가져옵니다.
 * @param {number} blockNumber - 해시 값을 가져올 블록 번호.
 * @returns {Array<string>} - 저장된 해시 값의 배열.
 */
async function getHashesInBlock(blockNumber) {
    try {
        console.log("[Starting getHashesInBlock function]");
        console.log(`- Fetching events from block ${blockNumber}`);
        console.time('==> getHashesInBlock'); // Start timing

        // 특정 블록에서 발생한 HashStored 이벤트 가져오기
        const events = await contract.getPastEvents('HashStored', {
            fromBlock: blockNumber,
            toBlock: blockNumber
        });

        console.timeEnd('==> getHashesInBlock'); // End timing

        // 각 이벤트에서 해시 값을 출력
        events.forEach(event => {
            console.log(`- ID: ${event.returnValues.id}, Hash: ${event.returnValues.hash}`);
        });

        // 해시 값의 배열 반환
        return events.map(event => event.returnValues.hash);
    } catch (error) {
        console.error(`Error fetching events: ${error.message}`);
        return []; // 오류 발생 시 빈 배열 반환
    }
}

/**
 * @notice 메시지와 키를 연결하고 SHA256 해시를 계산합니다.
 * @param {string} message - 연결할 메시지.
 * @param {string} key - 연결할 키.
 * @returns {string|null} - 계산된 해시 값 또는 오류 발생 시 null.
 */
async function computeHash(message, key) {
    try {
        console.log("[Starting computeHash function]");
        console.log(`- Computing hash for message: "${message}" with key: "${key}"`);

        // computeHash 함수 호출
        const hash = await contract.methods.computeHash(message, key).call();

        // 계산된 해시 값 출력
        console.log(`- Computed hash: ${hash}`);
        return hash; // 계산된 해시 값 반환
    } catch (error) {
        console.error(`Error computing hash: ${error.message}`);
        return null; // 오류 발생 시 null 반환
    }
}

/**
 * @notice 특정 블록에 저장된 해시 값이 메시지와 키의 해시 값과 일치하는지 확인합니다.
 * @param {number} blockNumber - 검증할 해시 값이 저장된 블록 번호.
 * @param {string} message - 연결할 메시지.
 * @param {string} key - 연결할 키.
 */
async function verifyHash(blockNumber, message, key) {
    try {
        console.log("[Starting verifyHash function]");
        console.log(`- Verifying hash for message: "${message}" with key: "${key}" at block number: ${blockNumber}`);
        console.time('==> verifyHash'); // Start timing

        // 블록체인에서 저장된 해시 값 가져오기
        const storedHashes = await getHashesInBlock(blockNumber);

        // 입력된 메시지와 키의 해시 값 계산
        const computedHash = await computeHash(message, key);

        // 해시 값 비교
        const isValid = storedHashes.includes(computedHash);
        // 검증 결과 출력
        console.timeEnd('==> verifyHash'); // End timing
        console.log(`- Verification result: ${isValid}`);
    } catch (error) {
        console.error(`Error verifying hash: ${error.message}`);
    }
}

// 테스트 시퀀스
async function test() {
    const message = "exampleMessage";
    const key = "exampleKey";

    // 1. 해시 저장
    console.log("=====================================");
    console.log("Starting hash storage test...");
    console.log("=====================================");
    const blockNumber = await storeHash(message, key);
    if (!blockNumber) {
        console.error("Failed to store hash.");
        return;
    }
    console.log(`- Hash stored in block number: ${blockNumber}`);

    // 2. 검증
    console.log("=====================================");
    console.log("Starting hash verification test...");
    console.log("=====================================");
    await verifyHash(blockNumber, message, key);
}

// 테스트 실행
test();
