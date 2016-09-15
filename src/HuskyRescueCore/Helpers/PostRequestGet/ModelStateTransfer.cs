using Microsoft.AspNetCore.Mvc.Filters;

namespace HuskyRescueCore.Helpers.PostRequestGet
{
    //From https://andrewlock.net/post-redirect-get-using-tempdata-in-asp-net-core/
    public abstract class ModelStateTransfer : ActionFilterAttribute
    {
        protected const string Key = nameof(ModelStateTransfer);
    }
}
