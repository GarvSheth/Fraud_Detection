using System.Text;
using System.Text.Json;
using FraudDetectionBackend.Data;
using FraudDetectionBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace FraudDetectionBackend.Endpoints;

public static class PredictionEndpoints
{
    public static IEndpointRouteBuilder MapPredictionEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/prediction",
        async (
            PredictionRequest request,
            FraudDbContext db,
            IHttpClientFactory httpClientFactory) =>
        {
            // ----------------------------
            // Prepare payload for FastAPI
            // ----------------------------
            Console.WriteLine("Prediction endpoint hit!");
            var now = DateTime.Now;

            var payload = new
            {
                request.CreditScore,
                request.PreviousFraudCount,

                request.MerchantCategory,
                request.MerchantRisk,

                request.DeviceType,
                request.TrustedDevice,

                request.City,
                request.Country,
                request.LocationRisk,

                request.Amount,

                request.TransactionType,

                HourOfDay = now.Hour,
                DayOfWeek = now.DayOfWeek.ToString(),

                request.PreviousBalance,
                request.CurrentBalance,

                request.IsNewDevice,
                request.IsNewLocation
            };

            var client = httpClientFactory.CreateClient();

            var json = JsonSerializer.Serialize(payload);

            var content = new StringContent(
                json,
                Encoding.UTF8,
                "application/json"
            );

            // ----------------------------
            // Call FastAPI
            // ----------------------------

            var response = await client.PostAsync(
                "http://127.0.0.1:8000/predict",
                content
            );

            if (!response.IsSuccessStatusCode)
            {
                return Results.BadRequest(
                    "Python prediction service unavailable."
                );
            }

            // ----------------------------
            // Read Prediction
            // ----------------------------

            var result = await response.Content.ReadAsStringAsync();

            Console.WriteLine("Raw Python Response:");
            Console.WriteLine(result);

            var prediction =
                JsonSerializer.Deserialize<PythonPredictionResponse>(
                    result,
                    new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

            Console.WriteLine("========== ML Prediction ==========");
            Console.WriteLine($"Prediction        : {prediction?.Prediction}");
            Console.WriteLine($"Fraud Probability : {prediction?.FraudProbability:P2}");
            Console.WriteLine("===================================");

            // Console.WriteLine("========== Transaction ==========");
            // Console.WriteLine($"Transaction ID : {transaction.TransactionId}");
            // Console.WriteLine($"Account ID     : {transaction.AccountId}");
            // Console.WriteLine($"Status         : {transaction.Status}");
            // Console.WriteLine("=================================");

            if (prediction == null)
            {
                return Results.BadRequest(
                    "Invalid response from Python API."
                );
            }

            // ----------------------------
            // Check Account
            // ----------------------------

            var account = await db.Accounts
                .FirstOrDefaultAsync(
                    a => a.AccountId == request.AccountId
                );

            if (account == null)
            {
                return Results.BadRequest(
                    "Account not found."
                );
            }

            // ----------------------------
            // Save Transaction
            // ----------------------------

            var transaction = new Transaction
            {
                TransactionId = Guid.NewGuid(),

                AccountId = request.AccountId,

                Amount = request.Amount,

                Timestamp = DateTime.UtcNow,

                DeviceInfo = request.DeviceType,

                Location = $"{request.City}, {request.Country}",

                Merchant = request.MerchantCategory,

                Status = prediction.Prediction == 1
                    ? "blocked"
                    : "approved"
            };

            db.Transactions.Add(transaction);

            await db.SaveChangesAsync();

            // ----------------------------
            // Create Threat if Fraud
            // ----------------------------

            if (prediction.Prediction == 1)
            {
                var threat = new Threat
                {
                    TransactionId = transaction.TransactionId,

                    RaisedForUserId = account.UserId,

                    Description =
                        $"Potential fraudulent transaction detected. " ,

                    Severity =
                        prediction.FraudProbability >= 0.95
                            ? "critical"
                            : prediction.FraudProbability >= 0.80
                                ? "high"
                                : "medium",

                    Status = "open",

                    CreatedAt = DateTime.UtcNow
                };

                db.Threats.Add(threat);

                await db.SaveChangesAsync();

                Console.WriteLine("========== THREAT CREATED ==========");
                Console.WriteLine($"Threat ID      : {threat.ThreatId}");
                Console.WriteLine($"Transaction ID : {transaction.TransactionId}");
                Console.WriteLine($"Severity       : {threat.Severity}");
                Console.WriteLine("====================================");
            }


            // ----------------------------
            // Return Response
            // ----------------------------

            return Results.Ok(new
            {
                transactionId = transaction.TransactionId,

                prediction = prediction.Prediction,

                fraudProbability = prediction.FraudProbability,

                status = transaction.Status,

                threatCreated = prediction.Prediction == 1
            });

        });

        return app;
    }
}