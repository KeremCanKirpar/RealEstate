using System.ComponentModel.DataAnnotations;
using EstateFlow.Api.Entities;

namespace EstateFlow.Api.DTOs;

public class CreateAppointmentRequest
{
    [Range(1, int.MaxValue)]
    public int CustomerId { get; set; }

    public int? PropertyId { get; set; }

    public DateTime AppointmentDate { get; set; }

    public AppointmentType AppointmentType { get; set; }

    [Required]
    [MaxLength(220)]
    public string Location { get; set; } = string.Empty;

    public AppointmentStatus Status { get; set; } = AppointmentStatus.Planned;

    [MaxLength(1200)]
    public string? Notes { get; set; }
}

public class UpdateAppointmentRequest : CreateAppointmentRequest;

public class UpdateAppointmentStatusRequest
{
    public AppointmentStatus Status { get; set; }
}

public class AppointmentResponse
{
    public int Id { get; init; }
    public int CustomerId { get; init; }
    public string CustomerName { get; init; } = string.Empty;
    public int? PropertyId { get; init; }
    public string? PropertyTitle { get; init; }
    public DateTime AppointmentDate { get; init; }
    public AppointmentType AppointmentType { get; init; }
    public string Location { get; init; } = string.Empty;
    public AppointmentStatus Status { get; init; }
    public string? Notes { get; init; }
    public DateTime CreatedAt { get; init; }
    public int UserId { get; init; }
    public string ConsultantName { get; init; } = string.Empty;
}
