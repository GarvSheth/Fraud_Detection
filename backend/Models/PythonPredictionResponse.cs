using System.Text.Json.Serialization;

namespace FraudDetectionBackend.Models;

public class PythonPredictionResponse
{
    [JsonPropertyName("prediction")]
    public int Prediction { get; set; }

    [JsonPropertyName("fraud_probability")]
    public double FraudProbability { get; set; }
}