using System.Text;
using EstateFlow.Api.Data;
using EstateFlow.Api.DTOs;
using EstateFlow.Api.Entities;
using EstateFlow.Api.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EstateFlow.Api.Controllers;

[ApiController]
[AllowAnonymous]
[Route("api/public")]
public class PublicController(ApplicationDbContext db, IConfiguration configuration) : ControllerBase
{
    [HttpGet("properties")]
    public async Task<ActionResult<PagedResult<PublicPropertyResponse>>> GetProperties(
        [FromQuery] PublicPropertyQueryParameters queryParameters,
        CancellationToken cancellationToken)
    {
        var query = ActivePropertiesQuery();
        query = ApplyFilters(query, queryParameters);

        var descending = !string.Equals(queryParameters.SortDirection, "asc", StringComparison.OrdinalIgnoreCase);
        query = queryParameters.SortBy.ToLowerInvariant() switch
        {
            "price" => descending ? query.OrderByDescending(property => property.Price) : query.OrderBy(property => property.Price),
            _ => descending ? query.OrderByDescending(property => property.CreatedAt) : query.OrderBy(property => property.CreatedAt)
        };

        var pageNumber = Math.Max(1, queryParameters.PageNumber);
        var pageSize = Math.Clamp(queryParameters.PageSize, 1, 48);
        var totalCount = await query.CountAsync(cancellationToken);
        var properties = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return Ok(new PagedResult<PublicPropertyResponse>(
            properties.Select(property => property.ToPublicResponse()).ToList(),
            pageNumber,
            pageSize,
            totalCount));
    }

    [HttpGet("properties/{id:int}")]
    public async Task<ActionResult<PublicPropertyResponse>> GetProperty(int id, CancellationToken cancellationToken)
    {
        var property = await ActivePropertiesQuery()
            .FirstOrDefaultAsync(candidate => candidate.Id == id, cancellationToken)
            ?? throw new KeyNotFoundException("İlan bulunamadı.");

        return Ok(property.ToPublicResponse());
    }

    [HttpPost("leads")]
    public async Task<ActionResult<PublicLeadResponse>> CreateLead(PublicLeadRequest request, CancellationToken cancellationToken)
    {
        if (!string.IsNullOrWhiteSpace(request.Website))
        {
            throw new BadHttpRequestException("Talep doğrulanamadı.");
        }

        var admin = await ResolveDefaultAdmin(cancellationToken)
            ?? throw new InvalidOperationException("Talebinizi şu anda alamıyoruz. Lütfen daha sonra tekrar deneyin.");

        Property? property = null;
        if (request.PropertyId is not null)
        {
            property = await db.Properties
                .AsNoTracking()
                .FirstOrDefaultAsync(candidate =>
                    candidate.Id == request.PropertyId && candidate.Status == PropertyStatus.Active,
                    cancellationToken)
                ?? throw new KeyNotFoundException("İlan bulunamadı.");
        }

        var customer = new Customer
        {
            FullName = request.FullName.Trim(),
            Phone = request.Phone.Trim(),
            Email = TrimOrNull(request.Email),
            CustomerType = request.CustomerType ?? InferCustomerType(property),
            BudgetMin = request.BudgetMin,
            BudgetMax = request.BudgetMax,
            DesiredPropertyType = request.DesiredPropertyType ?? property?.PropertyType,
            DesiredCity = TrimOrNull(request.DesiredCity) ?? property?.City,
            DesiredDistrict = TrimOrNull(request.DesiredDistrict) ?? property?.District,
            Notes = BuildLeadNotes(request, property),
            Status = CustomerStatus.New,
            UserId = admin.Id,
            CreatedAt = DateTime.UtcNow
        };

        db.Customers.Add(customer);
        await db.SaveChangesAsync(cancellationToken);

        var task = new TaskItem
        {
            Title = Truncate($"Web talebini ara: {customer.FullName}", 180),
            Description = BuildTaskDescription(customer, request, property),
            DueDate = DateTime.UtcNow.Date.AddDays(1),
            Priority = property is null ? Priority.Medium : Priority.High,
            Status = TaskItemStatus.Todo,
            UserId = admin.Id,
            CustomerId = customer.Id,
            PropertyId = property?.Id,
            CreatedAt = DateTime.UtcNow
        };

        db.Tasks.Add(task);
        await db.SaveChangesAsync(cancellationToken);

        return Ok(new PublicLeadResponse("Talebiniz alındı. Danışmanımız en kısa sürede sizinle iletişime geçecek."));
    }

