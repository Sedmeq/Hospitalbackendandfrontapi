using Hospital.Application.DTOs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Slider.Command
{
    public class DeleteSliderCommand : IRequest<SliderDto>
    {
        public int Id { get; set; }
    }
}
