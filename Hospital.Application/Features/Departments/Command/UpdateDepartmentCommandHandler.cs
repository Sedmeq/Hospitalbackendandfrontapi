using Hospital.Application.DTOs;
using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Departments.Command
{
   public class UpdateDepartmentCommandHandler:IRequestHandler<UpdateDepartmentCommand,DepartmentDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileService _fileService;
        public UpdateDepartmentCommandHandler(IUnitOfWork unitOfWork, IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _fileService = fileService;
        }
        public async Task<DepartmentDto> Handle(UpdateDepartmentCommand request, CancellationToken cancellationToken)
        {
            var department = await _unitOfWork.Departments.GetByIdAsync(request.Id);
            if (department == null)
            {
                throw new NotFoundException("Department not found");
            }
            department.Name = request.Name;
            department.Description = request.Description; // YENİ
            department.ShortDescription = request.ShortDescription; // YENİ
            department.Services = request.Services ?? new List<string>();

            if (request.RemoveImage && !string.IsNullOrEmpty(department.ImagePath))
            {
                await _fileService.DeleteDepartmentImageAsync(department.ImagePath);
                department.ImagePath = string.Empty;
            }
            else if (request.Image != null)
            {
                // Köhnə şəkli sil
                if (!string.IsNullOrEmpty(department.ImagePath))
                {
                    await _fileService.DeleteDepartmentImageAsync(department.ImagePath);
                }

                // Yeni şəkli yüklə
                department.ImagePath = await _fileService.SaveDepartmentImageAsync(request.Image, department.Id);
            }


            await _unitOfWork.Departments.UpdateAsync(department);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return new DepartmentDto
            {
                Id = department.Id,
                Name = department.Name,
                Description = department.Description, // YENİ
                ShortDescription = department.ShortDescription, // YENİ
                ImagePath = department.ImagePath, // YENİ
                Services = department.Services
            };
        }

    }
}
