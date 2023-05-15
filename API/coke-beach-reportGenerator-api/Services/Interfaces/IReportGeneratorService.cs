using coke_beach_reportGenerator_api.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace coke_beach_reportGenerator_api.Services.Interfaces
{
    public interface IReportGeneratorService
    {
        List<SampleSizeModel> CheckSampleSize(DataTable geoTable, long timePeriodId, DataTable benchmarkCompareTable, DataTable demogsTable, DataTable beveragesTable);
        List<PPTBindingData> GetPPTBindingData(string spName, DataTable geoTable, long timePeriodId, DataTable benchmarkCompareTable, DataTable demogsTable, DataTable beveragesTable);
        List<PPTBindingData> GetPPTBindingDataDummy(DataTable geoTable, long timePeriodId, DataTable benchmarkCompareTable, DataTable demogsTable, DataTable beveragesTable);
        List<ImagesList> GetImagesData(DataTable benchmarkCompareTable);
        List<PPTBindingData> GetDuumyPPTBindingData(DataTable geoTable, long timePeriodId, DataTable benchmarkCompareTable, DataTable demogsTable, DataTable beveragesTable);
    }
}
