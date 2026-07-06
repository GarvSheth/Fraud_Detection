using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FraudDetectionBackend.Models;

public class Notification
{
    [Key]
    public int NotificationId { get; set; }

    [ForeignKey(nameof(User))]
    public int UserId { get; set; }

    [Required]
    [MaxLength(1000)]
    public string Message { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Type { get; set; } = "fraud";

    public DateTime SentAt { get; set; } = DateTime.UtcNow;

    [Required]
    [MaxLength(20)]
    public string DeliveryStatus { get; set; } = "sent";

    public User User { get; set; } = null!;
}
