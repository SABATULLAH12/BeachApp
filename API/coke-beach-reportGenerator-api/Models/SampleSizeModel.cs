using System;
using System.Collections.Generic;
using System.Text;

namespace coke_beach_reportGenerator_api.Models
{
    public class SampleSizeModel
    {
        public int SelectionID { get; set; }
        public string SelectionName { get; set; }
        public string SelectionType { get; set; }
        public int ConsumptionId { get; set; }
        public int SampleSize { get; set; }
        public string DetailedText { get; set; }
    }
}
