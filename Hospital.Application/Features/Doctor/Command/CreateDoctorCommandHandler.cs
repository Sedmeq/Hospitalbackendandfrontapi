using MediatR;
using Hospital.Domain.Entities;
using Hospital.Application.Interfaces;
using Microsoft.AspNetCore.Identity;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Hospital.Application.Features.Departments.Queries;
using Hospital.Application.Exceptions;


namespace Hospital.Application.Features.Doctor.Command
{
    public class CreateDoctorCommandHandler : IRequestHandler<CreateDoctorCommand, int>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileService _fileService;

        public CreateDoctorCommandHandler(UserManager<ApplicationUser> userManager, IUnitOfWork unitOfWork, IFileService fileService)
        {
            _userManager = userManager;
            _unitOfWork = unitOfWork;
            _fileService = fileService;
        }

        public async Task<int> Handle(CreateDoctorCommand request, CancellationToken cancellationToken)
        {
           
            var newUser = new ApplicationUser
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                UserName = request.Email,
                Email = request.Email,
               PhoneNumber=request.Phone,
               EmailConfirmed= true

            };
            var newDoctorProfile = new Domain.Entities.Doctor
            {
                Specialty = request.Specialty,
                Phone = request.Phone,
                Email = request.Email,
                DepartmentId = request.DepartmentId,
                ApplicationUserId = newUser.Id,
                    Biography = request.Biography

            };
            var department = await _unitOfWork.Departments.GetByIdAsync(request.DepartmentId);
            if (department == null)
            {
                throw new NotFoundException("the department not found ");
            }
            var identityResult = await _userManager.CreateAsync(newUser, request.Password);

            if (!identityResult.Succeeded)
            {

                throw new InvalidOperationException("Failed to create user. " + string.Join(", ", identityResult.Errors.Select(e => e.Description)));
            }

            // assign Doctor Role ;)
            
            await _userManager.AddToRoleAsync(newUser, "Doctor");

            await _unitOfWork.Doctors.AddAsync(newDoctorProfile);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            //Photo Upload

            if (request.Image != null)
            {
                var imagePath = await _fileService.SaveDoctorImageAsync(request.Image, newDoctorProfile.Id);
                newDoctorProfile.ImagePath = imagePath;
                await _unitOfWork.Doctors.UpdateAsync(newDoctorProfile);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }


            return newDoctorProfile.Id;

        }
    }
}