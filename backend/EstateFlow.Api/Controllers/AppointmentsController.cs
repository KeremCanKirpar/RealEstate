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
[Route("api/[controller]")]
public class AppointmentsController(ApplicationDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<AppointmentResponse>>> GetAppointments(CancellationToken cancellationToken)
    {
        var appointments = await GetOwnedAppointmentQuery()
            .AsNoTracking()
            .OrderBy(appointment => appointment.AppointmentDate)
            .ToListAsync(cancellationToken);

        return Ok(appointments.Select(appointment => appointment.ToResponse()).ToList());
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<AppointmentResponse>> GetAppointment(int id, CancellationToken cancellationToken)
    {
        var appointment = await GetOwnedAppointmentQuery()
            .AsNoTracking()
            .FirstOrDefaultAsync(candidate => candidate.Id == id, cancellationToken)
            ?? throw new KeyNotFoundException("Randevu bulunamadı.");

        return Ok(appointment.ToResponse());
    }

    [HttpPost]
    public async Task<ActionResult<AppointmentResponse>> CreateAppointment(CreateAppointmentRequest request, CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        await EnsureRelatedEntitiesAreVisibleAsync(request.CustomerId, request.PropertyId, cancellationToken);
        await EnsureNoConflictAsync(userId, request.AppointmentDate, null, cancellationToken);

        var appointment = new Appointment
        {
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        ApplyRequest(appointment, request);
        db.Appointments.Add(appointment);
        await db.SaveChangesAsync(cancellationToken);

        var created = await GetOwnedAppointmentQuery().FirstAsync(candidate => candidate.Id == appointment.Id, cancellationToken);
        return CreatedAtAction(nameof(GetAppointment), new { id = appointment.Id }, created.ToResponse());
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<AppointmentResponse>> UpdateAppointment(int id, UpdateAppointmentRequest request, CancellationToken cancellationToken)
    {
        var appointment = await db.Appointments.FirstOrDefaultAsync(candidate => candidate.Id == id, cancellationToken)
            ?? throw new KeyNotFoundException("Randevu bulunamadı.");

        EnsureOwnership(appointment.UserId);
        await EnsureRelatedEntitiesAreVisibleAsync(request.CustomerId, request.PropertyId, cancellationToken);
        await EnsureNoConflictAsync(appointment.UserId, request.AppointmentDate, appointment.Id, cancellationToken);

        ApplyRequest(appointment, request);
        await db.SaveChangesAsync(cancellationToken);

        var updated = await GetOwnedAppointmentQuery().FirstAsync(candidate => candidate.Id == appointment.Id, cancellationToken);
        return Ok(updated.ToResponse());
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteAppointment(int id, CancellationToken cancellationToken)
    {
        var appointment = await db.Appointments.FirstOrDefaultAsync(candidate => candidate.Id == id, cancellationToken)
            ?? throw new KeyNotFoundException("Randevu bulunamadı.");

        EnsureOwnership(appointment.UserId);
        db.Appointments.Remove(appointment);
        await db.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    [HttpPut("{id:int}/status")]
    public async Task<ActionResult<AppointmentResponse>> UpdateStatus(
        int id,
        UpdateAppointmentStatusRequest request,
        CancellationToken cancellationToken)
    {
        var appointment = await db.Appointments.FirstOrDefaultAsync(candidate => candidate.Id == id, cancellationToken)
            ?? throw new KeyNotFoundException("Randevu bulunamadı.");

        EnsureOwnership(appointment.UserId);
        appointment.Status = request.Status;
        await db.SaveChangesAsync(cancellationToken);

        var updated = await GetOwnedAppointmentQuery().FirstAsync(candidate => candidate.Id == appointment.Id, cancellationToken);
        return Ok(updated.ToResponse());
    }

    private IQueryable<Appointment> GetOwnedAppointmentQuery()
    {
        var query = db.Appointments
            .Include(appointment => appointment.Customer)
            .Include(appointment => appointment.Property)
            .Include(appointment => appointment.User)
            .AsQueryable();

        return User.IsAdmin() ? query : query.Where(appointment => appointment.UserId == User.GetUserId());
    }

    private void EnsureOwnership(int ownerUserId)
    {
        if (!User.IsAdmin() && ownerUserId != User.GetUserId())
        {
            throw new KeyNotFoundException("Randevu bulunamadı.");
        }
    }

    private async Task EnsureRelatedEntitiesAreVisibleAsync(int customerId, int? propertyId, CancellationToken cancellationToken)
    {
        var customer = await db.Customers.AsNoTracking().FirstOrDefaultAsync(candidate => candidate.Id == customerId, cancellationToken)
            ?? throw new InvalidOperationException("Seçilen müşteri mevcut değil.");

        if (!User.IsAdmin() && customer.UserId != User.GetUserId())
        {
            throw new InvalidOperationException("Seçilen müşteri bu danışman için erişilebilir değil.");
        }

        if (propertyId is null)
        {
            return;
        }

        var property = await db.Properties.AsNoTracking().FirstOrDefaultAsync(candidate => candidate.Id == propertyId, cancellationToken)
            ?? throw new InvalidOperationException("Seçilen ilan mevcut değil.");

        if (!User.IsAdmin() && property.UserId != User.GetUserId())
        {
            throw new InvalidOperationException("Seçilen ilan bu danışman için erişilebilir değil.");
        }
    }

    private async Task EnsureNoConflictAsync(int userId, DateTime appointmentDate, int? excludedAppointmentId, CancellationToken cancellationToken)
    {
        var hasConflict = await db.Appointments.AnyAsync(appointment =>
            appointment.UserId == userId &&
            appointment.AppointmentDate == appointmentDate &&
            appointment.Status != AppointmentStatus.Cancelled &&
            (!excludedAppointmentId.HasValue || appointment.Id != excludedAppointmentId.Value),
            cancellationToken);

        if (hasConflict)
        {
            throw new InvalidOperationException("Bu danışmanın seçilen tarih ve saatte zaten bir randevusu var.");
        }
    }

    private static void ApplyRequest(Appointment appointment, CreateAppointmentRequest request)
    {
        appointment.CustomerId = request.CustomerId;
        appointment.PropertyId = request.PropertyId;
        appointment.AppointmentDate = request.AppointmentDate;
        appointment.AppointmentType = request.AppointmentType;
        appointment.Location = request.Location.Trim();
        appointment.Status = request.Status;
        appointment.Notes = request.Notes?.Trim();
    }
}
