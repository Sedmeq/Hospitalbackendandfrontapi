using Hospital.Application.DTOs;
using Hospital.Application.Interfaces;
using Hospital.Domain.Entities;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Departments.Command
{
    public class CreateDepartmentCommandHandler : IRequestHandler<CreateDepartmentCommand, DepartmentDto>
    {
        private readonly IUnitOfWork _unitOfWork ;
        private readonly IFileService _fileService;

        public CreateDepartmentCommandHandler(IUnitOfWork unitOfWork, IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _fileService = fileService;
        }

        public async Task<DepartmentDto> Handle(CreateDepartmentCommand request, CancellationToken cancellationToken)
        {
            var department = new Department
            {
                Name = request.Name,
                Description = request.Description, // YENİ
                ShortDescription = request.ShortDescription, // YENİ
                Services = request.Services ?? new List<string>()
            };

            await _unitOfWork.Departments.AddAsync(department);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            if (request.Image != null)
            {
                var imagePath = await _fileService.SaveDepartmentImageAsync(request.Image, department.Id);
                department.ImagePath = imagePath;
                await _unitOfWork.Departments.UpdateAsync(department);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }

            return new DepartmentDto
            {
                Id = department.Id,
                Name = department.Name,
                Description = department.Description, // YENİ
                ShortDescription = department.ShortDescription, // YENİ
                ImagePath = department.ImagePath, // YENİ
                Services = department.Services // YENİ
            };
        }
    }
}
