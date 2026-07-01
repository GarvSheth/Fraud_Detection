using FraudDetectionBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace FraudDetectionBackend.Data;

public static class TransactionsSeed
{
    public static async Task SeedAsync(WebApplication app)
    {
        using var scope = app.Services.CreateScope();

        var db = scope.ServiceProvider.GetRequiredService<FraudDbContext>();

        if (await db.Transactions.AnyAsync())
        {
            Console.WriteLine("Transactions already exist in the database. Skipping seeding.");
            return;
        }

        var users = await db.Users
            .Where(user => user.Role.ToLower() != "admin")
            .ToListAsync();

        if (users.Count == 0)
        {
            Console.WriteLine("No non-admin users found. Skipping transaction seeding.");
            return;
        }

        var accountSeedItems = new Dictionary<string, AccountSeedItem>
        {
            ["alice.johnson@fraud.local"] = new("1001001002", 18420.75m),
            ["bob.smith@fraud.local"] = new("1001001003", 9250.00m),
            ["emma.wilson@fraud.local"] = new("1001001004", 31200.40m),
            ["michael.brown@fraud.local"] = new("1001001005", 12680.25m),
            ["sophia.davis@fraud.local"] = new("1001001006", 15890.10m)
        };

        var seededAccountNumbers = accountSeedItems.Values
            .Select(account => account.AccountNumber)
            .ToList();

        var existingAccountNumbers = await db.Accounts
            .Select(account => account.AccountNumber)
            .ToListAsync();

        var accountsToCreate = users
            .Where(user => accountSeedItems.ContainsKey(user.Email))
            .Where(user => !existingAccountNumbers.Contains(accountSeedItems[user.Email].AccountNumber))
            .Select(user =>
            {
                var account = accountSeedItems[user.Email];

                return new Account
                {
                    UserId = user.UserId,
                    AccountNumber = account.AccountNumber,
                    Balance = account.Balance,
                    Status = "active"
                };
            })
            .ToList();

        if (accountsToCreate.Count > 0)
        {
            db.Accounts.AddRange(accountsToCreate);
            await db.SaveChangesAsync();
        }

        var seededAt = DateTime.UtcNow;
        var transactionsByEmail = new Dictionary<string, TransactionSeedItem>
        {
            ["alice.johnson@fraud.local"] = new(
                Guid.Parse("9e6c4f44-f0a0-41ff-81bf-7fbc7ed3f101"),
                8420.00m,
                seededAt.AddMinutes(-12),
                "Chrome 125 / Windows 11",
                "New York, US",
                "Skyline Tech",
                "pending"),
            ["bob.smith@fraud.local"] = new(
                Guid.Parse("9e6c4f44-f0a0-41ff-81bf-7fbc7ed3f102"),
                1260.50m,
                seededAt.AddMinutes(-27),
                "Safari / iPhone 15",
                "Chicago, US",
                "Multiple merchants",
                "pending"),
            ["emma.wilson@fraud.local"] = new(
                Guid.Parse("9e6c4f44-f0a0-41ff-81bf-7fbc7ed3f103"),
                3980.00m,
                seededAt.AddHours(-1),
                "Firefox / Linux",
                "Miami, US",
                "Northwind Retail",
                "blocked"),
            ["michael.brown@fraud.local"] = new(
                Guid.Parse("9e6c4f44-f0a0-41ff-81bf-7fbc7ed3f104"),
                560.25m,
                seededAt.AddHours(-3),
                "Edge / Windows 10",
                "Austin, US",
                "QuickPay Wallet",
                "approved"),
            ["sophia.davis@fraud.local"] = new(
                Guid.Parse("9e6c4f44-f0a0-41ff-81bf-7fbc7ed3f105"),
                2199.99m,
                seededAt.AddHours(-5),
                "Chrome / Android",
                "Seattle, US",
                "Global Gadget Market",
                "blocked")
        };

        var accountsByUserId = await db.Accounts
            .Where(account => seededAccountNumbers.Contains(account.AccountNumber))
            .ToDictionaryAsync(account => account.UserId);

        var seededTransactionIds = transactionsByEmail.Values
            .Select(transaction => transaction.TransactionId)
            .ToList();

        var existingTransactionIds = await db.Transactions
            .Where(transaction => seededTransactionIds.Contains(transaction.TransactionId))
            .Select(transaction => transaction.TransactionId)
            .ToListAsync();

        var transactions = users
            .Where(user => transactionsByEmail.ContainsKey(user.Email))
            .Where(user => accountsByUserId.ContainsKey(user.UserId))
            .Where(user => !existingTransactionIds.Contains(transactionsByEmail[user.Email].TransactionId))
            .Select(user =>
            {
                var transaction = transactionsByEmail[user.Email];

                return new Transaction
                {
                    TransactionId = transaction.TransactionId,
                    AccountId = accountsByUserId[user.UserId].AccountId,
                    Amount = transaction.Amount,
                    Timestamp = transaction.Timestamp,
                    DeviceInfo = transaction.DeviceInfo,
                    Location = transaction.Location,
                    Merchant = transaction.Merchant,
                    Status = transaction.Status
                };
            })
            .ToList();

        db.Transactions.AddRange(transactions);
        await db.SaveChangesAsync();
    }

    private sealed record AccountSeedItem(string AccountNumber, decimal Balance);

    private sealed record TransactionSeedItem(
        Guid TransactionId,
        decimal Amount,
        DateTime Timestamp,
        string DeviceInfo,
        string Location,
        string Merchant,
        string Status);
}
