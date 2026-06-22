using System.ComponentModel.DataAnnotations;
using EstateFlow.Api.Entities;

namespace EstateFlow.Api.DTOs;

public class PropertyQueryParameters
{
    public string? Search { get; set; }
    public ListingType? ListingType { get; set; }
    public PropertyType? PropertyType { get; set; }
    public PropertyStatus? Status { get; set; }
    public string SortBy { get; set; } = "createdAt";
    public string SortDirection { get; set; } = "desc";
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class CreatePropertyRequest
{
    [Required]
    [MaxLength(180)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    public ListingType ListingType { get; set; }

    public PropertyType PropertyType { get; set; }

    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }

    [Required]
    [MaxLength(80)]
    public string City { get; set; } = string.Empty;

    [Required]
    [MaxLength(80)]
    public string District { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? Neighborhood { get; set; }

    [MaxLength(300)]
    public string? Address { get; set; }

    [Range(1, int.MaxValue)]
    public int SquareMeters { get; set; }

    [Required]
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

    [Required]
    [MaxLength(120)]
    public string OwnerName { get; set; } = string.Empty;

    [Required]
    [MaxLength(40)]
    public string OwnerPhone { get; set; } = string.Empty;
}

public class UpdatePropertyRequest : CreatePropertyRequest;

public class AddPropertyImageRequest
{
    [Required]
    [Url]
    [MaxLength(700)]
    public string ImageUrl { get; set; } = string.Empty;

    public bool IsMainImage { get; set; }
}

public class UpdatePropertyStatusRequest
{
    public PropertyStatus Status { get; set; }
}

public class PropertyImageResponse
{
    public int Id { get; init; }
    public string ImageUrl { get; init; } = string.Empty;
    public bool IsMainImage { get; init; }
    public DateTime CreatedAt { get; init; }
}

public class PropertyResponse
{
    public int Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public ListingType ListingType { get; init; }
    public PropertyType PropertyType { get; init; }
    public decimal Price { get; init; }
    public string City { get; init; } = string.Empty;
    public string District { get; init; } = string.Empty;
    public string? Neighborhood { get; init; }
    public string? Address { get; init; }
    public int SquareMeters { get; init; }
    public string RoomCount { get; init; } = string.Empty;
    public int? BuildingAge { get; init; }
    public int? Floor { get; init; }
    public int? TotalFloors { get; init; }
    public string? HeatingType { get; init; }
    public bool IsFurnished { get; init; }
    public decimal? Dues { get; init; }
    public decimal? Deposit { get; init; }
    public PropertyStatus Status { get; init; }
    public string OwnerName { get; init; } = string.Empty;
    public string OwnerPhone { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }
    public int UserId { get; init; }
    public string ConsultantName { get; init; } = string.Empty;
    public IReadOnlyList<PropertyImageResponse> Images { get; init; } = Array.Empty<PropertyImageResponse>();
}
