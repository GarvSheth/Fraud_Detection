namespace backend.Models;

public class PredictionResponse
{
    public int Prediction { get; set; }

    public double FraudProbability { get; set; }

    public string Status { get; set; } = "";

    public Guid TransactionId { get; set; }
}