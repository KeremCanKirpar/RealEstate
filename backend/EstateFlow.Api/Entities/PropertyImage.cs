using System.ComponentModel.DataAnnotations;

namespace EstateFlow.Api.Entities;

public class PropertyImage
{
    public int Id { get; set; }

    public int PropertyId { get; set; }

    public Property? Property { get; set; }

    [MaxLength(700)]
    public string ImageUrl { get; set; } = string.Empty;

    public bool IsMainImage { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
