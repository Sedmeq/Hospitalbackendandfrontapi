using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.DoctorSchedule.Command
{
    public class CreateDoctorScheduleCommandValidator : AbstractValidator<CreateDoctorScheduleCommand>
    {
        public CreateDoctorScheduleCommandValidator()
        {
            RuleFor(x => x.DoctorId)
                .GreaterThan(0).WithMessage("Valid Doctor ID is required.");

            RuleFor(x => x.StartTime)
                .NotEmpty().WithMessage("Start time is required.")
                .Matches(@"^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$").WithMessage("Start time must be in HH:mm format.");

            RuleFor(x => x.EndTime)
                .NotEmpty().WithMessage("End time is required.")
                .Matches(@"^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$").WithMessage("End time must be in HH:mm format.");

            RuleFor(x => x.SlotDurationMinutes)
                .GreaterThan(0).WithMessage("Slot duration must be greater than 0.")
                .LessThanOrEqualTo(240).WithMessage("Slot duration cannot exceed 4 hours.");

            RuleFor(x => x)
                .Must(x => TimeSpan.Parse(x.EndTime) > TimeSpan.Parse(x.StartTime))
                .WithMessage("End time must be after start time.");
        }
    }
}
