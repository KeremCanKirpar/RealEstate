using System.ComponentModel.DataAnnotations;

namespace EstateFlow.Api.Entities;

public class Appointment
{
    public int Id { get; set; }

    public int CustomerId { get; set; }

    public Customer? Customer { get; set; }

    public int? PropertyId { get; set; }

    public Property? Property { get; set; }

    public DateTime AppointmentDate { get; set; }

    public AppointmentType AppointmentType { get; set; }

    [MaxLength(220)]
    public string Location { get; set; } = string.Empty;

    public AppointmentStatus Status { get; set; } = AppointmentStatus.Planned;

    [MaxLength(1200)]
    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int UserId { get; set; }

    public User? User { get; set; }
}
