using EstateFlow.Api.Entities;

namespace EstateFlow.Api.Services;

public interface IJwtTokenService
{
    (string Token, DateTime ExpiresAt) CreateToken(User user);
}
