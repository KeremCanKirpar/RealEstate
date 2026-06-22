using EstateFlow.Api.Data;
using EstateFlow.Api.DTOs;
using EstateFlow.Api.Entities;
using EstateFlow.Api.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EstateFlow.Api.Controllers;

[ApiController]
[Authorize(Policy = "PanelUsers")]
[Route("api/tasks")]
public class TasksController(ApplicationDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<TaskResponse>>> GetTasks(CancellationToken cancellationToken)
    {
        var tasks = await GetOwnedTaskQuery()
            .AsNoTracking()
            .OrderBy(task => task.Status)
            .ThenByDescending(task => task.Priority)
            .ThenBy(task => task.DueDate)
            .ToListAsync(cancellationToken);

        return Ok(tasks.Select(task => task.ToResponse()).ToList());
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TaskResponse>> GetTask(int id, CancellationToken cancellationToken)
    {
        var task = await GetOwnedTaskQuery()
            .AsNoTracking()
            .FirstOrDefaultAsync(candidate => candidate.Id == id, cancellationToken)
            ?? throw new KeyNotFoundException("Görev bulunamadı.");

        return Ok(task.ToResponse());
    }

    [HttpPost]
    public async Task<ActionResult<TaskResponse>> CreateTask(CreateTaskRequest request, CancellationToken cancellationToken)
    {
        await EnsureRelatedEntitiesAreVisibleAsync(request.CustomerId, request.PropertyId, cancellationToken);

        var task = new TaskItem
        {
            UserId = User.GetUserId(),
            CreatedAt = DateTime.UtcNow
        };

        ApplyRequest(task, request);
        db.Tasks.Add(task);
        await db.SaveChangesAsync(cancellationToken);

        var created = await GetOwnedTaskQuery().FirstAsync(candidate => candidate.Id == task.Id, cancellationToken);
        return CreatedAtAction(nameof(GetTask), new { id = task.Id }, created.ToResponse());
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<TaskResponse>> UpdateTask(int id, UpdateTaskRequest request, CancellationToken cancellationToken)
    {
        var task = await db.Tasks.FirstOrDefaultAsync(candidate => candidate.Id == id, cancellationToken)
            ?? throw new KeyNotFoundException("Görev bulunamadı.");

        EnsureOwnership(task.UserId);
        await EnsureRelatedEntitiesAreVisibleAsync(request.CustomerId, request.PropertyId, cancellationToken);
        ApplyRequest(task, request);
        await db.SaveChangesAsync(cancellationToken);

        var updated = await GetOwnedTaskQuery().FirstAsync(candidate => candidate.Id == task.Id, cancellationToken);
        return Ok(updated.ToResponse());
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteTask(int id, CancellationToken cancellationToken)
    {
        var task = await db.Tasks.FirstOrDefaultAsync(candidate => candidate.Id == id, cancellationToken)
            ?? throw new KeyNotFoundException("Görev bulunamadı.");

        EnsureOwnership(task.UserId);
        db.Tasks.Remove(task);
        await db.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    [HttpPut("{id:int}/status")]
    public async Task<ActionResult<TaskResponse>> UpdateStatus(int id, UpdateTaskStatusRequest request, CancellationToken cancellationToken)
    {
        var task = await db.Tasks.FirstOrDefaultAsync(candidate => candidate.Id == id, cancellationToken)
            ?? throw new KeyNotFoundException("Görev bulunamadı.");

        EnsureOwnership(task.UserId);
        task.Status = request.Status;
        await db.SaveChangesAsync(cancellationToken);

        var updated = await GetOwnedTaskQuery().FirstAsync(candidate => candidate.Id == task.Id, cancellationToken);
        return Ok(updated.ToResponse());
    }

    private IQueryable<TaskItem> GetOwnedTaskQuery()
    {
        var query = db.Tasks
            .Include(task => task.User)
            .Include(task => task.Customer)
            .Include(task => task.Property)
            .AsQueryable();

        return User.IsAdmin() ? query : query.Where(task => task.UserId == User.GetUserId());
    }

    private void EnsureOwnership(int ownerUserId)
    {
        if (!User.IsAdmin() && ownerUserId != User.GetUserId())
        {
            throw new KeyNotFoundException("Görev bulunamadı.");
        }
    }

    private async Task EnsureRelatedEntitiesAreVisibleAsync(int? customerId, int? propertyId, CancellationToken cancellationToken)
    {
        if (customerId is not null)
        {
            var customer = await db.Customers.AsNoTracking().FirstOrDefaultAsync(candidate => candidate.Id == customerId, cancellationToken)
                ?? throw new InvalidOperationException("Seçilen müşteri mevcut değil.");

            if (!User.IsAdmin() && customer.UserId != User.GetUserId())
            {
                throw new InvalidOperationException("Seçilen müşteri bu danışman için erişilebilir değil.");
            }
        }

        if (propertyId is not null)
        {
            var property = await db.Properties.AsNoTracking().FirstOrDefaultAsync(candidate => candidate.Id == propertyId, cancellationToken)
                ?? throw new InvalidOperationException("Seçilen ilan mevcut değil.");

            if (!User.IsAdmin() && property.UserId != User.GetUserId())
            {
                throw new InvalidOperationException("Seçilen ilan bu danışman için erişilebilir değil.");
            }
        }
    }

    private static void ApplyRequest(TaskItem task, CreateTaskRequest request)
    {
        task.Title = request.Title.Trim();
        task.Description = request.Description?.Trim();
        task.DueDate = request.DueDate;
        task.Priority = request.Priority;
        task.Status = request.Status;
        task.CustomerId = request.CustomerId;
        task.PropertyId = request.PropertyId;
    }
}
