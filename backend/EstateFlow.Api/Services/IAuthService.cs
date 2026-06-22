using EstateFlow.Api.DTOs;

namespace EstateFlow.Api.Services;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request, bool allowAdminRole = false, CancellationToken cancellationToken = default);
    Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
    Task<UserResponse> GetCurrentUserAsync(int userId, CancellationToken cancellationToken = default);
}
