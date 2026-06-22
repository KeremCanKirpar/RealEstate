using System.Security.Claims;
using EstateFlow.Api.Entities;

namespace EstateFlow.Api.Helpers;

public static class UserClaimsExtensions
{
    public static int GetUserId(this ClaimsPrincipal user)
    {
        var value = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(value, out var userId))
        {
            throw new UnauthorizedAccessException("Geçersiz veya eksik kullanıcı oturumu.");
        }

        return userId;
    }

    public static bool IsAdmin(this ClaimsPrincipal user)
    {
        return user.IsInRole(UserRole.Admin.ToString());
    }
}
