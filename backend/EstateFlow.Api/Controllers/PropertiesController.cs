using EstateFlow.Api.Data;
using EstateFlow.Api.DTOs;
using EstateFlow.Api.Entities;
using EstateFlow.Api.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EstateFlow.Api.Controllers;

[ApiController]
[Authorize(Policy = "PanelUsers")]
[Route("api/[controller]")]
public class PropertiesController(ApplicationDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedResult<PropertyResponse>>> GetProperties(
        [FromQuery] PropertyQueryParameters queryParameters,
        CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        var query = db.Properties
            .AsNoTracking()
            .Include(property => property.Images)
            .Include(property => property.User)
            .AsQueryable();

        if (!User.IsAdmin())
        {
            query = query.Where(property => property.UserId == userId);
        }

        if (!string.IsNullOrWhiteSpace(queryParameters.Search))
        {
            var search = $"%{queryParameters.Search.Trim()}%";
            query = query.Where(property =>
                EF.Functions.Like(property.Title, search) ||
                EF.Functions.Like(property.City, search) ||
                EF.Functions.Like(property.District, search));
        }

        if (queryParameters.ListingType is not null)
        {
            query = query.Where(property => property.ListingType == queryParameters.ListingType);
        }

        if (queryParameters.PropertyType is not null)
        {
            query = query.Where(property => property.PropertyType == queryParameters.PropertyType);
        }

        if (queryParameters.Status is not null)
        {
            query = query.Where(property => property.Status == queryParameters.Status);
        }

        var descending = !string.Equals(queryParameters.SortDirection, "asc", StringComparison.OrdinalIgnoreCase);
        query = queryParameters.SortBy.ToLowerInvariant() switch
        {
            "price" => descending ? query.OrderByDescending(property => property.Price) : query.OrderBy(property => property.Price),
            _ => descending ? query.OrderByDescending(property => property.CreatedAt) : query.OrderBy(property => property.CreatedAt)
        };

        var pageNumber = Math.Max(1, queryParameters.PageNumber);
        var pageSize = Math.Clamp(queryParameters.PageSize, 1, 100);
        var totalCount = await query.CountAsync(cancellationToken);
        var properties = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return Ok(new PagedResult<PropertyResponse>(
            properties.Select(property => property.ToResponse()).ToList(),
            pageNumber,
            pageSize,
            totalCount));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<PropertyResponse>> GetProperty(int id, CancellationToken cancellationToken)
    {
        var property = await GetOwnedPropertyQuery().FirstOrDefaultAsync(candidate => candidate.Id == id, cancellationToken)
            ?? throw new KeyNotFoundException("İlan bulunamadı.");

        return Ok(property.ToResponse());
    }

    [HttpPost]
    public async Task<ActionResult<PropertyResponse>> CreateProperty(CreatePropertyRequest request, CancellationToken cancellationToken)
    {
        var property = new Property
        {
            UserId = User.GetUserId(),
            CreatedAt = DateTime.UtcNow
        };

        ApplyRequest(property, request);
        db.Properties.Add(property);
        await db.SaveChangesAsync(cancellationToken);

        var created = await GetOwnedPropertyQuery().FirstAsync(candidate => candidate.Id == property.Id, cancellationToken);
        return CreatedAtAction(nameof(GetProperty), new { id = property.Id }, created.ToResponse());
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<PropertyResponse>> UpdateProperty(int id, UpdatePropertyRequest request, CancellationToken cancellationToken)
    {
        var property = await db.Properties.FirstOrDefaultAsync(candidate => candidate.Id == id, cancellationToken)
            ?? throw new KeyNotFoundException("İlan bulunamadı.");

        EnsureOwnership(property.UserId);
        ApplyRequest(property, request);
        property.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(cancellationToken);

        var updated = await GetOwnedPropertyQuery().FirstAsync(candidate => candidate.Id == property.Id, cancellationToken);
        return Ok(updated.ToResponse());
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteProperty(int id, CancellationToken cancellationToken)
    {
        var property = await db.Properties.FirstOrDefaultAsync(candidate => candidate.Id == id, cancellationToken)
            ?? throw new KeyNotFoundException("İlan bulunamadı.");

        EnsureOwnership(property.UserId);
        db.Properties.Remove(property);
        await db.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    [HttpPost("{id:int}/images")]
    public async Task<ActionResult<PropertyResponse>> AddImage(int id, AddPropertyImageRequest request, CancellationToken cancellationToken)
    {
        var property = await db.Properties
            .Include(candidate => candidate.Images)
            .FirstOrDefaultAsync(candidate => candidate.Id == id, cancellationToken)
            ?? throw new KeyNotFoundException("İlan bulunamadı.");

        EnsureOwnership(property.UserId);

        if (request.IsMainImage)
        {
            foreach (var image in property.Images)
            {
                image.IsMainImage = false;
            }
        }

        property.Images.Add(new PropertyImage
        {
            ImageUrl = request.ImageUrl.Trim(),
            IsMainImage = request.IsMainImage || property.Images.Count == 0,
            CreatedAt = DateTime.UtcNow
        });
        property.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(cancellationToken);

        var updated = await GetOwnedPropertyQuery().FirstAsync(candidate => candidate.Id == property.Id, cancellationToken);
        return Ok(updated.ToResponse());
    }

    [HttpPut("{id:int}/status")]
    public async Task<ActionResult<PropertyResponse>> UpdateStatus(int id, UpdatePropertyStatusRequest request, CancellationToken cancellationToken)
    {
        var property = await db.Properties.FirstOrDefaultAsync(candidate => candidate.Id == id, cancellationToken)
            ?? throw new KeyNotFoundException("İlan bulunamadı.");

        EnsureOwnership(property.UserId);
        property.Status = request.Status;
        property.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(cancellationToken);

        var updated = await GetOwnedPropertyQuery().FirstAsync(candidate => candidate.Id == property.Id, cancellationToken);
        return Ok(updated.ToResponse());
    }

    private IQueryable<Property> GetOwnedPropertyQuery()
    {
        var query = db.Properties
            .Include(property => property.Images)
            .Include(property => property.User)
            .AsQueryable();

        return User.IsAdmin() ? query : query.Where(property => property.UserId == User.GetUserId());
    }

    private void EnsureOwnership(int ownerUserId)
    {
        if (!User.IsAdmin() && ownerUserId != User.GetUserId())
        {
            throw new KeyNotFoundException("İlan bulunamadı.");
        }
    }

    private static void ApplyRequest(Property property, CreatePropertyRequest request)
    {
        property.Title = request.Title.Trim();
        property.Description = request.Description.Trim();
        property.ListingType = request.ListingType;
        property.PropertyType = request.PropertyType;
        property.Price = request.Price;
        property.City = request.City.Trim();
        property.District = request.District.Trim();
        property.Neighborhood = request.Neighborhood?.Trim();
        property.Address = request.Address?.Trim();
        property.SquareMeters = request.SquareMeters;
        property.RoomCount = request.RoomCount.Trim();
        property.BuildingAge = request.BuildingAge;
        property.Floor = request.Floor;
        property.TotalFloors = request.TotalFloors;
        property.HeatingType = request.HeatingType?.Trim();
        property.IsFurnished = request.IsFurnished;
        property.Dues = request.Dues;
        property.Deposit = request.Deposit;
        property.Status = request.Status;
        property.OwnerName = request.OwnerName.Trim();
        property.OwnerPhone = request.OwnerPhone.Trim();
    }
}
