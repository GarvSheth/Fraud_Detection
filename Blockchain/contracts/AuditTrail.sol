// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AuditTrail {

    address private owner;

    constructor() {
        owner = msg.sender;
    }

    struct AuditRecord {
        uint256 auditId;
        string transactionId;
        string eventType;
        string decision;
        uint256 timestamp;
        bytes32 recordHash;
    }

    mapping(uint256 => AuditRecord) private auditRecords;

    event AuditRecordStored(
        uint256 indexed auditId,
        string transactionId,
        string eventType,
        string decision,
        uint256 timestamp,
        bytes32 recordHash
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }


    //store function
    function storeAuditRecord(
        uint256 _auditId,
        string memory _transactionId,
        string memory _eventType,
        string memory _decision,
        bytes32 _recordHash
    )public onlyOwner{

        require(auditRecords[_auditId].timestamp == 0,"Audit already exists");

        auditRecords[_auditId] = AuditRecord({
            auditId: _auditId,
            transactionId: _transactionId,
            eventType: _eventType,
            decision: _decision,
            timestamp: block.timestamp,
            recordHash: _recordHash
        });

        emit AuditRecordStored(
            _auditId,
            _transactionId,
            _eventType,
            _decision,
            block.timestamp,
            _recordHash
        );
    }

    //get function
    function getAuditRecord(uint256 _auditId) public view returns(AuditRecord memory){
        require(auditRecords[_auditId].timestamp != 0,"Audit record does not exist");
        return auditRecords[_auditId];
    }

    //verify function
    function verifyAuditRecord(uint256 _auditId,bytes32 _currentHash) public view returns(bool){
        require(auditRecords[_auditId].timestamp != 0,"Audit record does not exist");
        return auditRecords[_auditId].recordHash == _currentHash;
    }
}