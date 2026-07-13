import { expect } from "chai";
import { network } from "hardhat";

describe("AuditTrail", function () {

    // -------------------------------------------------
    // Helper: Deploy a fresh contract
    // -------------------------------------------------
    async function deployAuditTrail() {

        const { ethers } = await network.getOrCreate();

        const AuditTrail = await ethers.getContractFactory("AuditTrail");

        const auditTrail = await AuditTrail.deploy();

        await auditTrail.waitForDeployment();

        return { auditTrail, ethers };
    }


    // -------------------------------------------------
    // Test 1: Contract Deployment
    // -------------------------------------------------
    it("Should deploy the contract successfully", async function () {

        const { auditTrail } = await deployAuditTrail();

        const contractAddress = await auditTrail.getAddress();

        expect(contractAddress).to.be.a("string");
        expect(contractAddress).to.not.equal("");
    });


    // -------------------------------------------------
    // Test 2: Store and Retrieve Audit Record
    // -------------------------------------------------
    it("Should store and retrieve an audit record correctly", async function () {

        const { auditTrail, ethers } = await deployAuditTrail();

        const auditId = 101;
        const transactionId =
            "eaeedfb3-5383-4c53-8688-45d888139380";

        const eventType = "FRAUD_DETECTED";
        const decision = "BLOCKED";

        const recordHash = ethers.sha256(
            ethers.toUtf8Bytes(
                `${auditId}-${transactionId}-${eventType}-${decision}`
            )
        );

        // Store audit record
        const tx = await auditTrail.storeAuditRecord(
            auditId,
            transactionId,
            eventType,
            decision,
            recordHash
        );

        await tx.wait();

        // Retrieve audit record
        const record = await auditTrail.getAuditRecord(auditId);

        // Verify stored values
        expect(record.auditId).to.equal(BigInt(auditId));
        expect(record.transactionId).to.equal(transactionId);
        expect(record.eventType).to.equal(eventType);
        expect(record.decision).to.equal(decision);
        expect(record.recordHash).to.equal(recordHash);
        expect(record.timestamp > 0n).to.equal(true);
    });


    // -------------------------------------------------
    // Test 3: Correct Hash Verification
    // -------------------------------------------------
    it("Should return true for the correct audit hash", async function () {

        const { auditTrail, ethers } = await deployAuditTrail();

        const auditId = 102;
        const transactionId = "transaction-102";
        const eventType = "FRAUD_DETECTED";
        const decision = "BLOCKED";

        const recordHash = ethers.sha256(
            ethers.toUtf8Bytes(
                `${auditId}-${transactionId}-${eventType}-${decision}`
            )
        );


        const tx = await auditTrail.storeAuditRecord(
            auditId,
            transactionId,
            eventType,
            decision,
            recordHash
        );

        await tx.wait();


        const isValid = await auditTrail.verifyAuditRecord(
            auditId,
            recordHash
        );


        expect(isValid).to.equal(true);
    });


    // -------------------------------------------------
    // Test 4: Modified Hash Detection
    // -------------------------------------------------
    it("Should return false for a modified audit hash", async function () {

        const { auditTrail, ethers } = await deployAuditTrail();

        const auditId = 103;
        const transactionId = "transaction-103";
        const eventType = "FRAUD_DETECTED";
        const decision = "BLOCKED";


        // Original hash
        const originalHash = ethers.sha256(
            ethers.toUtf8Bytes(
                `${auditId}-${transactionId}-${eventType}-${decision}`
            )
        );


        // Store original audit
        const tx = await auditTrail.storeAuditRecord(
            auditId,
            transactionId,
            eventType,
            decision,
            originalHash
        );

        await tx.wait();


        // Simulate tampering:
        // Decision changed from BLOCKED to APPROVED
        const modifiedHash = ethers.sha256(
            ethers.toUtf8Bytes(
                `${auditId}-${transactionId}-${eventType}-APPROVED`
            )
        );


        const isValid = await auditTrail.verifyAuditRecord(
            auditId,
            modifiedHash
        );


        expect(isValid).to.equal(false);
    });


    // -------------------------------------------------
    // Test 5: Prevent Duplicate Audit IDs
    // -------------------------------------------------
    it("Should prevent duplicate audit records", async function () {

        const { auditTrail, ethers } = await deployAuditTrail();

        const auditId = 104;
        const transactionId = "transaction-104";
        const eventType = "FRAUD_DETECTED";
        const decision = "BLOCKED";

        const recordHash = ethers.sha256(
            ethers.toUtf8Bytes(
                `${auditId}-${transactionId}-${eventType}-${decision}`
            )
        );


        // Store first audit
        const tx = await auditTrail.storeAuditRecord(
            auditId,
            transactionId,
            eventType,
            decision,
            recordHash
        );

        await tx.wait();


        // Attempt to store duplicate audit ID
        let reverted = false;

        try {

            const duplicateTx = await auditTrail.storeAuditRecord(
                auditId,
                transactionId,
                eventType,
                decision,
                recordHash
            );

            await duplicateTx.wait();

        } catch (error) {
            reverted = true;
        }


        expect(reverted).to.equal(true);
    });

});