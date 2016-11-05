//using Contentful.NET;
using Elmah.Io.AspNetCore;
using HuskyRescueCore.Data;
using HuskyRescueCore.Models;
using HuskyRescueCore.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PaulMiami.AspNetCore.Mvc.Recaptcha;
using Serilog;
using Serilog.Events;
using System;
using System.Linq;

namespace HuskyRescueCore
{
    public class Startup
    {
        private IHostingEnvironment CurrentEnvironment { get; set; }

        private string contentDeliveryApi = "1500acf09a4cde7de8884b0027b6f20a99200f97b2096259e9c0d39f554ab821";
        private string spaceId = "jf2qd27ic77e";

        // https://docs.asp.net/en/dev/fundamentals/startup.html
        public Startup(IHostingEnvironment env)
        {
            Log.Logger = new LoggerConfiguration()
              .Enrich.FromLogContext()
              //.Enrich.WithMachineName()
              //.Enrich.WithEnvironmentUserName()
              //.WriteTo.RollingFile(env.WebRootPath + @"\App_Data\logs\") //, shared: true) // file share not supported on platform - error when using this in dev
              .WriteTo.RollingFile("log-{Date}.txt", LogEventLevel.Debug)
              .CreateLogger();


            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true);

            if (env.IsDevelopment())
            {
                // For more details on using the user secret store see http://go.microsoft.com/fwlink/?LinkID=532709
                //builder.AddUserSecrets();

                // This will push telemetry data through Application Insights pipeline faster, allowing you to view results immediately.
                builder.AddApplicationInsightsSettings(developerMode: true);
            }

            CurrentEnvironment = env;

            builder.AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add framework services.
            services.AddApplicationInsightsTelemetry(Configuration);

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddSingleton<IConfiguration>(c => { return Configuration; });

            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"))
                                    .ConfigureWarnings(warnings => warnings.Throw(RelationalEventId.QueryClientEvaluationWarning)));

            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            services.AddDistributedMemoryCache();
            services.AddSession();
            services.AddMemoryCache();
            services.AddMvc();

            // Add application services.
            services.AddTransient<IEmailSender, AuthMessageSender>();
            services.AddTransient<ISmsSender, AuthMessageSender>();
            //services.AddSingleton<ISystemSettingsCache, SystemSettingsCache>();
            services.AddTransient<ISystemSettingService, SystemSettingServices>();
            services.AddTransient<IBraintreePaymentService, BraintreePaymentService>();
            services.AddTransient<IRescueGroupsService, RescueGroupsService>();
            services.AddTransient<IFormSerivce, FormService>();
            services.AddTransient<IStorageService, StorageService>();

            //services.AddTransient<IContentfulClient, ContentfulClient>(t => new ContentfulClient(contentDeliveryApi, spaceId));

            // TODO: figure out why azure will not ready the configuration for recaptha
            if (CurrentEnvironment.EnvironmentName == "Development")
            {
                services.AddRecaptcha(new RecaptchaOptions
                {
                    SiteKey = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
                    SecretKey = "6LeIxAcTAAAAAGG - vFI1TnRWxMZNFuojJ4WifJWe",
                    ValidationMessage = "Are you a robot?"
                });
            }
            else if (CurrentEnvironment.EnvironmentName == "Staging")
            {
                services.AddRecaptcha(new RecaptchaOptions
                {
                    SiteKey = "6Lds7wYUAAAAAEusAuIXHHf6QY5Uom0ITJvCRB1i",
                    SecretKey = "6Lds7wYUAAAAAG6mLLJzwyCyDtMMsn4hdW3RktMx",
                    ValidationMessage = "Are you a robot?"
                });
            }
            else if (CurrentEnvironment.EnvironmentName == "Production")
            {
                services.AddRecaptcha(new RecaptchaOptions
                {
                    SiteKey = "6LdZlt8SAAAAAFNr2_gJ-E-jB57p8J3FxCiputxE",
                    SecretKey = "6LdZlt8SAAAAAFzt3c8ofJfCTcgmw5_mOtkBi3iC",
                    ValidationMessage = "Are you a robot?"
                });

            }
            //services.AddSingleton<IConfigureOptions<RecaptchaOptions>, ConfigureRecaptchaOptions>();
            //services.AddRecaptcha(new RecaptchaOptions
            //{
            //    SiteKey = Configuration["recaptcha:PublicKey"],
            //    SecretKey = Configuration["recaptcha:PrivateKey"],
            //    ValidationMessage = "Are you a robot?"
            //});

