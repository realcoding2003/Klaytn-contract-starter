pragma solidity ^0.8.0;

contract OgrpContract {
    string public message;
    bytes32 public hashedMessage;
    uint256 public blockNumber;

    event MessageSet(string message, bytes32 hashedMessage, uint256 blockNumber, bytes32 blockHash);

    function setMessage(string memory _message, string memory _password) public {
        message = _message;
        blockNumber = block.number;
        bytes32 blockHash = blockhash(blockNumber - 1);
        hashedMessage = keccak256(abi.encodePacked(_message, _password, blockHash));
        emit MessageSet(_message, hashedMessage, blockNumber, blockHash);
    }

    function getMessage() public view returns (string memory) {
        return message;
    }

    function getHashedMessage() public view returns (bytes32) {
        return hashedMessage;
    }

    function getBlockNumber() public view returns (uint256) {
        return blockNumber;
    }

    function verifyMessage(string memory _message, string memory _password, uint256 _blockNumber, bytes32 _blockHash) public view returns (bool) {
        return keccak256(abi.encodePacked(_message, _password, _blockHash)) == hashedMessage;
    }
}