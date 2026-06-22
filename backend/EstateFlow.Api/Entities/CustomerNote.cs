using System.ComponentModel.DataAnnotations;

namespace EstateFlow.Api.Entities;

public class CustomerNote
{
    public int Id { get; set; }

    public int CustomerId { get; set; }

    public Customer? Customer { get; set; }

    [MaxLength(1400)]
    public string Note { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int UserId { get; set; }

    public User? User { get; set; }
}
