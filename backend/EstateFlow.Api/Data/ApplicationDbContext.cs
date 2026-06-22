using EstateFlow.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace EstateFlow.Api.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Property> Properties => Set<Property>();
    public DbSet<PropertyImage> PropertyImages => Set<PropertyImage>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<TaskItem> Tasks => Set<TaskItem>();
    public DbSet<CustomerNote> CustomerNotes => Set<CustomerNote>();
    public DbSet<Document> Documents => Set<Document>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(user => user.Email).IsUnique();
            entity.Property(user => user.Role).HasConversion<string>().HasMaxLength(24);
        });

        modelBuilder.Entity<Property>(entity =>
        {
            entity.Property(property => property.ListingType).HasConversion<string>().HasMaxLength(24);
            entity.Property(property => property.PropertyType).HasConversion<string>().HasMaxLength(24);
            entity.Property(property => property.Status).HasConversion<string>().HasMaxLength(24);
            entity.Property(property => property.Price).HasPrecision(18, 2);
            entity.Property(property => property.Dues).HasPrecision(18, 2);
            entity.Property(property => property.Deposit).HasPrecision(18, 2);

            entity.HasOne(property => property.User)
                .WithMany(user => user.Properties)
                .HasForeignKey(property => property.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<PropertyImage>()
            .HasOne(image => image.Property)
            .WithMany(property => property.Images)
            .HasForeignKey(image => image.PropertyId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.Property(customer => customer.CustomerType).HasConversion<string>().HasMaxLength(24);
            entity.Property(customer => customer.Status).HasConversion<string>().HasMaxLength(24);
            entity.Property(customer => customer.DesiredPropertyType).HasConversion<string>().HasMaxLength(24);
            entity.Property(customer => customer.BudgetMin).HasPrecision(18, 2);
            entity.Property(customer => customer.BudgetMax).HasPrecision(18, 2);

            entity.HasOne(customer => customer.User)
                .WithMany(user => user.Customers)
                .HasForeignKey(customer => customer.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.Property(appointment => appointment.AppointmentType).HasConversion<string>().HasMaxLength(32);
            entity.Property(appointment => appointment.Status).HasConversion<string>().HasMaxLength(24);

            entity.HasOne(appointment => appointment.User)
                .WithMany(user => user.Appointments)
                .HasForeignKey(appointment => appointment.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(appointment => appointment.Customer)
                .WithMany(customer => customer.Appointments)
                .HasForeignKey(appointment => appointment.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(appointment => appointment.Property)
                .WithMany(property => property.Appointments)
                .HasForeignKey(appointment => appointment.PropertyId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<TaskItem>(entity =>
        {
            entity.ToTable("Tasks");
            entity.Property(task => task.Priority).HasConversion<string>().HasMaxLength(24);
            entity.Property(task => task.Status).HasConversion<string>().HasMaxLength(24);

            entity.HasOne(task => task.User)
                .WithMany(user => user.Tasks)
                .HasForeignKey(task => task.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(task => task.Customer)
                .WithMany(customer => customer.Tasks)
                .HasForeignKey(task => task.CustomerId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(task => task.Property)
                .WithMany(property => property.Tasks)
                .HasForeignKey(task => task.PropertyId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<CustomerNote>(entity =>
        {
            entity.HasOne(note => note.Customer)
                .WithMany(customer => customer.CustomerNotes)
                .HasForeignKey(note => note.CustomerId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(note => note.User)
                .WithMany(user => user.CustomerNotes)
                .HasForeignKey(note => note.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Document>(entity =>
        {
            entity.Property(document => document.DocumentType).HasConversion<string>().HasMaxLength(40);

            entity.HasOne(document => document.User)
                .WithMany(user => user.Documents)
                .HasForeignKey(document => document.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(document => document.Customer)
                .WithMany(customer => customer.Documents)
                .HasForeignKey(document => document.CustomerId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(document => document.Property)
                .WithMany(property => property.Documents)
                .HasForeignKey(document => document.PropertyId)
                .OnDelete(DeleteBehavior.SetNull);
        });
    }
}
