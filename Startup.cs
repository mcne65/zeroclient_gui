using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;

using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace SmartChain.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        public static ConfigFileReader config = new ConfigFileReader();

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, IApplicationLifetime applicationLifetime)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true,
                    ReactHotModuleReplacement = true
                });
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }
            TelemetryConfiguration.Active.DisableTelemetry = true;
            app.UseStaticFiles();
            app.UseCors("MyPolicy");
            // if we are using SSL, make sure we redirect all requests to our SSL port
            // see program.CS for more info and comments
            if (bool.Parse(config.lookup("sslRedirection")))
            {
                app.UseHttpsRedirection();
                Console.WriteLine("Use SSL Redirection enabled!");
            }
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                   name: "default",
                   template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapRoute(
                    name: "ActionApi",
                    template: "api/{controller}/{action}/{id}");
                routes.MapRoute(
                  name: "Api",
                  template: "api/{controller}/{action}");

                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Home", action = "Index" });
            });

            app.UseHsts();
            app.UseStaticFiles();
            //applicationLifetime.ApplicationStopping.Register(OnShutdown);
        }

       
    }
}