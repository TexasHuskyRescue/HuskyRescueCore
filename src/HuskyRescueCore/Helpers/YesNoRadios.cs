using System.Collections.Generic;

namespace HuskyRescueCore.Helpers
{
    public class YesNoRadios
    {
        public string Id { set; get; }
        public string Text { set; get; }

        public static List<YesNoRadios> List()
        {
            var list = new List<YesNoRadios>
                {
                    new YesNoRadios {Id = "true", Text = "Yes"},
                    new YesNoRadios {Id = "false", Text = "No"},
                };
            return list;
        }
    }
}
