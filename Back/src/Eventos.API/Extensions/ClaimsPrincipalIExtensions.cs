using System.Security.Claims;

namespace Eventos.API.Extensions
{
  public static class ClaimsPrincipalIExtensions
  {
    public static string GetUserName(this ClaimsPrincipal user)
    {
      return user.FindFirst(ClaimTypes.Name)?.Value;
    }

    public static int GetUserId(this ClaimsPrincipal user)
    {
      return int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value);
    }
  }
}