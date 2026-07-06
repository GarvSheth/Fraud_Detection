using FraudDetectionBackend.Data;
using Microsoft.EntityFrameworkCore;

namespace FraudDetectionBackend.Extensions;

public static class ServiceCollectionExtensions
{
    public const string FrontendCorsPolicy = "AllowFrontend";

    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddOpenApi();

        services.AddCors(options =>
        {
            options.AddPolicy(FrontendCorsPolicy, policy =>
            {
                policy.AllowAnyOrigin()
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });

        return services;
    }

    public static IServiceCollection AddDatabase(
        this IServiceCollection services,
        IConfiguration configuration,
        IHostEnvironment environment)
    {
        var connectionString = configuration.GetFraudDbConnectionString();
        var useInMemoryDatabase = configuration.UseInMemoryDatabase(environment);

        if (useInMemoryDatabase)
        {
            services.AddDbContext<FraudDbContext>(options =>
                options.UseInMemoryDatabase("FraudDetectionTests"));
        }
        else
        {
            services.AddDbContext<FraudDbContext>(options =>
                options.UseNpgsql(connectionString));
        }

        return services;
    }

    public static string GetFraudDbConnectionString(this IConfiguration configuration)
    {
        return configuration.GetConnectionString("FraudDb")
            ?? Environment.GetEnvironmentVariable("FRAUD_DB_CONNECTION")
            ?? "Host=localhost;Database=fraud_db;Username=postgres;Password=postgres";
    }

    public static bool UseInMemoryDatabase(this IConfiguration configuration, IHostEnvironment environment)
    {
        return configuration.GetValue<bool>("UseInMemoryDatabase")
            || environment.IsEnvironment("Testing");
    }
}
