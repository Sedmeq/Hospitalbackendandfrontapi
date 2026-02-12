using Hospital.Application.DTOs;
using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Partners.Command
{
    public class DeletePartnersCommandHandler : IRequestHandler<DeletePartnersCommand, PartnersDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileService _fileService;

        public DeletePartnersCommandHandler(IUnitOfWork unitOfWork, IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _fileService = fileService;
        }

        public async Task<PartnersDto> Handle(DeletePartnersCommand request, CancellationToken cancellationToken)
        {
            var partners = await _unitOfWork.Partners.GetByIdAsync(request.Id);
            if (partners == null)
            {
                throw new NotFoundException("Partners not found");
            }

            // Şəkli sil
            if (!string.IsNullOrEmpty(partners.ImageUrl))
            {
                await _fileService.DeletePartnerImageAsync(partners.ImageUrl);
            }

            await _unitOfWork.Partners.DeleteAsync(partners);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new PartnersDto
            {
                Id = partners.Id,
                ImageUrl = partners.ImageUrl
            };
        }
    }
}
