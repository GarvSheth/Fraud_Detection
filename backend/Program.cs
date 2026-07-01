using FraudDetectionBackend.Data;
using FraudDetectionBackend.Endpoints;
using FraudDetectionBackend.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddApplicationServices()
    .AddDatabase(builder.Configuration, builder.Environment);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors(ServiceCollectionExtensions.FrontendCorsPolicy);

// await DatabaseInitializer.InitializeAsync(app);
await UsersSeed.SeedAsync(app);
await TransactionsSeed.SeedAsync(app);
await ThreatSeed.SeedAsync(app);

app.MapApiEndpoints();

app.Run();

public partial class Program { }
