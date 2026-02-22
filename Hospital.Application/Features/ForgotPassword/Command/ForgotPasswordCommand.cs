using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.ForgotPassword.Command
{
    public class ForgotPasswordCommand : IRequest<bool>
    {
        public string Email { get; set; }
    }
}
