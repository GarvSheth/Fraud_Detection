using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FraudDetectionBackend.Models;

public class Account
{
    [Key]
    public int AccountId { get; set; }

    [ForeignKey(nameof(User))]
    public int UserId { get; set; }

    [Required]
    [MaxLength(50)]
    public string AccountNumber { get; set; } = string.Empty;

    [Column(TypeName = "decimal(12,2)")]
    public decimal Balance { get; set; }

    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = "active";

    public User User { get; set; } = null!;
    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}
