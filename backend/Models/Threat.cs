using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FraudDetectionBackend.Models;

public class Threat
{
    [Key]
    public int ThreatId { get; set; }

    [ForeignKey(nameof(Transaction))]
    public Guid TransactionId { get; set; }

    [ForeignKey(nameof(User))]
    public int RaisedForUserId { get; set; }

    [Required]
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Severity { get; set; } = "medium";

    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = "open";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ResolvedAt { get; set; }

    public Transaction Transaction { get; set; } = null!;
    public User User { get; set; } = null!;
}
