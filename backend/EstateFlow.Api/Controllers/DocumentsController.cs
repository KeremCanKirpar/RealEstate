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
public class DocumentsController(ApplicationDbContext db, IWebHostEnvironment environment) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<DocumentResponse>>> GetDocuments(CancellationToken cancellationToken)
    {
        var documents = await GetOwnedDocumentQuery()
            .AsNoTracking()
            .OrderByDescending(document => document.CreatedAt)
            .ToListAsync(cancellationToken);

        return Ok(documents.Select(document => document.ToResponse()).ToList());
    }

    [HttpPost]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(20_000_000)]
    public async Task<ActionResult<DocumentResponse>> CreateDocument([FromForm] CreateDocumentRequest request, CancellationToken cancellationToken)
    {
        await EnsureRelatedEntitiesAreVisibleAsync(request.CustomerId, request.PropertyId, cancellationToken);

        var fileName = request.FileName?.Trim();
        var fileUrl = request.FileUrl?.Trim();

        if (request.File is not null)
        {
            var uploadRoot = GetDocumentUploadRoot();
            Directory.CreateDirectory(uploadRoot);

            var originalName = Path.GetFileName(request.File.FileName);
            var storedName = $"{Guid.NewGuid():N}_{originalName}";
            var absolutePath = Path.Combine(uploadRoot, storedName);

            await using var stream = System.IO.File.Create(absolutePath);
            await request.File.CopyToAsync(stream, cancellationToken);

            fileName = string.IsNullOrWhiteSpace(fileName) ? originalName : fileName;
            fileUrl = $"/uploads/documents/{storedName}";
        }

        if (string.IsNullOrWhiteSpace(fileName) || string.IsNullOrWhiteSpace(fileUrl))
        {
            throw new InvalidOperationException("Dosya yükleme veya dosya adıyla birlikte dosya URL'si gerekli.");
        }

        var document = new Document
        {
            FileName = fileName,
            FileUrl = fileUrl,
            DocumentType = request.DocumentType,
            PropertyId = request.PropertyId,
            CustomerId = request.CustomerId,
            CreatedAt = DateTime.UtcNow,
            UserId = User.GetUserId()
        };

        db.Documents.Add(document);
        await db.SaveChangesAsync(cancellationToken);

        var created = await GetOwnedDocumentQuery().FirstAsync(candidate => candidate.Id == document.Id, cancellationToken);
        return Created($"/api/documents/{document.Id}", created.ToResponse());
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteDocument(int id, CancellationToken cancellationToken)
    {
        var document = await db.Documents.FirstOrDefaultAsync(candidate => candidate.Id == id, cancellationToken)
            ?? throw new KeyNotFoundException("Doküman bulunamadı.");

        EnsureOwnership(document.UserId);
        DeleteLocalFileIfOwned(document.FileUrl);
        db.Documents.Remove(document);
        await db.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    private IQueryable<Document> GetOwnedDocumentQuery()
    {
        var query = db.Documents
            .Include(document => document.User)
            .Include(document => document.Customer)
            .Include(document => document.Property)
            .AsQueryable();

        return User.IsAdmin() ? query : query.Where(document => document.UserId == User.GetUserId());
    }

    private void EnsureOwnership(int ownerUserId)
    {
        if (!User.IsAdmin() && ownerUserId != User.GetUserId())
        {
            throw new KeyNotFoundException("Doküman bulunamadı.");
        }
    }

    private async Task EnsureRelatedEntitiesAreVisibleAsync(int? customerId, int? propertyId, CancellationToken cancellationToken)
    {
        if (customerId is not null)
        {
            var customer = await db.Customers.AsNoTracking().FirstOrDefaultAsync(candidate => candidate.Id == customerId, cancellationToken)
                ?? throw new InvalidOperationException("Seçilen müşteri mevcut değil.");

            if (!User.IsAdmin() && customer.UserId != User.GetUserId())
            {
                throw new InvalidOperationException("Seçilen müşteri bu danışman için erişilebilir değil.");
            }
        }

        if (propertyId is not null)
        {
            var property = await db.Properties.AsNoTracking().FirstOrDefaultAsync(candidate => candidate.Id == propertyId, cancellationToken)
                ?? throw new InvalidOperationException("Seçilen ilan mevcut değil.");

            if (!User.IsAdmin() && property.UserId != User.GetUserId())
            {
                throw new InvalidOperationException("Seçilen ilan bu danışman için erişilebilir değil.");
            }
        }
    }

    private string GetDocumentUploadRoot()
    {
        var webRoot = environment.WebRootPath;
        if (string.IsNullOrWhiteSpace(webRoot))
        {
            webRoot = Path.Combine(environment.ContentRootPath, "wwwroot");
        }

        return Path.Combine(webRoot, "uploads", "documents");
    }

    private void DeleteLocalFileIfOwned(string fileUrl)
    {
        if (!fileUrl.StartsWith("/uploads/documents/", StringComparison.OrdinalIgnoreCase))
        {
            return;
        }

        var fileName = Path.GetFileName(fileUrl);
        var path = Path.Combine(GetDocumentUploadRoot(), fileName);
        if (System.IO.File.Exists(path))
        {
            System.IO.File.Delete(path);
        }
    }
}
