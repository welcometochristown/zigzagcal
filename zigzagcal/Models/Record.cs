using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace zigzagcal.Models
{
    public class Record
    {
        public string name { get; set; }
        public Dictionary<string, int> breakdown { get; set; }
        public Dictionary<string, int> weekly { get; set; }
    }
}
