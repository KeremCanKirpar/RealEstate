using EstateFlow.Api.Data;
using EstateFlow.Api.DTOs;
using EstateFlow.Api.Entities;
using EstateFlow.Api.Helpers;
using Microsoft.EntityFrameworkCore;

namespace EstateFlow.Api.Services;

public class DashboardService(ApplicationDbContext db) : IDashboardService
{
    public async Task<DashboardStatsResponse> GetStatsAsync(int userId, bool isAdmin, CancellationToken cancellationToken = default)
    {
        var properties = Owned(db.Properties.AsNoTracking(), userId, isAdmin);
        var customers = Owned(db.Customers.AsNoTracking(), userId, isAdmin);
        var appointments = Owned(db.Appointments.AsNoTracking(), userId, isAdmin);

        var startOfWeek = DateTime.UtcNow.Date.AddDays(-(int)DateTime.UtcNow.DayOfWeek + (int)DayOfWeek.Monday);
        var endOfWeek = startOfWeek.AddDays(7);

        var totalProperties = await properties.CountAsync(cancellationToken);
        var activeListings = await properties.CountAsync(property => property.Status == PropertyStatus.Active, cancellationToken);
        var customerCount = await customers.CountAsync(cancellationToken);
        var appointmentsThisWeek = await appointments.CountAsync(appointment =>
            appointment.AppointmentDate >= startOfWeek && appointment.AppointmentDate < endOfWeek, cancellationToken);
        var completedDeals = await properties.CountAsync(property =>
            property.Status == PropertyStatus.Sold || property.Status == PropertyStatus.Rented, cancellationToken);
        var closedDealVolume = await properties
            .Where(property => property.Status == PropertyStatus.Sold || property.Status == PropertyStatus.Rented)
            .SumAsync(property => property.Price, cancellationToken);

        return new DashboardStatsResponse
        {
            TotalProperties = totalProperties,
            ActiveListings = activeListings,
            Customers = customerCount,
            AppointmentsThisWeek = appointmentsThisWeek,
            CompletedDeals = completedDeals,
            EstimatedCommission = Math.Round(closedDealVolume * 0.02m, 2)
        };
    }

    public async Task<IReadOnlyList<PropertyResponse>> GetRecentPropertiesAsync(int userId, bool isAdmin, CancellationToken cancellationToken = default)
    {
        var properties = await Owned(db.Properties.AsNoTracking(), userId, isAdmin)
            .Include(property => property.Images)
            .Include(property => property.User)
            .OrderByDescending(property => property.CreatedAt)
            .Take(6)
            .ToListAsync(cancellationToken);

        return properties.Select(property => property.ToResponse()).ToList();
    }

    public async Task<IReadOnlyList<AppointmentResponse>> GetUpcomingAppointmentsAsync(int userId, bool isAdmin, CancellationToken cancellationToken = default)
    {
        var appointments = await Owned(db.Appointments.AsNoTracking(), userId, isAdmin)
            .Include(appointment => appointment.Customer)
            .Include(appointment => appointment.Property)
            .Include(appointment => appointment.User)
            .Where(appointment => appointment.AppointmentDate >= DateTime.UtcNow && appointment.Status == AppointmentStatus.Planned)
            .OrderBy(appointment => appointment.AppointmentDate)
            .Take(6)
            .ToListAsync(cancellationToken);

        return appointments.Select(appointment => appointment.ToResponse()).ToList();
    }

    public async Task<IReadOnlyList<CustomerResponse>> GetLatestCustomersAsync(int userId, bool isAdmin, CancellationToken cancellationToken = default)
    {
        var customers = await Owned(db.Customers.AsNoTracking(), userId, isAdmin)
            .Include(customer => customer.User)
            .Include(customer => customer.CustomerNotes)
            .ThenInclude(note => note.User)
            .OrderByDescending(customer => customer.CreatedAt)
            .Take(6)
            .ToListAsync(cancellationToken);

        return customers.Select(customer => customer.ToResponse()).ToList();
    }

    public async Task<IReadOnlyList<TaskSummaryResponse>> GetTaskSummaryAsync(int userId, bool isAdmin, CancellationToken cancellationToken = default)
    {
        var summaries = await Owned(db.Tasks.AsNoTracking(), userId, isAdmin)
            .GroupBy(task => task.Status)
            .Select(group => new TaskSummaryResponse { Status = group.Key, Count = group.Count() })
            .ToListAsync(cancellationToken);

        return Enum.GetValues<TaskItemStatus>()
            .Select(status => summaries.FirstOrDefault(summary => summary.Status == status) ?? new TaskSummaryResponse { Status = status, Count = 0 })
            .ToList();
    }

    private static IQueryable<T> Owned<T>(IQueryable<T> query, int userId, bool isAdmin) where T : class
    {
        if (isAdmin)
        {
            return query;
        }

        return typeof(T).Name switch
        {
            nameof(Property) => (IQueryable<T>)((IQueryable<Property>)query).Where(entity => entity.UserId == userId),
            nameof(Customer) => (IQueryable<T>)((IQueryable<Customer>)query).Where(entity => entity.UserId == userId),
            nameof(Appointment) => (IQueryable<T>)((IQueryable<Appointment>)query).Where(entity => entity.UserId == userId),
            nameof(TaskItem) => (IQueryable<T>)((IQueryable<TaskItem>)query).Where(entity => entity.UserId == userId),
            _ => query
        };
    }
}
