using EstateFlow.Api.DTOs;
using EstateFlow.Api.Helpers;
using EstateFlow.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EstateFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request, CancellationToken cancellationToken)
    {
        var allowAdminRole = User.Identity?.IsAuthenticated == true && User.IsAdmin();
        var response = await authService.RegisterAsync(request, allowAdminRole, cancellationToken);
        return Created("/api/auth/me", response);
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request, CancellationToken cancellationToken)
    {
        return Ok(await authService.LoginAsync(request, cancellationToken));
    }

    [HttpGet("me")]
    [Authorize(Policy = "PanelUsers")]
    public async Task<ActionResult<UserResponse>> Me(CancellationToken cancellationToken)
    {
        return Ok(await authService.GetCurrentUserAsync(User.GetUserId(), cancellationToken));
    }
}
