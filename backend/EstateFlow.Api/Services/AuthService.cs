using EstateFlow.Api.Data;
using EstateFlow.Api.DTOs;
using EstateFlow.Api.Entities;
using EstateFlow.Api.Helpers;
using Microsoft.EntityFrameworkCore;

namespace EstateFlow.Api.Services;

public class AuthService(ApplicationDbContext db, IJwtTokenService jwtTokenService) : IAuthService
{
    public async Task<AuthResponse> RegisterAsync(RegisterRequest request, bool allowAdminRole = false, CancellationToken cancellationToken = default)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var emailExists = await db.Users.AnyAsync(user => user.Email == normalizedEmail, cancellationToken);
        if (emailExists)
        {
            throw new InvalidOperationException("Bu e-posta adresi zaten kayıtlı.");
        }

        var role = allowAdminRole && request.Role == UserRole.Admin ? UserRole.Admin : UserRole.Consultant;
        var user = new User
        {
            FullName = request.FullName.Trim(),
            Email = normalizedEmail,
            PasswordHash = PasswordHasher.HashPassword(request.Password),
            Role = role,
            CreatedAt = DateTime.UtcNow
        };

        db.Users.Add(user);
        await db.SaveChangesAsync(cancellationToken);

        return CreateAuthResponse(user);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var user = await db.Users.FirstOrDefaultAsync(candidate => candidate.Email == normalizedEmail, cancellationToken);
        if (user is null || !PasswordHasher.VerifyPassword(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("E-posta veya şifre hatalı.");
        }

        return CreateAuthResponse(user);
    }

    public async Task<UserResponse> GetCurrentUserAsync(int userId, CancellationToken cancellationToken = default)
    {
        var user = await db.Users.AsNoTracking().FirstOrDefaultAsync(candidate => candidate.Id == userId, cancellationToken)
            ?? throw new KeyNotFoundException("Kullanıcı bulunamadı.");

        return user.ToResponse();
    }

    private AuthResponse CreateAuthResponse(User user)
    {
        var token = jwtTokenService.CreateToken(user);
        return new AuthResponse(token.Token, token.ExpiresAt, user.ToResponse());
    }
}
