using System.ComponentModel.DataAnnotations;

namespace EstateFlow.Api.Entities;

public class Customer
{
    public int Id { get; set; }

    [MaxLength(120)]
    public string FullName { get; set; } = string.Empty;

    [MaxLength(40)]
    public string Phone { get; set; } = string.Empty;

    [MaxLength(160)]
    public string? Email { get; set; }

    public CustomerType CustomerType { get; set; }

    public decimal? BudgetMin { get; set; }

    public decimal? BudgetMax { get; set; }

    public PropertyType? DesiredPropertyType { get; set; }

    [MaxLength(80)]
    public string? DesiredCity { get; set; }

    [MaxLength(80)]
    public string? DesiredDistrict { get; set; }

    [MaxLength(1600)]
    public string? Notes { get; set; }

    public CustomerStatus Status { get; set; } = CustomerStatus.New;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int UserId { get; set; }

    public User? User { get; set; }

    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();

    public ICollection<CustomerNote> CustomerNotes { get; set; } = new List<CustomerNote>();

    public ICollection<Document> Documents { get; set; } = new List<Document>();
}
