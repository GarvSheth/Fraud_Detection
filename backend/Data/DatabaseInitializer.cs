using FraudDetectionBackend.Extensions;
using FraudDetectionBackend.Models;
using Npgsql;

namespace FraudDetectionBackend.Data;

public static class DatabaseInitializer
{
    public static async Task InitializeAsync(WebApplication app)
    {
        var connectionString = app.Configuration.GetFraudDbConnectionString();
        var useInMemoryDatabase = app.Configuration.UseInMemoryDatabase(app.Environment);

        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<FraudDbContext>();

        if (!useInMemoryDatabase)
        {
            await EnsureDatabaseExistsAsync(connectionString);
            await db.Database.EnsureCreatedAsync();
        }

        await SeedAsync(db);
    }

    private static async Task SeedAsync(FraudDbContext db)
    {
        if (db.Users.Any())
        {
            return;
        }

        var admin = new User
        {
            Name = "Admin User",
            Email = "admin@fraud.local",
            PasswordHash = "hash-admin",
            Role = "admin"
        };

        var customer = new User
        {
            Name = "John Doe",
            Email = "john.doe@fraud.local",
            PasswordHash = "hash-user",
            Role = "user"
        };

        db.Users.AddRange(admin, customer);
        await db.SaveChangesAsync();

        var account = new Account
        {
            UserId = customer.UserId,
            AccountNumber = "1001001001",
            Balance = 2500.50m,
            Status = "active"
        };

        db.Accounts.Add(account);
        await db.SaveChangesAsync();

        var approvedTransaction = new Transaction { AccountId = account.AccountId, Amount = 150.75m, Timestamp = DateTime.UtcNow.AddDays(-1), DeviceInfo = "Chrome / Windows", Location = "New York", Merchant = "Coffee Shop", Status = "approved" };
        var pendingTransaction = new Transaction { AccountId = account.AccountId, Amount = 3000.00m, Timestamp = DateTime.UtcNow.AddHours(-2), DeviceInfo = "Safari / iPhone", Location = "Toronto", Merchant = "Online Store", Status = "pending" };
        var blockedTransaction = new Transaction { AccountId = account.AccountId, Amount = 700.00m, Timestamp = DateTime.UtcNow.AddMinutes(-30), DeviceInfo = "Firefox / Linux", Location = "Austin", Merchant = "Travel Agency", Status = "blocked" };

        db.Transactions.AddRange(approvedTransaction, pendingTransaction, blockedTransaction);
        await db.SaveChangesAsync();

        db.Threats.AddRange(
            new Threat { TransactionId = pendingTransaction.TransactionId, RaisedForUserId = customer.UserId, Description = "Suspicious login from unknown device", Severity = "high", Status = "open" },
            new Threat { TransactionId = blockedTransaction.TransactionId, RaisedForUserId = customer.UserId, Description = "Unusual high-value transfer", Severity = "critical", Status = "escalated" }
        );

        db.Notifications.AddRange(
            new Notification { UserId = customer.UserId, Message = "New suspicious activity detected", Type = "fraud", DeliveryStatus = "sent" },
            new Notification { UserId = customer.UserId, Message = "Compliance review required", Type = "compliance", DeliveryStatus = "pending" }
        );

        db.AuditLogs.AddRange(
            new AuditLog { AccountId = account.AccountId, Details = "Account created" },
            new AuditLog { AccountId = account.AccountId, Details = "Fraud review initiated" }
        );

        await db.SaveChangesAsync();
    }

    private static async Task EnsureDatabaseExistsAsync(string connectionString)
    {
        var builder = new NpgsqlConnectionStringBuilder(connectionString);
        var databaseName = builder.Database;

        if (string.IsNullOrWhiteSpace(databaseName)
            || string.Equals(databaseName, "postgres", StringComparison.OrdinalIgnoreCase))
        {
            return;
        }

        var maintenanceBuilder = new NpgsqlConnectionStringBuilder(connectionString)
        {
            Database = "postgres"
        };

        await using var connection = new NpgsqlConnection(maintenanceBuilder.ConnectionString);
        await connection.OpenAsync();

        await using var command = new NpgsqlCommand($"SELECT 1 FROM pg_database WHERE datname = '{databaseName}'", connection);
        var exists = await command.ExecuteScalarAsync();

        if (exists is null)
        {
            await using var createCommand = new NpgsqlCommand($"CREATE DATABASE \"{databaseName}\"", connection);
            await createCommand.ExecuteNonQueryAsync();
        }
    }
}
