using FraudDetectionBackend.Data;
using Microsoft.EntityFrameworkCore;

namespace FraudDetectionBackend.Endpoints;

public static class DashboardEndpoints
{
    public static IEndpointRouteBuilder MapDashboardEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/dashboard", async (FraudDbContext db) =>
        {
            var overview = new
            {
                SecurityScore = 87,
                Users = await db.Users.CountAsync(),
                Threats = await db.Threats.CountAsync(),
                AuditLogs = await db.AuditLogs.CountAsync(),
                OpenCases = await db.Threats.CountAsync(t => t.Status != "resolved")
            };

            var recentAlerts = await db.Threats
                .OrderByDescending(t => t.CreatedAt)
                .Take(3)
                .Select(t => new { Id = t.ThreatId, Title = t.Description, User = t.User.Name, Severity = t.Severity })
                .ToListAsync();

            return Results.Ok(new { Overview = overview, RecentAlerts = recentAlerts });
        });

        return app;
    }
}
