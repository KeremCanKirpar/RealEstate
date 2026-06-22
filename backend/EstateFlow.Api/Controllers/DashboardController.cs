using EstateFlow.Api.DTOs;
using EstateFlow.Api.Helpers;
using EstateFlow.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EstateFlow.Api.Controllers;

[ApiController]
[Authorize(Policy = "PanelUsers")]
[Route("api/[controller]")]
public class DashboardController(IDashboardService dashboardService) : ControllerBase
{
    [HttpGet("stats")]
    public async Task<ActionResult<DashboardStatsResponse>> GetStats(CancellationToken cancellationToken)
    {
        return Ok(await dashboardService.GetStatsAsync(User.GetUserId(), User.IsAdmin(), cancellationToken));
    }

    [HttpGet("recent-properties")]
    public async Task<ActionResult<IReadOnlyList<PropertyResponse>>> GetRecentProperties(CancellationToken cancellationToken)
    {
        return Ok(await dashboardService.GetRecentPropertiesAsync(User.GetUserId(), User.IsAdmin(), cancellationToken));
    }

    [HttpGet("upcoming-appointments")]
    public async Task<ActionResult<IReadOnlyList<AppointmentResponse>>> GetUpcomingAppointments(CancellationToken cancellationToken)
    {
        return Ok(await dashboardService.GetUpcomingAppointmentsAsync(User.GetUserId(), User.IsAdmin(), cancellationToken));
    }

    [HttpGet("latest-customers")]
    public async Task<ActionResult<IReadOnlyList<CustomerResponse>>> GetLatestCustomers(CancellationToken cancellationToken)
    {
        return Ok(await dashboardService.GetLatestCustomersAsync(User.GetUserId(), User.IsAdmin(), cancellationToken));
    }

    [HttpGet("task-summary")]
    public async Task<ActionResult<IReadOnlyList<TaskSummaryResponse>>> GetTaskSummary(CancellationToken cancellationToken)
    {
        return Ok(await dashboardService.GetTaskSummaryAsync(User.GetUserId(), User.IsAdmin(), cancellationToken));
    }
}
