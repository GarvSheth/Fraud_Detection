using FraudDetectionBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace FraudDetectionBackend.Data;

public class FraudDbContext : DbContext
{
    public FraudDbContext(DbContextOptions<FraudDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Account> Accounts => Set<Account>();
    public DbSet<Transaction> Transactions => Set<Transaction>();
    public DbSet<Threat> Threats => Set<Threat>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");
            entity.HasKey(u => u.UserId);
            entity.Property(u => u.Email).IsRequired().HasMaxLength(255);
            entity.HasIndex(u => u.Email).IsUnique();
        });

        modelBuilder.Entity<Account>(entity =>
        {
            entity.ToTable("Accounts");
            entity.HasKey(a => a.AccountId);
            entity.HasOne(a => a.User)
                .WithMany(u => u.Accounts)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.ToTable("Transactions");
            entity.HasKey(t => t.TransactionId);
            entity.HasOne(t => t.Account)
                .WithMany(a => a.Transactions)
                .HasForeignKey(t => t.AccountId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Threat>(entity =>
        {
            entity.ToTable("Threats");
            entity.HasKey(t => t.ThreatId);
            entity.HasOne(t => t.Transaction)
                .WithMany(t => t.Threats)
                .HasForeignKey(t => t.TransactionId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(t => t.User)
                .WithMany(u => u.ThreatsRaised)
                .HasForeignKey(t => t.RaisedForUserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.ToTable("Notifications");
            entity.HasKey(n => n.NotificationId);
            entity.HasOne(n => n.User)
                .WithMany(u => u.Notifications)
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.HasKey(a => a.AuditId);

            entity.HasOne(a => a.Transaction)
                .WithMany()
                .HasForeignKey(a => a.TransactionId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.Property(a => a.EventType)
                .IsRequired();

            entity.Property(a => a.Decision)
                .IsRequired();

            entity.Property(a => a.Timestamp)
                .IsRequired();
        });
    }
}
