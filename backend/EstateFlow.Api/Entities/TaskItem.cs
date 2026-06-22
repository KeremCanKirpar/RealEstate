using System.ComponentModel.DataAnnotations;

namespace EstateFlow.Api.Entities;

public class TaskItem
{
    public int Id { get; set; }

    [MaxLength(180)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1200)]
    public string? Description { get; set; }

    public DateTime? DueDate { get; set; }

    public Priority Priority { get; set; } = Priority.Medium;

    public TaskItemStatus Status { get; set; } = TaskItemStatus.Todo;

    public int UserId { get; set; }

    public User? User { get; set; }

    public int? CustomerId { get; set; }

    public Customer? Customer { get; set; }

    public int? PropertyId { get; set; }

    public Property? Property { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
