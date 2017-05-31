using HuskyRescueCore.Helpers.Logging;
using Microsoft.AspNetCore.Builder;

namespace HuskyRescueCore.Helpers
{
    public static class MiddlewareExtensions
    {
        public static IApplicationBuilder UseHttpLoggingMiddleWare(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<HttpLoggingMiddleWare>();
        }
    }
}
