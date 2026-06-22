using System.ComponentModel.DataAnnotations;
using EstateFlow.Api.Entities;

namespace EstateFlow.Api.DTOs;

public class CreateTaskRequest
{
    [Required]
    [MaxLength(180)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1200)]
    public string? Description { get; set; }

    public DateTime? DueDate { get; set; }

    public Priority Priority { get; set; } = Priority.Medium;

    public TaskItemStatus Status { get; set; } = TaskItemStatus.Todo;

    public int? CustomerId { get; set; }

    public int? PropertyId { get; set; }
}

public class UpdateTaskRequest : CreateTaskRequest;

public class UpdateTaskStatusRequest
{
    public TaskItemStatus Status { get; set; }
}

public class TaskResponse
{
    public int Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? Description { get; init; }
    public DateTime? DueDate { get; init; }
    public Priority Priority { get; init; }
    public TaskItemStatus Status { get; init; }
    public int UserId { get; init; }
    public string ConsultantName { get; init; } = string.Empty;
    public int? CustomerId { get; init; }
    public string? CustomerName { get; init; }
    public int? PropertyId { get; init; }
    public string? PropertyTitle { get; init; }
    public DateTime CreatedAt { get; init; }
}
