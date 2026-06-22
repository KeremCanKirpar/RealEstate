using EstateFlow.Api.Entities;
using EstateFlow.Api.Helpers;
using Microsoft.EntityFrameworkCore;

namespace EstateFlow.Api.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        var db = services.GetRequiredService<ApplicationDbContext>();
        try
        {
            await db.Database.EnsureCreatedAsync();
        }
        catch (Exception exception)
        {
            Console.WriteLine($"Veritabanı seed işlemi atlandı: {exception.Message}");
            return;
        }

        var now = DateTime.UtcNow;
        var hasChanges = false;

        if (!await db.Users.AnyAsync(user => user.Email == "admin@estateflow.local"))
        {
            db.Users.Add(new User
            {
                FullName = "EstateFlow Admin",
                Email = "admin@estateflow.local",
                PasswordHash = PasswordHasher.HashPassword("Admin123!"),
                Role = UserRole.Admin,
                CreatedAt = now
            });
            hasChanges = true;
        }

        if (!await db.Users.AnyAsync(user => user.Email == "consultant@estateflow.local"))
        {
            db.Users.Add(new User
            {
                FullName = "Derya Yıldız",
                Email = "consultant@estateflow.local",
                PasswordHash = PasswordHasher.HashPassword("Consultant123!"),
                Role = UserRole.Consultant,
                CreatedAt = now
            });
            hasChanges = true;
        }

        if (hasChanges)
        {
            await db.SaveChangesAsync();
        }
    }
}