using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FraudDetectionBackend.Models;

public class Transaction
{
    [Key]
    public Guid TransactionId { get; set; }

    [ForeignKey(nameof(Account))]
    public int AccountId { get; set; }

    [Column(TypeName = "decimal(12,2)")]
    public decimal Amount { get; set; }

    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    [MaxLength(255)]
    public string? DeviceInfo { get; set; }

    [MaxLength(255)]
    public string? Location { get; set; }

    [MaxLength(255)]
    public string? Merchant { get; set; }

    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = "pending";

    public Account Account { get; set; } = null!;
    public ICollection<Threat> Threats { get; set; } = new List<Threat>();
}
