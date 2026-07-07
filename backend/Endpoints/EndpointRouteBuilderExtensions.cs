namespace FraudDetectionBackend.Endpoints;

public static class EndpointRouteBuilderExtensions
{
    public static IEndpointRouteBuilder MapApiEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapHealthEndpoints();
        app.MapDashboardEndpoints();
        app.MapUserEndpoints();
        app.MapThreatEndpoints();
        app.MapNotificationEndpoints();
        app.MapTransactionEndpoints();
        app.MapAuditEndpoints();
        app.MapPredictionEndpoints();

        return app;
    }
}
