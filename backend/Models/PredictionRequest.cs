namespace backend.Models;

public class PredictionRequest
{
    public int UserId { get; set; }

    public int CreditScore { get; set; }

    public int PreviousFraudCount { get; set; }

    public string MerchantCategory { get; set; } = "";

    public string MerchantRisk { get; set; } = "";

    public string DeviceType { get; set; } = "";

    public bool TrustedDevice { get; set; }

    public string City { get; set; } = "";

    public string Country { get; set; } = "";

    public string LocationRisk { get; set; } = "";

    public decimal Amount { get; set; }

    public string TransactionType { get; set; } = "";

    public decimal PreviousBalance { get; set; }

    public decimal CurrentBalance { get; set; }

    public bool IsNewDevice { get; set; }

    public bool IsNewLocation { get; set; }
}