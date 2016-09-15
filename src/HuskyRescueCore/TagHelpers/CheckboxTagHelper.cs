using System.Text;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using System.Threading.Tasks;
using System.Collections;
using System;

/*
Usage:
<helper-checkbox-for id="Name" value="@Model.Name" label="Name:" placeholder="Enter your name.">
</helper-checkbox-for>
*/

namespace HuskyRescueCore.TagHelpers
{
    [HtmlTargetElement("checkbox-bootstrap", Attributes = ForAttributeName)]
    public class CheckboxTagHelper : TagHelper
    {
        private const string ForAttributeName = "asp-for";

        [HtmlAttributeNotBound]
        [ViewContext]
        public ViewContext ViewContext { get; set; }

        [HtmlAttributeNotBound]
        protected IHtmlGenerator Generator { get; }

        [HtmlAttributeName(ForAttributeName)]
        public ModelExpression For { get; set; }

        public override Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }

            if (output == null)
            {
                throw new ArgumentNullException(nameof(output));
            }

            var name = For.Name;
            var properties = For.ModelExplorer.GetExplorerForProperty(name).Properties;
            var fullName = ViewContext.ViewData.TemplateInfo.GetFullHtmlFieldName(name);
            var model = For.Model as IEnumerable;
            output.TagName = string.Empty;
            var stringBuilder = new StringBuilder();

            var labelTagBuilder = Generator.GenerateLabel(
                ViewContext,
                For.ModelExplorer,
                For.Name,
                labelText: null,
                htmlAttributes: null);

            var checkboxTagBuilder = Generator.GenerateCheckBox(
                ViewContext,
                For.ModelExplorer,
                For.Name,
                isChecked: null,
                htmlAttributes: null);

            var checkboxHiddenTagBuilder = Generator.GenerateHiddenForCheckbox(
               ViewContext,
               For.ModelExplorer,
               For.Name);

            if (labelTagBuilder != null)
            {

            }



            return base.ProcessAsync(context, output);
        }
    }


}