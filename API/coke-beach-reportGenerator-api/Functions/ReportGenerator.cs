using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using coke_beach_reportGenerator_api.Models.LeftPanelModel;
using coke_beach_reportGenerator_api.Helper;
using coke_beach_reportGenerator_api.Services.Interfaces;
using System.Collections.Generic;
using System.Threading;

namespace coke_beach_reportGenerator_api.Functions
{
    public class ReportGenerator
    {
        private readonly IReportGeneratorBusiness _reportGeneratorBusiness;
        private static Dictionary<Guid, PPTResponse> runningTasks = new Dictionary<Guid, PPTResponse>();
        public ReportGenerator(IReportGeneratorBusiness reportGeneratorBusiness)
        {
            _reportGeneratorBusiness = reportGeneratorBusiness;
        }

        [FunctionName("ReportGenerator")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "ReportGenerator")] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            Guid id = Guid.NewGuid();  //Generate tracking Id

            PPTResponse response = new PPTResponse() { isCompleted = false, isError = false };

            response.id = id;

            runningTasks.Add(id, response);  //Job isn't done yet

            var data = await req.GetBodyAsync<LeftPanelRequest>();

            new Thread(() => DownloadPPT(data.Value, id, log)).Start();

            return new OkObjectResult(response);
        }

        public void DownloadPPT(LeftPanelRequest data, Guid id, ILogger log)
        {
            MemoryStream ms = null;
            try
            {
                ms = _reportGeneratorBusiness.FormatData(data);
                byte[] bytes = ms.ToArray();
                ms.Dispose();

                runningTasks[id].isCompleted = true;
                runningTasks[id].data = bytes;
            }
            catch (Exception e)
            {
                runningTasks[id].isError = true;
            }
        }

        [FunctionName("PollStatus")]
        public async Task<IActionResult> Run1([HttpTrigger(AuthorizationLevel.Function, "post", Route = "PollStatus")] HttpRequest req,
            ILogger log)
        {
            var res = (await req.GetBodyAsync<PPTResponse>()).Value;
            var id = res.id;
            PPTResponse response = new PPTResponse();

            //If the job is completed
            if (runningTasks.ContainsKey(id) && (runningTasks[id].isCompleted || runningTasks[id].isError))
            {
                response.isCompleted = runningTasks[id].isCompleted;
                response.errorMessage = runningTasks[id].isError ? "Some error Occurred" : "";
                response.isError = runningTasks[id].isError;
                response.id = id;
                if (runningTasks[id].isError)
                {
                    runningTasks.Remove(runningTasks[id].id);
                }
                return new OkObjectResult(response);
            }

            //If the job is still running
            else if (runningTasks.ContainsKey(id))
            {
                response.isCompleted = false;
                response.errorMessage = "";
                response.isError = false;
                response.id = id;
                return new OkObjectResult(response);
            }
            else
            {
                response.isCompleted = false;
                response.errorMessage = "Job doesnot exist";
                response.isError = true;
                //runningTasks.Remove(id);
                return new OkObjectResult(response);
            }
        }

        [FunctionName("Download")]
        public async Task<IActionResult> Run2([HttpTrigger(AuthorizationLevel.Function, "post", Route = "Download")] HttpRequest req,
            ILogger log)
        {
            var res = (await req.GetBodyAsync<PPTResponse>()).Value;
            var id = res.id;

            byte[] bytes = runningTasks[id].data;
            runningTasks.Remove(id);
            return new FileContentResult(bytes, "application/vnd.openxmlformats-officedocument.presentationml.presentation")
            {
                FileDownloadName = "Output.pptx"
            };
        }
    }
}
