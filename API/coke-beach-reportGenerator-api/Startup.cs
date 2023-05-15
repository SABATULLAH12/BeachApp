using coke_beach_reportGenerator_api.Services;
using coke_beach_reportGenerator_api.Services.Interfaces;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;

[assembly: FunctionsStartup(typeof(coke_beach_reportGenerator_api.Startup))]

namespace coke_beach_reportGenerator_api
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddScoped<IReportGeneratorBusiness, ReportGeneratorBusiness>();
            builder.Services.AddScoped<IReportGeneratorService, ReportGeneratorService>();
            builder.Services.AddScoped<ILeftPanelBusiness, LeftPanelBusiness>();
            builder.Services.AddScoped<ILeftPanelService, LeftPanelService>();
            builder.Services.AddScoped<IUserManagementBusiness, UserManagementBusiness>();
            builder.Services.AddScoped<IUserManagementService, UserManagementService>();
        }
    }
}