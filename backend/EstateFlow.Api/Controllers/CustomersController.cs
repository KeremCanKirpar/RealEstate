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
public class CustomersController(ApplicationDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedResult<CustomerResponse>>> GetCustomers(
        [FromQuery] CustomerQueryParameters queryParameters,
        CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        var query = db.Customers
            .AsNoTracking()
            .Include(customer => customer.User)
            .Include(customer => customer.CustomerNotes)
            .ThenInclude(note => note.User)
            .AsQueryable();

        if (!User.IsAdmin())
        {
            query = query.Where(customer => customer.UserId == userId);
        }

        if (!string.IsNullOrWhiteSpace(queryParameters.Search))
        {
            var search = $"%{queryParameters.Search.Trim()}%";
            query = query.Where(customer =>
                EF.Functions.Like(customer.FullName, search) ||
                EF.Functions.Like(customer.Phone, search) ||
                (customer.Email != null && EF.Functions.Like(customer.Email, search)) ||
                (customer.DesiredCity != null && EF.Functions.Like(customer.DesiredCity, search)) ||
                (customer.DesiredDistrict != null && EF.Functions.Like(customer.DesiredDistrict, search)));
        }

        if (queryParameters.CustomerType is not null)
        {
            query = query.Where(customer => customer.CustomerType == queryParameters.CustomerType);
        }

        if (queryParameters.Status is not null)
        {
            query = query.Where(customer => customer.Status == queryParameters.Status);
        }

        if (string.Equals(queryParameters.Source, "web", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(customer => customer.Notes != null && customer.Notes.Contains("Kaynak: Web sitesi talebi"));
        }

        query = query.OrderByDescending(customer => customer.CreatedAt);
        var pageNumber = Math.Max(1, queryParameters.PageNumber);
        var pageSize = Math.Clamp(queryParameters.PageSize, 1, 100);
        var totalCount = await query.CountAsync(cancellationToken);
        var customers = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return Ok(new PagedResult<CustomerResponse>(
            customers.Select(customer => customer.ToResponse()).ToList(),
            pageNumber,
            pageSize,
            totalCount));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CustomerResponse>> GetCustomer(int id, CancellationToken cancellationToken)
    {
        var customer = await GetOwnedCustomerQuery().FirstOrDefaultAsync(candidate => candidate.Id == id, cancellationToken)
            ?? throw new KeyNotFoundException("Müşteri bulunamadı.");

        return Ok(customer.ToResponse());
    }

    [HttpPost]
    public async Task<ActionResult<CustomerResponse>> CreateCustomer(CreateCustomerRequest request, CancellationToken cancellationToken)
    {
        var customer = new Customer
        {
            UserId = User.GetUserId(),
            CreatedAt = DateTime.UtcNow
        };

        ApplyRequest(customer, request);
        db.Customers.Add(customer);
        await db.SaveChangesAsync(cancellationToken);

        var created = await GetOwnedCustomerQuery().FirstAsync(candidate => candidate.Id == customer.Id, cancellationToken);
        return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id }, created.ToResponse());
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<CustomerResponse>> UpdateCustomer(int id, UpdateCustomerRequest request, CancellationToken cancellationToken)
    {
        var customer = await db.Customers.FirstOrDefaultAsync(candidate => candidate.Id == id, cancellationToken)
            ?? throw new KeyNotFoundException("Müşteri bulunamadı.");

        EnsureOwnership(customer.UserId);
        ApplyRequest(customer, request);
        await db.SaveChangesAsync(cancellationToken);

        var updated = await GetOwnedCustomerQuery().FirstAsync(candidate => candidate.Id == customer.Id, cancellationToken);
        return Ok(updated.ToResponse());
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteCustomer(int id, CancellationToken cancellationToken)
    {
        var customer = await db.Customers.FirstOrDefaultAsync(candidate => candidate.Id == id, cancellationToken)
            ?? throw new KeyNotFoundException("Müşteri bulunamadı.");

        EnsureOwnership(customer.UserId);
        db.Customers.Remove(customer);
        await db.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    [HttpPost("{id:int}/notes")]
    public async Task<ActionResult<CustomerResponse>> AddNote(int id, AddCustomerNoteRequest request, CancellationToken cancellationToken)
    {
        var customer = await db.Customers.FirstOrDefaultAsync(candidate => candidate.Id == id, cancellationToken)
            ?? throw new KeyNotFoundException("Müşteri bulunamadı.");

        EnsureOwnership(customer.UserId);
        db.CustomerNotes.Add(new CustomerNote
        {
            CustomerId = customer.Id,
            Note = request.Note.Trim(),
            UserId = User.GetUserId(),
            CreatedAt = DateTime.UtcNow
        });

        await db.SaveChangesAsync(cancellationToken);

        var updated = await GetOwnedCustomerQuery().FirstAsync(candidate => candidate.Id == customer.Id, cancellationToken);
        return Ok(updated.ToResponse());
    }

    [HttpGet("{id:int}/matched-properties")]
    public async Task<ActionResult<IReadOnlyList<PropertyResponse>>> GetMatchedProperties(int id, CancellationToken cancellationToken)
    {
        var customer = await db.Customers.AsNoTracking().FirstOrDefaultAsync(candidate => candidate.Id == id, cancellationToken)
            ?? throw new KeyNotFoundException("Müşteri bulunamadı.");

        EnsureOwnership(customer.UserId);

        var query = db.Properties
            .AsNoTracking()
            .Include(property => property.Images)
            .Include(property => property.User)
            .Where(property => property.Status == PropertyStatus.Active)
            .AsQueryable();

        if (!User.IsAdmin())
        {
            query = query.Where(property => property.UserId == User.GetUserId());
        }

        if (customer.DesiredPropertyType is not null)
        {
            query = query.Where(property => property.PropertyType == customer.DesiredPropertyType);
        }

        if (!string.IsNullOrWhiteSpace(customer.DesiredCity))
        {
            query = query.Where(property => property.City == customer.DesiredCity);
        }

        if (!string.IsNullOrWhiteSpace(customer.DesiredDistrict))
        {
            query = query.Where(property => property.District == customer.DesiredDistrict);
        }

        if (customer.BudgetMin is not null)
        {
            query = query.Where(property => property.Price >= customer.BudgetMin);
        }

        if (customer.BudgetMax is not null)
        {
            query = query.Where(property => property.Price <= customer.BudgetMax);
        }

        var matches = await query.OrderByDescending(property => property.CreatedAt).Take(6).ToListAsync(cancellationToken);
        return Ok(matches.Select(property => property.ToResponse()).ToList());
    }

    private IQueryable<Customer> GetOwnedCustomerQuery()
    {
        var query = db.Customers
            .Include(customer => customer.User)
            .Include(customer => customer.CustomerNotes)
            .ThenInclude(note => note.User)
            .AsQueryable();

        return User.IsAdmin() ? query : query.Where(customer => customer.UserId == User.GetUserId());
    }

    private void EnsureOwnership(int ownerUserId)
    {
        if (!User.IsAdmin() && ownerUserId != User.GetUserId())
        {
            throw new KeyNotFoundException("Müşteri bulunamadı.");
        }
    }

    private static void ApplyRequest(Customer customer, CreateCustomerRequest request)
    {
        customer.FullName = request.FullName.Trim();
        customer.Phone = request.Phone.Trim();
        customer.Email = request.Email?.Trim();
        customer.CustomerType = request.CustomerType;
        customer.BudgetMin = request.BudgetMin;
        customer.BudgetMax = request.BudgetMax;
        customer.DesiredPropertyType = request.DesiredPropertyType;
        customer.DesiredCity = request.DesiredCity?.Trim();
        customer.DesiredDistrict = request.DesiredDistrict?.Trim();
        customer.Notes = request.Notes?.Trim();
        customer.Status = request.Status;
    }
}
