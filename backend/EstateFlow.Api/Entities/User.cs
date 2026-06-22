using System.ComponentModel.DataAnnotations;

namespace EstateFlow.Api.Entities;

public class User
{
    public int Id { get; set; }

    [MaxLength(120)]
    public string FullName { get; set; } = string.Empty;

    [MaxLength(160)]
    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public UserRole Role { get; set; } = UserRole.Consultant;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Property> Properties { get; set; } = new List<Property>();

    public ICollection<Customer> Customers { get; set; } = new List<Customer>();

    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();

    public ICollection<CustomerNote> CustomerNotes { get; set; } = new List<CustomerNote>();

    public ICollection<Document> Documents { get; set; } = new List<Document>();
}
