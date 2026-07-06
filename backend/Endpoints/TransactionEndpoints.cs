using FraudDetectionBackend.Data;
using FraudDetectionBackend.DTOs;
using FraudDetectionBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace FraudDetectionBackend.Endpoints;

public static class TransactionEndpoints
{
    public static IEndpointRouteBuilder MapTransactionEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/transaction/ingest", async (FraudDbContext db, IngestTransactionRequest request) =>
        {
            var accountExists = await db.Accounts.AnyAsync(a => a.AccountId == request.AccountId);

            if (!accountExists)
            {
                return Results.NotFound(new { message = "Account not found" });
            }

            var transaction = new Transaction
            {
                AccountId = request.AccountId,
                Amount = request.Amount,
                DeviceInfo = request.DeviceInfo,
                Location = request.Location,
                Merchant = request.Merchant,
                Status = "pending"
            };

            db.Transactions.Add(transaction);
            await db.SaveChangesAsync();

            return Results.Created($"/transaction/{transaction.TransactionId}", new
            {
                transaction.TransactionId,
                transaction.AccountId,
                transaction.Amount,
                transaction.Timestamp,
                transaction.DeviceInfo,
                transaction.Location,
                transaction.Merchant,
                transaction.Status
            });
        });

        return app;
    }
}
