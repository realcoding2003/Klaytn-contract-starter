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
