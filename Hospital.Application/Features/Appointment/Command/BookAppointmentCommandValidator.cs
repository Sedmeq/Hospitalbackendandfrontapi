using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Appointment.Command
{
    public class BookAppointmentCommandValidator : AbstractValidator<BookAppointmentCommand>
    {
        public BookAppointmentCommandValidator()
        {
            RuleFor(x => x.DepartmentId)
                .GreaterThan(0).WithMessage("Department is required.");

            RuleFor(x => x.DoctorId)
                .GreaterThan(0).WithMessage("Doctor is required.");

            RuleFor(x => x.Date)
                .NotEmpty().WithMessage("Date is required.")
                .Must(BeAFutureDate).WithMessage("Appointment date must be in the future.");

            RuleFor(x => x.Time)
                .NotEmpty().WithMessage("Time is required.")
                .Matches(@"^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$")
                .WithMessage("Time must be in format HH:mm (e.g., 09:00, 14:30)");

            RuleFor(x => x.PatientName)
                .NotEmpty().WithMessage("Patient name is required.")
                .MaximumLength(100).WithMessage("Patient name must not exceed 100 characters.");

            RuleFor(x => x.PatientPhone)
                .NotEmpty().WithMessage("Phone number is required.")
                .Matches(@"^\+?[1-9]\d{1,14}$").WithMessage("Invalid phone number format.");

            RuleFor(x => x.Message)
                .MaximumLength(500).WithMessage("Message must not exceed 500 characters.");
        }

        private bool BeAFutureDate(DateTime date)
        {
            return date.Date >= DateTime.Now.Date;
        }
    }
}
