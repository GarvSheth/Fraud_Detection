using FraudDetectionBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace FraudDetectionBackend.Data;

public static class ThreatSeed
{
    public static async Task SeedAsync(WebApplication app)
    {
        using var scope = app.Services.CreateScope();

        var db = scope.ServiceProvider.GetRequiredService<FraudDbContext>();

        if (await db.Threats.AnyAsync())
        {
            Console.WriteLine("Threats already exist in the database. Skipping seeding.");
            return;
        }

        var transactions = await db.Transactions
            .Include(transaction => transaction.Account)
            .ThenInclude(account => account.User)
            .Where(transaction => transaction.Account.User.Role.ToLower() != "admin")
            .ToListAsync();

        if (transactions.Count == 0)
        {
            Console.WriteLine("No non-admin transactions found. Skipping threat seeding.");
            return;
        }

        var seededAt = DateTime.UtcNow;
        var threatsByMerchant = new Dictionary<string, ThreatSeedItem>
        {
            ["Skyline Tech"] = new(
                "High-risk transfer from a newly registered device",
                "high",
                "open",
                seededAt.AddMinutes(-10),
                null),
            ["Multiple merchants"] = new(
                "Velocity anomaly detected across several merchants",
                "medium",
                "investigating",
                seededAt.AddMinutes(-25),
                null),
            ["Northwind Retail"] = new(
                "Merchant sequence matches a known synthetic identity fraud pattern",
                "critical",
                "escalated",
                seededAt.AddHours(-1),
                null),
            ["QuickPay Wallet"] = new(
                "Account recovery details changed shortly before transaction approval",
                "low",
                "resolved",
                seededAt.AddHours(-3),
                seededAt.AddHours(-2)),
            ["Global Gadget Market"] = new(
                "Repeated payment attempts to a merchant under fraud review",
                "high",
                "blocked",
                seededAt.AddHours(-5),
                null)
        };

        var threats = transactions
            .Where(transaction => transaction.Merchant is not null && threatsByMerchant.ContainsKey(transaction.Merchant))
            .Select(transaction =>
            {
                var threat = threatsByMerchant[transaction.Merchant!];

                return new Threat
                {
                    TransactionId = transaction.TransactionId,
                    RaisedForUserId = transaction.Account.UserId,
                    Description = threat.Description,
                    Severity = threat.Severity,
                    Status = threat.Status,
                    CreatedAt = threat.CreatedAt,
                    ResolvedAt = threat.ResolvedAt
                };
            });

        db.Threats.AddRange(threats);
        await db.SaveChangesAsync();
    }

    private sealed record ThreatSeedItem(
        string Description,
        string Severity,
        string Status,
        DateTime CreatedAt,
        DateTime? ResolvedAt);
}