    private IQueryable<Property> ActivePropertiesQuery()
    {
        return db.Properties
            .AsNoTracking()
            .Include(property => property.Images)
            .Where(property => property.Status == PropertyStatus.Active);
    }

    private static IQueryable<Property> ApplyFilters(IQueryable<Property> query, PublicPropertyQueryParameters queryParameters)
    {
        if (!string.IsNullOrWhiteSpace(queryParameters.Search))
        {
            var search = $"%{queryParameters.Search.Trim()}%";
            query = query.Where(property =>
                EF.Functions.Like(property.Title, search) ||
                EF.Functions.Like(property.City, search) ||
                EF.Functions.Like(property.District, search) ||
                (property.Neighborhood != null && EF.Functions.Like(property.Neighborhood, search)));
        }

        if (queryParameters.ListingType is not null)
        {
            query = query.Where(property => property.ListingType == queryParameters.ListingType);
        }

        if (queryParameters.PropertyType is not null)
        {
            query = query.Where(property => property.PropertyType == queryParameters.PropertyType);
        }

        if (!string.IsNullOrWhiteSpace(queryParameters.City))
        {
            var city = $"%{queryParameters.City.Trim()}%";
            query = query.Where(property => EF.Functions.Like(property.City, city));
        }

        if (!string.IsNullOrWhiteSpace(queryParameters.District))
        {
            var district = $"%{queryParameters.District.Trim()}%";
            query = query.Where(property => EF.Functions.Like(property.District, district));
        }

        return query;
    }

    private async Task<User?> ResolveDefaultAdmin(CancellationToken cancellationToken)
    {
        var defaultAdminEmail = configuration["PublicLeads:DefaultAdminEmail"]?.Trim();

        if (!string.IsNullOrWhiteSpace(defaultAdminEmail))
        {
            var normalizedEmail = defaultAdminEmail.ToLower();
            var configuredAdmin = await db.Users
                .FirstOrDefaultAsync(user =>
                    user.Role == UserRole.Admin && user.Email.ToLower() == normalizedEmail,
                    cancellationToken);

            if (configuredAdmin is not null)
            {
                return configuredAdmin;
            }
        }

        return await db.Users
            .Where(user => user.Role == UserRole.Admin)
            .OrderBy(user => user.Id)
            .FirstOrDefaultAsync(cancellationToken);
    }

    private static CustomerType InferCustomerType(Property? property)
    {
        return property?.ListingType == ListingType.ForRent ? CustomerType.Tenant : CustomerType.Buyer;
    }

    private static string BuildLeadNotes(PublicLeadRequest request, Property? property)
    {
        var lines = new List<string>
        {
            "Kaynak: Web sitesi talebi"
        };

        if (property is not null)
        {
            lines.Add($"İlgilenilen ilan: #{property.Id} - {property.Title}");
            lines.Add($"İlan konumu: {property.City}, {property.District}");
        }

        if (!string.IsNullOrWhiteSpace(request.PreferredContactTime))
        {
            lines.Add($"Tercih edilen iletişim zamanı: {request.PreferredContactTime.Trim()}");
        }

        if (!string.IsNullOrWhiteSpace(request.Notes))
        {
            lines.Add($"Ziyaretçi notu: {request.Notes.Trim()}");
        }

        return Truncate(string.Join(Environment.NewLine, lines), 1600);
    }

    private static string BuildTaskDescription(Customer customer, PublicLeadRequest request, Property? property)
    {
        var builder = new StringBuilder();
        builder.AppendLine("Public web sitesinden yeni talep geldi.");
        builder.AppendLine($"Telefon: {customer.Phone}");

        if (!string.IsNullOrWhiteSpace(customer.Email))
        {
            builder.AppendLine($"E-posta: {customer.Email}");
        }

        if (property is not null)
        {
            builder.AppendLine($"İlan: #{property.Id} - {property.Title}");
        }

        if (!string.IsNullOrWhiteSpace(request.PreferredContactTime))
        {
            builder.AppendLine($"İletişim zamanı: {request.PreferredContactTime.Trim()}");
        }

        if (!string.IsNullOrWhiteSpace(request.Notes))
        {
            builder.AppendLine($"Not: {request.Notes.Trim()}");
        }

        return Truncate(builder.ToString().Trim(), 1200);
    }

    private static string? TrimOrNull(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }

    private static string Truncate(string value, int maxLength)
    {
        return value.Length <= maxLength ? value : value[..maxLength];
    }
}
