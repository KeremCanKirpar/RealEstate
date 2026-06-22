using System.ComponentModel.DataAnnotations;
using EstateFlow.Api.Entities;

namespace EstateFlow.Api.DTOs;

public class CreateDocumentRequest
{
    [MaxLength(220)]
    public string? FileName { get; set; }

    [MaxLength(700)]
    public string? FileUrl { get; set; }

    public IFormFile? File { get; set; }

    public DocumentType DocumentType { get; set; }

    public int? PropertyId { get; set; }

    public int? CustomerId { get; set; }
}

public class DocumentResponse
{
    public int Id { get; init; }
    public string FileName { get; init; } = string.Empty;
    public string FileUrl { get; init; } = string.Empty;
    public DocumentType DocumentType { get; init; }
    public int? PropertyId { get; init; }
    public string? PropertyTitle { get; init; }
    public int? CustomerId { get; init; }
    public string? CustomerName { get; init; }
    public DateTime CreatedAt { get; init; }
    public int UserId { get; init; }
    public string ConsultantName { get; init; } = string.Empty;
}
