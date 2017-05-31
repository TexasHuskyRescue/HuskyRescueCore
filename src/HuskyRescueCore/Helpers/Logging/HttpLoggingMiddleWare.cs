using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Server.Kestrel.Internal.Http;
using Serilog.Context;
using System.Threading.Tasks;

namespace HuskyRescueCore.Helpers.Logging
{
    public class HttpLoggingMiddleWare
    {
        private readonly RequestDelegate _next;

        public HttpLoggingMiddleWare(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            var remoteIp = ((Frame)((DefaultHttpContext)context).Features).ConnectionContext.RemoteEndPoint;
            using (LogContext.PushProperty("Address", remoteIp))
            using (LogContext.PushProperty("Method", ((Frame)((DefaultHttpContext)context).Features).Method))
            using (LogContext.PushProperty("HttpProtocol", context.Request.Protocol))
            using (LogContext.PushProperty("HttpPath", context.Request.Path))
            using (LogContext.PushProperty("TraceId", context.TraceIdentifier))
            using (LogContext.PushProperty("SessionId", context.Session.Id))
            using (LogContext.PushProperty("UserAgent", ((FrameRequestHeaders)((Microsoft.AspNetCore.Http.Internal.DefaultHttpRequest)((DefaultHttpContext)context).Request).Headers).HeaderUserAgent))
            using (LogContext.PushProperty("HttpResponseStatusCode", context.Response.StatusCode))
            {
                await _next.Invoke(context);
            }

            //((FrameRequestHeaders)((Microsoft.AspNetCore.Http.Internal.DefaultHttpRequest)((DefaultHttpContext)context).Request).Headers).HeaderCookie;

            //((Frame)((DefaultHttpContext)context).Features).HttpVersion;
            //((Frame)((DefaultHttpContext)context).Features).Path;
            //((Frame)((DefaultHttpContext)context).Features).QueryString;
            //((Frame)((DefaultHttpContext)context).Features).Scheme;
        }
    }
}
