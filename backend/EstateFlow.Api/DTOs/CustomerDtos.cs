using System.ComponentModel.DataAnnotations;
using EstateFlow.Api.Entities;

namespace EstateFlow.Api.DTOs;

public class CustomerQueryParameters
{
    public string? Search { get; set; }
    public CustomerType? CustomerType { get; set; }
    public CustomerStatus? Status { get; set; }
    public string? Source { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class CreateCustomerRequest
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

    public CustomerType CustomerType { get; set; }

    public decimal? BudgetMin { get; set; }

    public decimal? BudgetMax { get; set; }

    public PropertyType? DesiredPropertyType { get; set; }

    [MaxLength(80)]
    public string? DesiredCity { get; set; }

    [MaxLength(80)]
    public string? DesiredDistrict { get; set; }

    [MaxLength(1600)]
    public string? Notes { get; set; }

    public CustomerStatus Status { get; set; } = CustomerStatus.New;
}

public class UpdateCustomerRequest : CreateCustomerRequest;

public class AddCustomerNoteRequest
{
    [Required]
    [MaxLength(1400)]
    public string Note { get; set; } = string.Empty;
}

public class CustomerNoteResponse
{
    public int Id { get; init; }
    public int CustomerId { get; init; }
    public string Note { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
    public int UserId { get; init; }
    public string ConsultantName { get; init; } = string.Empty;
}

public class CustomerResponse
{
    public int Id { get; init; }
    public string FullName { get; init; } = string.Empty;
    public string Phone { get; init; } = string.Empty;
    public string? Email { get; init; }
    public CustomerType CustomerType { get; init; }
    public decimal? BudgetMin { get; init; }
    public decimal? BudgetMax { get; init; }
    public PropertyType? DesiredPropertyType { get; init; }
    public string? DesiredCity { get; init; }
    public string? DesiredDistrict { get; init; }
    public string? Notes { get; init; }
    public CustomerStatus Status { get; init; }
    public DateTime CreatedAt { get; init; }
    public int UserId { get; init; }
    public string ConsultantName { get; init; } = string.Empty;
    public IReadOnlyList<CustomerNoteResponse> CustomerNotes { get; init; } = Array.Empty<CustomerNoteResponse>();
}
