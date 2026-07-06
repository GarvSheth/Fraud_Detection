using FraudDetectionBackend.Data;
using FraudDetectionBackend.DTOs;
using FraudDetectionBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace FraudDetectionBackend.Endpoints;

public static class NotificationEndpoints
{
    public static IEndpointRouteBuilder MapNotificationEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/notify/send", async (FraudDbContext db, SendNotificationRequest request) =>
        {
            var userExists = await db.Users.AnyAsync(u => u.UserId == request.UserId);

            if (!userExists)
            {
                return Results.NotFound(new { message = "User not found" });
            }

            var notification = new Notification
            {
                UserId = request.UserId,
                Message = request.Message,
                Type = request.Type,
                DeliveryStatus = "sent"
            };

            db.Notifications.Add(notification);
            await db.SaveChangesAsync();

            return Results.Created($"/notify/{notification.NotificationId}", new
            {
                notification.NotificationId,
                notification.UserId,
                notification.Message,
                notification.Type,
                notification.SentAt,
                notification.DeliveryStatus
            });
        });

        return app;
    }
}
