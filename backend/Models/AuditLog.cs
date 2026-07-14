using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FraudDetectionBackend.Models;

public class AuditLog
{
    [Key]
    public int AuditId { get; set; }

    public Guid TransactionId { get; set; }

    public string EventType { get; set; } = string.Empty;

    public string Decision { get; set; } = string.Empty;

    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public Transaction? Transaction { get; set; }
}