# MessageStoreAndVerify 스마트 계약

이 스마트 계약은 메시지와 비밀번호, 블록 해시를 사용하여 메시지를 설정하고 검증할 수 있도록 합니다. 아래 절차에 따라 Remix를 통해 스마트 계약을 배포할 수 있습니다.

## 요구사항

- 웹 브라우저 (Google Chrome, Firefox 등)
- 인터넷 연결

## 배포 절차

1. **Remix IDE 접속**

   웹 브라우저를 열고 [Remix IDE](https://remix.ethereum.org/)에 접속합니다.

2. **새 파일 생성**

   좌측 파일 탐색기에서 `contracts` 폴더를 선택한 후, `contracts` 폴더 내에 `MessageStoreAndVerify.sol`이라는 새 파일을 생성합니다.

3. **스마트 계약 코드 복사**

   아래 코드를 새로 생성한 `MessageStoreAndVerify.sol` 파일에 복사합니다:

   ```solidity
   // SPDX-License-Identifier: MIT
   pragma solidity ^0.8.18;

   /**
    * @title MessageStoreAndVerify
    * @dev 이 계약은 메시지와 비밀번호, 블록 해시를 사용하여 메시지를 설정하고 검증할 수 있도록 합니다.
    */
   contract MessageStoreAndVerify {
       /// @notice 사용자가 설정한 원본 메시지입니다.
       string public message;

       /// @notice 메시지, 비밀번호, 블록 해시를 결합한 해시된 메시지입니다.
       bytes32 public hashedMessage;

       /// @notice 메시지가 설정된 블록 번호입니다.
       uint256 public blockNumber;

       /// @notice 새로운 메시지가 설정될 때 발생하는 이벤트입니다.
       /// @param message 원본 메시지입니다.
       /// @param hashedMessage 해시된 메시지입니다.
       /// @param blockNumber 메시지가 설정된 블록 번호입니다.
       /// @param blockHash 블록의 해시 값입니다.
       event MessageSet(string message, bytes32 hashedMessage, uint256 blockNumber, bytes32 blockHash);

       /**
        * @notice 비밀번호와 함께 새로운 메시지를 설정합니다.
        * @param _message 설정할 메시지입니다.
        * @param _password 메시지를 해시하는 데 사용되는 비밀번호입니다.
        */
       function setMessage(string memory _message, string memory _password) public {
           message = _message;
           blockNumber = block.number;
           bytes32 blockHash = blockhash(blockNumber - 1);
           hashedMessage = keccak256(abi.encodePacked(_message, _password, blockHash));
           emit MessageSet(_message, hashedMessage, blockNumber, blockHash);
       }

       /**
        * @notice 현재 메시지를 반환합니다.
        * @return 현재 메시지입니다.
        */
       function getMessage() public view returns (string memory) {
           return message;
       }

       /**
        * @notice 현재 해시된 메시지를 반환합니다.
        * @return 현재 해시된 메시지입니다.
        */
       function getHashedMessage() public view returns (bytes32) {
           return hashedMessage;
       }

       /**
        * @notice 메시지가 설정된 블록 번호를 반환합니다.
        * @return 블록 번호입니다.
        */
       function getBlockNumber() public view returns (uint256) {
           return blockNumber;
       }

       /**
        * @notice 주어진 메시지, 비밀번호, 블록 번호 및 블록 해시를 사용하여 메시지를 검증합니다.
        * @param _message 검증할 원본 메시지입니다.
        * @param _password 메시지를 해시하는 데 사용되는 비밀번호입니다.
        * @param _blockNumber 메시지가 설정된 블록 번호입니다.
        * @param _blockHash 블록의 해시 값입니다.
        * @return 메시지가 검증되면 true, 그렇지 않으면 false를 반환합니다.
        */
       function verifyMessage(
           string memory _message,
           string memory _password,
           uint256 _blockNumber,
           bytes32 _blockHash
       ) public view returns (bool) {
           require(_blockNumber == blockNumber, "블록 번호가 일치하지 않습니다.");
           return keccak256(abi.encodePacked(_message, _password, _blockHash)) == hashedMessage;
       }
   }
   ```

4. **컴파일**

   좌측 메뉴에서 "Solidity Compiler" 탭을 선택한 후, "Compile MessageStoreAndVerify.sol" 버튼을 클릭하여 계약을 컴파일합니다. 컴파일러 버전은 Solidity `0.8.18`을 선택합니다.

5. **배포**

    1. 좌측 메뉴에서 "Deploy & Run Transactions" 탭을 선택합니다.
    2. "ENVIRONMENT"에서 "Injected Web3"를 선택하여 MetaMask와 같은 웹3 지갑을 연결합니다.
    3. "CONTRACT" 드롭다운에서 `MessageStoreAndVerify`를 선택합니다.
    4. "Deploy" 버튼을 클릭하여 스마트 계약을 배포합니다.
    5. MetaMask 팝업이 나타나면 트랜잭션을 확인하고 배포를 완료합니다.

6. **스마트 계약 상호작용**

배포가 완료되면 "Deployed Contracts" 섹션에서 배포된 계약을 찾을 수 있습니다. 해당 계약을 클릭하여 `setMessage`, `getMessage`, `getHashedMessage`, `getBlockNumber`, `verifyMessage` 함수와 상호작용할 수 있습니다.

이로써 `MessageStoreAndVerify` 스마트 계약을 Remix를 통해 성공적으로 배포할 수 있습니다.