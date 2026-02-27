using Azure.Core;
using Hospital.Application.DTOs;
using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Patient.Command
{
    public class UpdatePatientCommandHandler: IRequestHandler<UpdatePatientCommand, PatientsDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileService _fileService;
        public UpdatePatientCommandHandler(IUnitOfWork unitOfWork, IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _fileService = fileService;
        }
        public async Task<PatientsDto> Handle(UpdatePatientCommand command, CancellationToken cancellationToken)
        {
            var patient = await _unitOfWork.Patients.GetByIdAsync(command.Id);
            if (patient == null)
            {
                throw new NotFoundException("Patient not found");
            }



            if (command.RemoveImage && !string.IsNullOrEmpty(patient.ImagePath))
            {
                await _fileService.DeletePatientImageAsync(patient.ImagePath);
                patient.ImagePath = null;
            }
            else if (command.Image != null)
            {
                if (!string.IsNullOrEmpty(patient.ImagePath))
                    await _fileService.DeletePatientImageAsync(patient.ImagePath);

                patient.ImagePath = await _fileService.SavePatientImageAsync(command.Image, patient.Id);
            }



            patient.ApplicationUser.FirstName = command.FirstName;
            patient.ApplicationUser.LastName = command.LastName;
            patient.ApplicationUser.Email = command.Email;
            patient.Email = command.Email;
            patient.Phone = command.Phone;
            patient.ApplicationUser.PhoneNumber = command.Phone;
            patient.Address = command.Address;
            patient.City = command.City;
            patient.Gender = command.Gender;
            patient.DateOfBirth = command.DateOfBirth;


            await _unitOfWork.SaveChangesAsync();
            return new PatientsDto
            {
                Id = patient.Id,
                FullName = $"{patient.ApplicationUser.FirstName} {patient.ApplicationUser.LastName}",
                Gender = patient.Gender,
                Email = patient.Email,
                Phone = patient.Phone,
                Address = patient.Address,
                City = patient.City,
                ImagePath = patient.ImagePath,
                DateOfBirth = patient.DateOfBirth
            };
            
        }
    }
}
