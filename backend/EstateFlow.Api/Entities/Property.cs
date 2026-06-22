using System.ComponentModel.DataAnnotations;

namespace EstateFlow.Api.Entities;

public class Property
{
    public int Id { get; set; }

    [MaxLength(180)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    public ListingType ListingType { get; set; }

    public PropertyType PropertyType { get; set; }

    public decimal Price { get; set; }

    [MaxLength(80)]
    public string City { get; set; } = string.Empty;

    [MaxLength(80)]
    public string District { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? Neighborhood { get; set; }

    [MaxLength(300)]
    public string? Address { get; set; }

    public int SquareMeters { get; set; }

    [MaxLength(20)]
    public string RoomCount { get; set; } = string.Empty;

    public int? BuildingAge { get; set; }

    public int? Floor { get; set; }

    public int? TotalFloors { get; set; }

    [MaxLength(80)]
    public string? HeatingType { get; set; }

    public bool IsFurnished { get; set; }

    public decimal? Dues { get; set; }

    public decimal? Deposit { get; set; }

    public PropertyStatus Status { get; set; } = PropertyStatus.Active;

    [MaxLength(120)]
    public string OwnerName { get; set; } = string.Empty;

    [MaxLength(40)]
    public string OwnerPhone { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public int UserId { get; set; }

    public User? User { get; set; }

    public ICollection<PropertyImage> Images { get; set; } = new List<PropertyImage>();

    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();

    public ICollection<Document> Documents { get; set; } = new List<Document>();
}
