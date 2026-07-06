using FraudDetectionBackend.Data;
using FraudDetectionBackend.DTOs;
using FraudDetectionBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace FraudDetectionBackend.Endpoints;

public static class ThreatEndpoints
{
    public static IEndpointRouteBuilder MapThreatEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/threats", async (FraudDbContext db, int userId) =>
        {
            var threats = await db.Threats
                .Select(t => new
                {
                    t.ThreatId,
                    t.TransactionId,
                    t.Description,
                    t.Severity,
                    t.Status,
                    UserId = t.RaisedForUserId,
                    Transaction = new
                    {
                        t.Transaction.Amount,
                        t.Transaction.Timestamp,
                        t.Transaction.DeviceInfo,
                        t.Transaction.Location,
                        t.Transaction.Merchant,
                        t.Transaction.Status
                    }
                })
                .ToListAsync();

            var filteredThreats = threats
                .Where(t => t.UserId == userId)
                .ToList();

            return Results.Ok(filteredThreats);
        });


        app.MapGet("/threat/feed", async (FraudDbContext db) =>
        {
            var threats = await db.Threats
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => new
                {
                    t.ThreatId,
                    t.TransactionId,
                    t.Description,
                    t.Severity,
                    t.Status,
                    t.CreatedAt,
                    t.ResolvedAt,
                    User = t.User.Name,
                    Transaction = new
                    {
                        t.Transaction.AccountId,
                        t.Transaction.Amount,
                        t.Transaction.Timestamp,
                        t.Transaction.DeviceInfo,
                        t.Transaction.Location,
                        t.Transaction.Merchant,
                        t.Transaction.Status
                    }
                })
                .ToListAsync();

            return Results.Ok(threats);
        });

        app.MapGet("/threat/{id:int}", async (FraudDbContext db, int id) =>
        {
            var threat = await db.Threats
                .Where(t => t.ThreatId == id)
                .Select(t => new
                {
                    t.ThreatId,
                    t.TransactionId,
                    t.RaisedForUserId,
                    t.Description,
                    t.Severity,
                    t.Status,
                    t.CreatedAt,
                    t.ResolvedAt,
                    User = t.User.Name,
                    Transaction = new
                    {
                        t.Transaction.AccountId,
                        AccountNumber = t.Transaction.Account.AccountNumber,
                        t.Transaction.Amount,
                        t.Transaction.Timestamp,
                        t.Transaction.DeviceInfo,
                        t.Transaction.Location,
                        t.Transaction.Merchant,
                        t.Transaction.Status
                    }
                })
                .FirstOrDefaultAsync();

            return threat is null ? Results.NotFound(new { message = "Threat not found" }) : Results.Ok(threat);
        });

        app.MapPost("/threat/raise", async (FraudDbContext db, RaiseThreatRequest request) =>
        {
            var userExists = await db.Users.AnyAsync(u => u.UserId == request.RaisedForUserId);

            if (!userExists)
            {
                return Results.NotFound(new { message = "User not found" });
            }

            var transactionBelongsToUser = await db.Transactions
                .AnyAsync(t => t.TransactionId == request.TransactionId
                    && t.Account.UserId == request.RaisedForUserId);

            if (!transactionBelongsToUser)
            {
                return Results.NotFound(new { message = "Transaction not found for user" });
            }

            var threat = new Threat
            {
                TransactionId = request.TransactionId,
                RaisedForUserId = request.RaisedForUserId,
                Description = request.Description,
                Severity = request.Severity,
                Status = "open"
            };

            db.Threats.Add(threat);
            await db.SaveChangesAsync();

            return Results.Created($"/threat/{threat.ThreatId}", new
            {
                threat.ThreatId,
                threat.TransactionId,
                threat.RaisedForUserId,
                threat.Description,
                threat.Severity,
                threat.Status,
                threat.CreatedAt
            });
        });

        app.MapPost("/threat/evaluate", async (FraudDbContext db, EvaluateThreatRequest request) =>
        {
            var threat = await db.Threats.FindAsync(request.ThreatId);

            if (threat is null)
            {
                return Results.NotFound(new { message = "Threat not found" });
            }

            if (!string.IsNullOrWhiteSpace(request.Severity))
            {
                threat.Severity = request.Severity;
            }

            if (!string.IsNullOrWhiteSpace(request.Status))
            {
                threat.Status = request.Status;
            }

            await db.SaveChangesAsync();

            return Results.Ok(new
            {
                threat.ThreatId,
                threat.Description,
                threat.Severity,
                threat.Status
            });
        });

        app.MapPost("/threat/resolve/{id:int}", async (FraudDbContext db, int id, ResolveThreatRequest request) =>
        {
            var threat = await db.Threats.FindAsync(id);

            if (threat is null)
            {
                return Results.NotFound(new { message = "Threat not found" });
            }

            threat.Status = "resolved";
            threat.ResolvedAt = DateTime.UtcNow;

            await db.SaveChangesAsync();

            return Results.Ok(new
            {
                threat.ThreatId,
                threat.Status,
                threat.ResolvedAt,
                request.Details
            });
        });

        app.MapPost("/threat/decision", async (FraudDbContext db, ThreatDecisionRequest request) =>
        {
            var threat = await db.Threats.FindAsync(request.ThreatId);

            if (threat is null)
            {
                return Results.NotFound(new { message = "Threat not found" });
            }

            threat.Status = request.Decision.ToLower() switch
            {
                "approve" or "approved" => "resolved",
                "block" or "blocked" => "blocked",
                "escalate" or "escalated" => "escalated",
                _ => request.Decision
            };

            if (threat.Status == "resolved")
            {
                threat.ResolvedAt = DateTime.UtcNow;
            }

            await db.SaveChangesAsync();

            return Results.Ok(new
            {
                threat.ThreatId,
                Decision = request.Decision,
                threat.Status,
                request.Details
            });
        });

        return app;
    }
}
