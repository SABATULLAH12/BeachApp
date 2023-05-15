using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using coke_beach_reportGenerator_api.Services.Interfaces;
using coke_beach_reportGenerator_api.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Hosting;
using System.Threading;
using Azure.Storage.Blobs;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Formatters.Binary;
using System.Runtime.Serialization.Json;
using Azure.Storage.Blobs.Models;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;

namespace coke_beach_reportGenerator_api.Functions.POC
{
    public class GetGeoLeftPanel
    {
        private readonly IConfiguration _configuration;
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly ILeftPanelBusiness _leftPanelBusiness;
        private LeftPanel _leftPanelData = null;
        public GetGeoLeftPanel(ILeftPanelBusiness leftPanelBusiness, IHostingEnvironment hostingEnvironment)
        {
            _leftPanelBusiness = leftPanelBusiness;
            _hostingEnvironment = hostingEnvironment;
        }
        [FunctionName("GetGeoLeftPanel")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "GetGeoLeftPanel")] HttpRequest req,
            ILogger log)
        {
            LeftPanel leftPanel = new LeftPanel();
            log.LogInformation("Db Called");
            if (_leftPanelData == null)
            {
                _leftPanelData = _leftPanelBusiness.GetGeoLeftPanelData();
                leftPanel = _leftPanelData;
            }
            else
            {
                leftPanel = _leftPanelData;
            }
            var obj = JsonConvert.SerializeObject(leftPanel);
            return new OkObjectResult(leftPanel);
        }
        public DataConfiguration GetConfiguration()
        {
            DataConfiguration _config = new DataConfiguration();
            _config.ConnectionString = this._configuration.GetConnectionString("BeachDBConnection");
            _config.TimeOut = this._configuration.GetValue<int>("TimeOut");
            return _config;
        }
        public string LeftpanelJsonName()
        {
            return Path.Combine("json", "LeftPanel.json");
        }
        public bool CheckFileExists(string path)
        {
            return System.IO.File.Exists(path);
        }
        private static MemoryStream SerializeToStream(object o)
        {
            MemoryStream stream = new MemoryStream();
            IFormatter formatter = new BinaryFormatter();
            formatter.Serialize(stream, o);
            return stream;
        }
    }
}
