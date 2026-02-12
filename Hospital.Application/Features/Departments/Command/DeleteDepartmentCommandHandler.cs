using Hospital.Application.DTOs;
using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Departments.Command
{
   public class DeleteDepartmentCommandHandler:IRequestHandler<DeleteDepartmentCommand, DepartmentDto> 
    {
        readonly IUnitOfWork _unitOfWork;
        private readonly IFileService _fileService;
        public DeleteDepartmentCommandHandler(IUnitOfWork unitOfWork, IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _fileService = fileService;
        }
        public async Task<DepartmentDto> Handle(DeleteDepartmentCommand request, CancellationToken cancellationToken)
        {
            var department = await _unitOfWork.Departments.GetByIdAsync(request.Id);
            if (department == null)
            {
                throw new NotFoundException("Department not found");
            }

            if (!string.IsNullOrEmpty(department.ImagePath))
            {
                await _fileService.DeleteDepartmentImageAsync(department.ImagePath);
            }

            await _unitOfWork.Departments.DeleteAsync(department);

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
