using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using zigzagcal.Models;

namespace zigzagcal.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RecordController : ControllerBase
    {
        private readonly ILogger<RecordController> _logger;

        public RecordController(ILogger<RecordController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<Record> Get()
        {
            return new[] {
                new Record
                {
                    name = "chris",
                    breakdown = new Dictionary<string, int>()
                    {
                        { "0", 10 },
                        { "1", 20 },
                        { "2", 30 },
                        { "3", 0 },
                        { "4", 0 },
                        { "5", 0 },
                        { "6", 0 }
                    },
                    weekly = new Dictionary<string, int>()
                    {
                        { "monday",1 },
                        { "tuesday", 2 },
                        { "wednesday", 3 },
                        { "thursday", 0 },
                        { "friday", 0 },
                        { "saturday", 0 },
                        { "sunday", 0 }
                    }
                }
            };
        }
    }
}
