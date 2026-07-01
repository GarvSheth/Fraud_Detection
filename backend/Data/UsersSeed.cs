namespace FraudDetectionBackend.Data;
using FraudDetectionBackend.Extensions;
using FraudDetectionBackend.Models;
using Npgsql;

using Microsoft.EntityFrameworkCore;

public static class UsersSeed
{
    public static async Task SeedAsync(WebApplication app)
    {
        using var scope = app.Services.CreateScope();

        var db = scope.ServiceProvider.GetRequiredService<FraudDbContext>();

        if (await db.Users.AnyAsync())
        {
            Console.WriteLine("Users already exist in the database. Skipping seeding.");
            return;
        }
            
        var users = new List<User>
        {
            new User
            {
                Name = "Security Manager",
                Email = "security@fraud.local",
                PasswordHash = "hash-security",
                Role = "admin"
            },
            new User
            {
                Name = "Alice Johnson",
                Email = "alice.johnson@fraud.local",
                PasswordHash = "hash-user2",
                Role = "user"
            },
            new User
            {
                Name = "Bob Smith",
                Email = "bob.smith@fraud.local",
                PasswordHash = "hash-user3",
                Role = "user"
            },
            new User
            {
                Name = "Emma Wilson",
                Email = "emma.wilson@fraud.local",
                PasswordHash = "hash-user4",
                Role = "user"
            },
            new User
            {
                Name = "Michael Brown",
                Email = "michael.brown@fraud.local",
                PasswordHash = "hash-user5",
                Role = "user"
            },
            new User
            {
                Name = "Sophia Davis",
                Email = "sophia.davis@fraud.local",
                PasswordHash = "hash-user6",
                Role = "user"
            }
        };

        db.Users.AddRange(users);
        await db.SaveChangesAsync();
    }
}