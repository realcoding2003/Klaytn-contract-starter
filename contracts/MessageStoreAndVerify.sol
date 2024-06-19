// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title StringHashStorage
 * @dev This contract allows storing and retrieving SHA256 hashes of strings concatenated with a fixed pattern on the blockchain using transaction logs.
 */
contract StringHashStorage {

    /// @notice Counter to generate unique identifiers for each stored hash.
    uint256 private currentId;

    /// @notice Event emitted when a hash is stored.
    event HashStored(address indexed sender, uint256 indexed id, bytes32 hash);

    /// @notice Fixed pattern used for concatenation
    string private constant FIXED_PATTERN = "S3cuReP@ttern";

    /**
     * @notice Concatenates two strings with a fixed pattern, computes the SHA256 hash, and stores it.
     * @param str1 The first string.
     * @param str2 The second string.
     * @return id The unique identifier associated with the stored hash.
     * @return hash The SHA256 hash of the concatenated strings.
     */
    function storeHash(string memory str1, string memory str2) external returns (uint256 id, bytes32 hash) {
        string memory combinedString = concatenateWithPattern(str1, str2);
        hash = sha256(abi.encodePacked(combinedString));
        id = currentId++;
        emit HashStored(msg.sender, id, hash);
    }

    /**
     * @notice Concatenates two strings with a fixed pattern and computes the SHA256 hash.
     * @param str1 The first string.
     * @param str2 The second string.
     * @return hash The SHA256 hash of the concatenated strings.
     */
    function computeHash(string memory str1, string memory str2) external pure returns (bytes32 hash) {
        string memory combinedString = concatenateWithPattern(str1, str2);
        hash = sha256(abi.encodePacked(combinedString));
    }

    /**
     * @notice Concatenates two strings with a fixed pattern in between.
     * @param str1 The first string.
     * @param str2 The second string.
     * @return result The concatenated string.
     */
    function concatenateWithPattern(string memory str1, string memory str2) internal pure returns (string memory) {
        return string(abi.encodePacked(str1, FIXED_PATTERN, str2));
    }
}
