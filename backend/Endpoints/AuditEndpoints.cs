using FraudDetectionBackend.Data;
using FraudDetectionBackend.DTOs;
using FraudDetectionBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace FraudDetectionBackend.Endpoints;

public static class AuditEndpoints
{
    public static IEndpointRouteBuilder MapAuditEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/audit", async (FraudDbContext db) =>
        {
            var auditLogs = await db.AuditLogs
                .OrderByDescending(a => a.Timestamp)
                .Select(a => new { a.LogId, a.Details, a.Timestamp, AccountId = a.AccountId })
                .ToListAsync();

            return Results.Ok(auditLogs);
        });

        app.MapGet("/audit/logs", async (FraudDbContext db) =>
        {
            var auditLogs = await db.AuditLogs
                .OrderByDescending(a => a.Timestamp)
                .Select(a => new { a.LogId, a.AccountId, a.Timestamp, a.Details })
                .ToListAsync();

            return Results.Ok(auditLogs);
        });

        app.MapGet("/audit/logs/{id:int}", async (FraudDbContext db, int id) =>
        {
            var auditLog = await db.AuditLogs
                .Where(a => a.LogId == id)
                .Select(a => new { a.LogId, a.AccountId, a.Timestamp, a.Details })
                .FirstOrDefaultAsync();

            return auditLog is null ? Results.NotFound(new { message = "Audit log not found" }) : Results.Ok(auditLog);
        });

        app.MapPost("/audit/record", async (FraudDbContext db, RecordAuditRequest request) =>
        {
            var accountExists = await db.Accounts.AnyAsync(a => a.AccountId == request.AccountId);

            if (!accountExists)
            {
                return Results.NotFound(new { message = "Account not found" });
            }

            var auditLog = new AuditLog
            {
                AccountId = request.AccountId,
                Details = request.Details
            };

            db.AuditLogs.Add(auditLog);
            await db.SaveChangesAsync();

            return Results.Created($"/audit/logs/{auditLog.LogId}", new
            {
                auditLog.LogId,
                auditLog.AccountId,
                auditLog.Timestamp,
                auditLog.Details
            });
        });

        return app;
    }
}
