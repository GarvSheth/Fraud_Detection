using FraudDetectionBackend.Data;
using FraudDetectionBackend.DTOs;
using FraudDetectionBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace FraudDetectionBackend.Endpoints;

public static class UserEndpoints
{
    public static IEndpointRouteBuilder MapUserEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/users", async (FraudDbContext db, string? status) =>
        {
            var query = db.Users.AsQueryable();

            if (!string.IsNullOrWhiteSpace(status))
            {
                var normalizedStatus = status.ToLower();
                query = query.Where(u => u.Role.ToLower() == normalizedStatus);
            }

            var users = await query.Select(u => new
            {
                u.UserId,
                u.Name,
                u.Email,
                u.Role,
                u.CreatedAt,
                u.UpdatedAt
            }).ToListAsync();

            return Results.Ok(users);
        });

        app.MapGet("/user/profile", async (FraudDbContext db, int userId = 2) =>
        {
            var user = await db.Users
                .Where(u => u.UserId == userId)
                .Select(u => new
                {
                    u.UserId,
                    u.Name,
                    u.Email,
                    u.Role,
                    u.CreatedAt,
                    u.UpdatedAt
                })
                .FirstOrDefaultAsync();

            return user is null ? Results.NotFound(new { message = "User not found" }) : Results.Ok(user);
        });

        app.MapPut("/user/profile", async (FraudDbContext db, int userId, UpdateUserProfileRequest request) =>
        {
            var user = await db.Users.FindAsync(userId);

            if (user is null)
            {
                return Results.NotFound(new { message = "User not found" });
            }

            user.Name = request.Name;
            user.Email = request.Email;
            user.UpdatedAt = DateTime.UtcNow;

            await db.SaveChangesAsync();

            return Results.Ok(new
            {
                user.UserId,
                user.Name,
                user.Email,
                user.Role,
                user.CreatedAt,
                user.UpdatedAt
            });
        });

        app.MapPost("/user/accounts", async (FraudDbContext db, AddAccountRequest request) =>
        {
            var userExists = await db.Users.AnyAsync(u => u.UserId == request.UserId);

            if (!userExists)
            {
                return Results.NotFound(new { message = "User not found" });
            }

            var account = new Account
            {
                UserId = request.UserId,
                AccountNumber = request.AccountNumber,
                Balance = request.Balance,
                Status = string.IsNullOrWhiteSpace(request.Status) ? "active" : request.Status
            };

            db.Accounts.Add(account);
            await db.SaveChangesAsync();

            return Results.Created($"/user/accounts/{account.AccountId}", new
            {
                account.AccountId,
                account.UserId,
                account.AccountNumber,
                account.Balance,
                account.Status
            });
        });

        return app;
    }
}
