using System.ComponentModel.DataAnnotations;
using EstateFlow.Api.Entities;

namespace EstateFlow.Api.DTOs;

public class PublicPropertyQueryParameters
{
    public string? Search { get; set; }
    public ListingType? ListingType { get; set; }
    public PropertyType? PropertyType { get; set; }
    public string? City { get; set; }
    public string? District { get; set; }
    public string SortBy { get; set; } = "createdAt";
    public string SortDirection { get; set; } = "desc";
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 12;
}

public class PublicLeadRequest
{
    [Required]
    [MaxLength(120)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [MaxLength(40)]
    public string Phone { get; set; } = string.Empty;

    [EmailAddress]
    [MaxLength(160)]
    public string? Email { get; set; }

    public CustomerType? CustomerType { get; set; }

    public decimal? BudgetMin { get; set; }

    public decimal? BudgetMax { get; set; }

    public PropertyType? DesiredPropertyType { get; set; }

    [MaxLength(80)]
    public string? DesiredCity { get; set; }

    [MaxLength(80)]
    public string? DesiredDistrict { get; set; }

    [MaxLength(1200)]
    public string? Notes { get; set; }

    public int? PropertyId { get; set; }

    [MaxLength(120)]
    public string? PreferredContactTime { get; set; }

    [MaxLength(120)]
    public string? Website { get; set; }
}

public record PublicLeadResponse(string Message);

public class PublicPropertyImageResponse
{
    public int Id { get; init; }
    public string ImageUrl { get; init; } = string.Empty;
    public bool IsMainImage { get; init; }
}

public class PublicPropertyResponse
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
    public int SquareMeters { get; init; }
    public string RoomCount { get; init; } = string.Empty;
    public int? BuildingAge { get; init; }
    public int? Floor { get; init; }
    public int? TotalFloors { get; init; }
    public string? HeatingType { get; init; }
    public bool IsFurnished { get; init; }
    public decimal? Dues { get; init; }
    public decimal? Deposit { get; init; }
    public DateTime CreatedAt { get; init; }
    public IReadOnlyList<PublicPropertyImageResponse> Images { get; init; } = Array.Empty<PublicPropertyImageResponse>();
}
