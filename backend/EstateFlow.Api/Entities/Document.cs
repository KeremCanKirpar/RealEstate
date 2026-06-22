using System.ComponentModel.DataAnnotations;

namespace EstateFlow.Api.Entities;

public class Document
{
    public int Id { get; set; }

    [MaxLength(220)]
    public string FileName { get; set; } = string.Empty;

    [MaxLength(700)]
    public string FileUrl { get; set; } = string.Empty;

    public DocumentType DocumentType { get; set; }

    public int? PropertyId { get; set; }

    public Property? Property { get; set; }

    public int? CustomerId { get; set; }

    public Customer? Customer { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int UserId { get; set; }

    public User? User { get; set; }
}
