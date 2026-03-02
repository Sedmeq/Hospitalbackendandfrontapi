using Hospital.Application.Interfaces;

namespace Hospital.API.Middleware
{
   public class TokenBlacklistMiddleware
    {
        private readonly RequestDelegate _next;
        public TokenBlacklistMiddleware(RequestDelegate next)
        {
            _next = next;
        }
        public async Task InvokeAsync(HttpContext context, ICacheService cache)
        {

            // ✅ SignalR hub request-lərini bypass et
            if (context.Request.Path.StartsWithSegments("/hubs"))
            {
                await _next(context);
                return;
            }


            var token = context.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            if (!string.IsNullOrEmpty(token) && await cache.IsTokenBlacklistedAsync(token))
            {
                context.Response.StatusCode = 401;
                await context.Response.WriteAsync("This token has been revoked.");
                return;
            }

            await _next(context);
        }
    }
}
