using Microsoft.AspNetCore.Routing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HuskyRescueCore.Helpers.Routes
{
    /// <summary>
    /// Class that provides routing functionality for URLs that need to be permanently redirected to a new URL
    /// see here for more information http://www.bloggersworld.com/index.php/redirecting-old-urls-to-new-in-aspnet-mvc/
    /// </summary>
    public class LegacyUrlRoute : RouteBase
    {
        /// <summary>
        /// define a list of redirect rules
        /// </summary>
        readonly RedirectRule[] _redirectRules =
        {
            new RedirectRule("/Adoption/Huskies", string.Empty, "/Adoption", true),
            new RedirectRule("/Error", string.Empty, "/Error/FailHusky", true),
            new RedirectRule("/mp/", string.Empty, "/"),
            new RedirectRule("/mp", string.Empty, "/"),
            new RedirectRule("/RollsRoyce", string.Empty, "/"),
            new RedirectRule("/dogs.aspx", string.Empty, "/Adoption"),
            new RedirectRule("/dogs", string.Empty, "/Adoption"),
            new RedirectRule("/Donation/Donate", string.Empty, "/Donate/Donate"),
            new RedirectRule("/Donation/Donate?Length=8", string.Empty, "/Donate/Donate"),
            new RedirectRule("/Loki.aspx", string.Empty, "/", true),
            new RedirectRule("/otto.aspx", string.Empty, "/", true),
            new RedirectRule("/Phoenix.aspx", string.Empty, "/", true),
            new RedirectRule("/Randal.aspx", string.Empty, "/", true),
            new RedirectRule("/Randle.aspx", string.Empty, "/", true),
            new RedirectRule("/Raleigh.aspx", string.Empty, "/", true),
            new RedirectRule("/Volunteer.aspx", string.Empty, "/Home/Volunteer", true),
            new RedirectRule("/login.aspx", string.Empty, "/Account/Login", true),
            new RedirectRule("/adopt--foster.aspx", string.Empty, "/Adoption/Process", true),
            new RedirectRule("/data", string.Empty, "/", true),
            new RedirectRule("/data/atom", string.Empty, "/", true),
            new RedirectRule("/data/rss", string.Empty, "/", true),
            new RedirectRule("/rss", string.Empty, "/", true),
            new RedirectRule("/feed", string.Empty, "/", true),
            new RedirectRule("/help", string.Empty, "/", true),
            new RedirectRule("/events/calendar", string.Empty, "/", true),
            new RedirectRule("SGAccount", string.Empty, "/"),
            new RedirectRule("SecurityGaurd", string.Empty, "/"),
            new RedirectRule("/info/fostering", string.Empty, "/home/foster", true),
            new RedirectRule("/info/policies", string.Empty, "/home/policies", true),
            new RedirectRule("/info/aboutus", string.Empty, "/home/about", true),
            new RedirectRule("/info/contact", string.Empty, "/home/contact", true),
            new RedirectRule("/info/sponsors", string.Empty, "/home/sponsors", true),
            new RedirectRule("/info/volunteer", string.Empty, "/home/volunteer", true),
            new RedirectRule("/donation/donate", string.Empty, "/Donate/Donate", true),
            new RedirectRule("/golfregister", string.Empty, "/Golf/Register", true),
            new RedirectRule("/golfreg", string.Empty, "/Golf/Register", true),
            new RedirectRule("/GolfSponsors", string.Empty, "/Golf/Sponsors", true)

        };

        public LegacyUrlRoute(string template, string name, IInlineConstraintResolver constraintResolver, RouteValueDictionary defaults, IDictionary<string, object> constraints, RouteValueDictionary dataTokens) : 
            base(template, name, constraintResolver, defaults, constraints, dataTokens)
        {
        }

        /// <summary>
        /// Check if the active URI matches the criteria of any of the _redirectRules and if so redirect to the new URI in the given rule
        /// </summary>
        /// <param name="context">current HTTP context of the user's request</param>
        /// <returns>route information for new URI</returns>
        protected override Task OnRouteMatched(RouteContext context)
        {
            // let bots know this is a permanent redirect so they will update their index
            const string status = "301 Moved Permanently";
            const int statusCode = 301;
            var request = context.HttpContext.Request;
            var response = context.HttpContext.Response;
            // do not proceed if the active URL is null
            if (!request.Path.HasValue) return null;

            var legacyUrl = request.Path + request.Query;
            var newUrl = "";

            foreach (var rule in _redirectRules)
            {
                //if we don't have to check for a string that does not exist in the URL
                if (rule.OldUrlContainsNot.Length == 0)
                {
                    if (!rule.IsOldUrlContainsExact)
                    {
                        //this does a case insensitive comparison
                        if (legacyUrl.IndexOf(rule.OldUrlContains, 0, StringComparison.CurrentCultureIgnoreCase) >= 0)
                        {
                            newUrl = rule.NewUrl;
                        }
                    }
                    else
                    {
                        if (legacyUrl.Equals(rule.OldUrlContains, StringComparison.CurrentCultureIgnoreCase))
                        {
                            newUrl = rule.NewUrl;
                        }
                    }
                }
                else
                {
                    //if we don't have to check for a string that does not exist in the URL
                    if ((legacyUrl.IndexOf(rule.OldUrlContains, 0, StringComparison.CurrentCultureIgnoreCase) >= 0)
                        //so that it doesn't go in infinite loop since the end part of both URLs are same
                        && (!(legacyUrl.IndexOf(rule.OldUrlContainsNot, 0, StringComparison.CurrentCultureIgnoreCase) >= 0)))
                    {
                        newUrl = rule.NewUrl;
                    }
                }

                //found anything? then end loop
                if (newUrl.Length > 0)
                {
                    break;
                }

            }

            if (newUrl.Length <= 0) return null;

            response.StatusCode = statusCode;
            response.Redirect(newUrl);

            return null;
        }

        protected override VirtualPathData OnVirtualPathGenerated(VirtualPathContext context)
        {
            throw new NotImplementedException();
        }
    }

}
