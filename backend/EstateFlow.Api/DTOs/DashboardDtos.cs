using EstateFlow.Api.Entities;

namespace EstateFlow.Api.DTOs;

public class DashboardStatsResponse
{
    public int TotalProperties { get; init; }
    public int ActiveListings { get; init; }
    public int Customers { get; init; }
    public int AppointmentsThisWeek { get; init; }
    public int CompletedDeals { get; init; }
    public decimal EstimatedCommission { get; init; }
}

public class TaskSummaryResponse
{
    public TaskItemStatus Status { get; init; }
    public int Count { get; init; }
}
