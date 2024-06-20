# 스마트 컨트랙트 배포 가이드 (클레이튼 네트워크)

이 README 파일은 스마트 컨트랙트 코드를 [Remix](https://remix.ethereum.org)를 통해 클레이튼 네트워크에 배포하는 절차를 안내합니다.

## 사전 준비

1. **Remix IDE**: [Remix IDE](https://remix.ethereum.org)에 접속합니다.
2. **MetaMask**: [MetaMask](https://metamask.io/) 확장을 설치하고 설정합니다. MetaMask는 클레이튼 네트워크와 연결할 수 있습니다.
3. **KLAY**: 배포할 네트워크에서 사용할 KLAY를 확보합니다. 이는 테스트 네트워크 또는 메인 네트워크일 수 있습니다.

## 클레이튼 네트워크 설정

### 클레이튼 테스트 네트워크 (Baobab)

클레이튼에는 테스트 네트워크인 Baobab이 있습니다. 메인 네트워크에 배포하기 전에 Baobab 테스트 네트워크를 사용하여 스마트 컨트랙트를 테스트할 수 있습니다.

1. **Baobab 네트워크 추가**:
    - MetaMask를 열고 네트워크 드롭다운에서 `네트워크 추가`를 클릭합니다.
    - 클레이튼 테스트 네트워크 정보를 입력합니다:
        - **Network Name**: Klaytn Baobab Testnet
        - **New RPC URL**: https://api.baobab.klaytn.net:8651/
        - **Chain ID**: 1001
        - **Currency Symbol**: KLAY
        - **Block Explorer URL**: https://baobab.scope.klaytn.com/

2. **KLAY 받기**:
    - Baobab 테스트 네트워크에 연결된 MetaMask 지갑으로 이동합니다.
    - [Klaytn Faucet](https://baobab.wallet.klaytn.foundation/faucet)에서 테스트용 KLAY를 요청합니다.

### 클레이튼 메인 네트워크 (Cypress)

1. **Cypress 네트워크 추가**:
    - MetaMask를 열고 네트워크 드롭다운에서 `네트워크 추가`를 클릭합니다.
    - 클레이튼 메인 네트워크 정보를 입력합니다:
        - **Network Name**: Klaytn Cypress Mainnet
        - **New RPC URL**: https://public-node-api.klaytnapi.com/v1/cypress
        - **Chain ID**: 8217
        - **Currency Symbol**: KLAY
        - **Block Explorer URL**: https://scope.klaytn.com/

### 사설 네트워크

클레이튼 사설 네트워크를 설정할 수도 있습니다. 이는 테스트나 개발 목적을 위해 로컬에서 네트워크를 운영할 때 유용합니다. 사설 네트워크 설정에 대한 자세한 내용은 [클레이튼 문서](https://docs.klaytn.foundation/)를 참조하세요.

## 스마트 컨트랙트 작성 및 컴파일

1. **스마트 컨트랙트 파일 생성**:
    - Remix IDE에서 `contracts` 폴더 아래에 새로운 `.sol` 파일을 생성합니다.
    - 예시: `MessageStoreAndVerify.sol`

2. **스마트 컨트랙트 코드 작성**:
    - 첨부된 예제 소스(`MessageStoreAndVerify.sol`)를 사용하여 스마트 컨트랙트 코드를 작성합니다.
    - 예제 소스 경로: `contracts/MessageStoreAndVerify.sol`

3. **컴파일**:
    - 좌측 메뉴에서 'Solidity 컴파일러'를 클릭합니다.
    - 사용 중인 Solidity 컴파일러 버전을 확인한 후 `Compile MessageStoreAndVerify.sol` 버튼을 클릭합니다.

## 스마트 컨트랙트 배포

1. **배포 준비**:
    - 좌측 메뉴에서 'Deploy & Run Transactions'를 클릭합니다.
    - '환경' 드롭다운 메뉴에서 'Injected Web3'를 선택합니다 (MetaMask와 연결됨).

2. **배포 파라미터 설정**:
    - 컴파일된 컨트랙트를 선택합니다 (예: `MessageStoreAndVerify`).
    - 필요한 경우 생성자(constructor)에 필요한 초기 파라미터를 입력합니다.

3. **배포 실행**:
    - `Deploy` 버튼을 클릭합니다.
    - MetaMask 팝업에서 트랜잭션을 확인하고 승인합니다.

4. **배포 확인**:
    - 트랜잭션이 성공하면 Remix의 'Deployed Contracts' 섹션에 배포된 컨트랙트가 표시됩니다.
    - 여기에서 배포된 컨트랙트와 상호작용할 수 있습니다.

## 테스트 및 상호작용

1. **읽기 메서드 호출**:
    - 'Deployed Contracts' 섹션에서 배포된 컨트랙트를 찾습니다.
    - 공개 변수를 클릭하여 현재 값을 확인합니다.

2. **쓰기 메서드 호출**:
    - 쓰기 메서드를 클릭하고 필요한 파라미터를 입력한 후 'Transact' 버튼을 클릭합니다.
    - MetaMask 팝업에서 트랜잭션을 확인하고 승인합니다.
    - 트랜잭션이 성공하면 값을 다시 확인하여 변경된 내용을 확인합니다.

## 문제 해결

1. **컴파일 오류**:
    - Solidity 코드의 문법 오류를 확인하고 수정합니다.
    - 사용 중인 컴파일러 버전이 코드와 호환되는지 확인합니다.

2. **배포 오류**:
    - MetaMask 지갑에 충분한 KLAY가 있는지 확인합니다.
    - 선택한 네트워크가 올바른지 확인합니다.

## 추가 자료

- [Remix Documentation](https://remix-ide.readthedocs.io/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [MetaMask Documentation](https://metamask.io/faqs.html)
- [Klaytn Documentation](https://docs.klaytn.foundation/)

---

이 문서를 통해 스마트 컨트랙트를 클레이튼 네트워크를 사용하여 배포하는 방법을 배우셨기를 바랍니다. 추가 질문이 있으면 언제든지 문의해주세요.