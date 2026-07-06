namespace FraudDetectionBackend.DTOs;

public record UpdateUserProfileRequest(string Name, string Email);

public record AddAccountRequest(
    int UserId,
    string AccountNumber,
    decimal Balance,
    string? Status);

public record RaiseThreatRequest(
    Guid TransactionId,
    int RaisedForUserId,
    string Description,
    string Severity);

public record EvaluateThreatRequest(
    int ThreatId,
    string? Severity,
    string? Status);

public record ResolveThreatRequest(string? Details);

public record ThreatDecisionRequest(
    int ThreatId,
    string Decision,
    string? Details);

public record SendNotificationRequest(
    int UserId,
    string Message,
    string Type);

public record IngestTransactionRequest(
    int AccountId,
    decimal Amount,
    string? DeviceInfo,
    string? Location,
    string? Merchant);

public record RecordAuditRequest(
    int AccountId,
    string Details);
