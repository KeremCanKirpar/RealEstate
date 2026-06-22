namespace EstateFlow.Api.Helpers;

public class JwtSettings
{
    public string Issuer { get; set; } = "EstateFlow";

    public string Audience { get; set; } = "EstateFlow.Client";

    public string Key { get; set; } = string.Empty;

    public int ExpiresMinutes { get; set; } = 240;
}
