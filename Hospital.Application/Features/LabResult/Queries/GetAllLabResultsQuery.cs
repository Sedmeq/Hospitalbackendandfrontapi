using Hospital.Application.DTOs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.LabResult.Queries
{
    public class GetAllLabResultsQuery : IRequest<IEnumerable<LabResultDto>> { }
}
