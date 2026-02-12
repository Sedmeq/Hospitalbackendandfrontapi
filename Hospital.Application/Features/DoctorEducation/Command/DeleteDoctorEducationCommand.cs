using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.DoctorEducation.Command
{
    public class DeleteDoctorEducationCommand : IRequest<bool>
    {
        public int Id { get; set; }
    }
}
