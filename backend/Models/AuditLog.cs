using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FraudDetectionBackend.Models;

public class AuditLog
{
    [Key]
    public int LogId { get; set; }

    [ForeignKey(nameof(Account))]
    public int AccountId { get; set; }

    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    [Required]
    [MaxLength(1000)]
    public string Details { get; set; } = string.Empty;

    public Account Account { get; set; } = null!;
}
