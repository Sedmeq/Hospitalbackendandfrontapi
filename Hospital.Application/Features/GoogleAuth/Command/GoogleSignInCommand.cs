using Hospital.Application.DTOs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.GoogleAuth.Command
{
    public class GoogleSignInCommand : IRequest<LoginResponce>
    {
        public string IdToken { get; set; }
    }
}
