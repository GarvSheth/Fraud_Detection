using System.Collections.Generic;
using System.Net;
using System.Net.Http.Json;
using FraudDetectionBackend.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Xunit;

namespace FraudDetectionBackend.Tests;

public class ApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public ApiTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.WithWebHostBuilder(builder =>
        {
            builder.UseEnvironment("Testing");
            builder.ConfigureAppConfiguration((_, config) =>
            {
                config.AddInMemoryCollection(new Dictionary<string, string?>
                {
                    ["UseInMemoryDatabase"] = "true"
                });
            });
        }).CreateClient(new WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri("https://localhost")
        });
    }

    [Fact]
    public async Task HealthEndpoint_ReturnsOk()
    {
        var response = await _client.GetAsync("/api/health");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task DashboardEndpoint_ReturnsOverviewAndAlerts()
    {
        var response = await _client.GetAsync("/api/dashboard");

        response.EnsureSuccessStatusCode();
        var body = await response.Content.ReadFromJsonAsync<DashboardResponse>();

        Assert.NotNull(body);
        Assert.NotNull(body!.Overview);
        Assert.NotEmpty(body.RecentAlerts);
    }

    [Fact]
    public async Task UsersEndpoint_ReturnsSeededUsers()
    {
        var response = await _client.GetAsync("/api/users");

        response.EnsureSuccessStatusCode();
        var body = await response.Content.ReadFromJsonAsync<List<UserDto>>();

        Assert.NotNull(body);
        Assert.NotEmpty(body!);
        Assert.Contains(body!, user => user.Email == "admin@fraud.local");
    }

    [Fact]
    public async Task ThreatsEndpoint_ReturnsSeededThreats()
    {
        var response = await _client.GetAsync("/api/threats");

        response.EnsureSuccessStatusCode();
        var body = await response.Content.ReadFromJsonAsync<List<ThreatDto>>();

        Assert.NotNull(body);
        Assert.NotEmpty(body!);
        Assert.Contains(body!, threat => threat.Severity == "high");
    }

    [Fact]
    public async Task UserProfileEndpoint_ReturnsSeededUser()
    {
        var response = await _client.GetAsync("/user/profile?userId=2");

        response.EnsureSuccessStatusCode();
        var body = await response.Content.ReadFromJsonAsync<UserDto>();

        Assert.NotNull(body);
        Assert.Equal("john.doe@fraud.local", body!.Email);
    }

    [Fact]
    public async Task UserAccountsEndpoint_CreatesAccount()
    {
        var response = await _client.PostAsJsonAsync("/user/accounts", new
        {
            UserId = 2,
            AccountNumber = "2002002002",
            Balance = 500,
            Status = "active"
        });

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    [Fact]
    public async Task ThreatFeedAndDetailsEndpoints_ReturnThreats()
    {
        var feedResponse = await _client.GetAsync("/threat/feed");
        var detailResponse = await _client.GetAsync("/threat/1");

        feedResponse.EnsureSuccessStatusCode();
        detailResponse.EnsureSuccessStatusCode();
    }

    [Fact]
    public async Task ThreatRaiseEndpoint_CreatesThreat()
    {
        var response = await _client.PostAsJsonAsync("/threat/raise", new
        {
            RaisedForUserId = 2,
            Description = "Test suspicious activity",
            Severity = "medium"
        });

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    [Fact]
    public async Task NotificationTransactionAndAuditEndpoints_CreateRecords()
    {
        var notificationResponse = await _client.PostAsJsonAsync("/notify/send", new
        {
            UserId = 2,
            Message = "Test notification",
            Type = "fraud"
        });

        var transactionResponse = await _client.PostAsJsonAsync("/transaction/ingest", new
        {
            AccountId = 1,
            Amount = 99.99,
            DeviceInfo = "Test browser",
            Location = "Test city",
            Merchant = "Test merchant"
        });

        var auditResponse = await _client.PostAsJsonAsync("/audit/record", new
        {
            AccountId = 1,
            Details = "Test audit record"
        });

        Assert.Equal(HttpStatusCode.Created, notificationResponse.StatusCode);
        Assert.Equal(HttpStatusCode.Created, transactionResponse.StatusCode);
        Assert.Equal(HttpStatusCode.Created, auditResponse.StatusCode);
    }
}

public record DashboardResponse(OverviewDto Overview, List<AlertDto> RecentAlerts);
public record OverviewDto(int SecurityScore, int Users, int Threats, int AuditLogs, int OpenCases);
public record AlertDto(int Id, string Title, string User, string Severity);
public record UserDto(int UserId, string Name, string Email, string Role, DateTime CreatedAt, DateTime UpdatedAt);
public record ThreatDto(int ThreatId, string Description, string Severity, string Status, string User);
