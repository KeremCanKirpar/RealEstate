using EstateFlow.Api.DTOs;

namespace EstateFlow.Api.Services;

public interface IDashboardService
{
    Task<DashboardStatsResponse> GetStatsAsync(int userId, bool isAdmin, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<PropertyResponse>> GetRecentPropertiesAsync(int userId, bool isAdmin, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<AppointmentResponse>> GetUpcomingAppointmentsAsync(int userId, bool isAdmin, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<CustomerResponse>> GetLatestCustomersAsync(int userId, bool isAdmin, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<TaskSummaryResponse>> GetTaskSummaryAsync(int userId, bool isAdmin, CancellationToken cancellationToken = default);
}
