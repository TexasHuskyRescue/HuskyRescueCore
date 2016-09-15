using System.Collections.Generic;

namespace HuskyRescueCore.Helpers.PostRequestGet
{
    // From https://andrewlock.net/post-redirect-get-using-tempdata-in-asp-net-core/
    public class ModelStateTransferValue
    {
        // Form field name
        public string Key { get; set; }
        // Form field value
        public string AttemptedValue { get; set; }
        public object RawValue { get; set; }
        // validation error messages associated with the field
        public ICollection<string> ErrorMessages { get; set; } = new List<string>();
    }
}