            //http://bootstrap3mvc6.azurewebsites.net/Home/Installation
            //services.AddTransient(typeof(BootstrapMvc.Mvc6.BootstrapHelper<>));
            services.AddTransient(typeof(HuskyRescueCore.TagHelpers.CheckboxTagHelper));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory, IApplicationLifetime appLifetime)
        {
            // https://docs.asp.net/en/dev/fundamentals/logging.html
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();
            loggerFactory.AddSerilog();
            // Ensure any buffered events are sent at shutdown
            appLifetime.ApplicationStopped.Register(Log.CloseAndFlush);

            var elmahConfig = Configuration.GetSection("ElmahIO");
            app.UseElmahIo(elmahConfig.GetValue<string>("ApiKey"), new Guid(elmahConfig.GetValue<string>("LogId")));

            app.UseApplicationInsightsRequestTelemetry();

            var customConfig = Configuration.GetSection("custom");
            var useDevErrorPages = elmahConfig.GetValue<bool>("UseDevErrorPages");


            var sslPort = 0;
            if (env.IsDevelopment())
            {
                if (useDevErrorPages)
                {
                    app.UseDeveloperExceptionPage();
                    app.UseDatabaseErrorPage();
                    app.UseBrowserLink();
                }

                var builder = new ConfigurationBuilder()
                    .SetBasePath(env.ContentRootPath)
                    .AddJsonFile(@"Properties/launchSettings.json", optional: false, reloadOnChange: true);
                var launchConfig = builder.Build();
                sslPort = launchConfig.GetValue<int>("iisSettings:iisExpress:sslPort");
            }
            else if (env.IsStaging())
            {
                if (useDevErrorPages)
                {
                    app.UseDeveloperExceptionPage();
                    app.UseDatabaseErrorPage();
                }
            }
            else
            {
                if (useDevErrorPages)
                {
                    app.UseDeveloperExceptionPage();
                    app.UseDatabaseErrorPage();
                }
                else
                {
                    app.UseExceptionHandler("/Home/Error");
                }
            }

            app.Use(async (context, next) =>
            {
                if (context.Request.IsHttps)
                {
                    await next();
                }
                else
                {
                    var httpsFormat = "https://{0}{1}{2}";
                    var httpsUrl = string.Format(httpsFormat, context.Request.Host.Host,
                        sslPort == 0 || sslPort == 443 ? string.Empty : string.Format(":{0}", sslPort), context.Request.Path);
                    context.Response.Redirect(httpsUrl);
                }
            });

            app.UseApplicationInsightsExceptionTelemetry();

            app.UseStaticFiles();

            app.UseIdentity();

            app.UseSession();

            // Add external authentication middleware below. To configure them please see http://go.microsoft.com/fwlink/?LinkID=532715

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "areaRoute",
                    template: "{area:exists}/{controller=Home}/{action=Index}");

                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
            
            // Seed initial data as necessary
            SeedData.Initialize(app.ApplicationServices);
        }
    }

    // http://andrewlock.net/access-services-inside-options-and-startup-using-configureoptions/
    public class ConfigureRecaptchaOptions : IConfigureOptions<RecaptchaOptions>
    {
        private readonly IServiceScopeFactory _serviceScopeFactory;
        public ConfigureRecaptchaOptions(IServiceScopeFactory serivceScopeFactory)
        {
            _serviceScopeFactory = serivceScopeFactory;
        }

        public void Configure(RecaptchaOptions options)
        {
            using (var scope = _serviceScopeFactory.CreateScope())
            {
                var provider = scope.ServiceProvider;
                using (var dbContext = provider.GetRequiredService<ApplicationDbContext>())
                {
                    options.SiteKey = dbContext.SystemSetting.First(p => p.Id == "RecaptchaPublicKey").Value;
                    options.SecretKey = dbContext.SystemSetting.First(p => p.Id == "RecaptchaPrivateKey").Value;
                    options.ValidationMessage = "Are you a robot?";
                }
            }
        }
    }
}
