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
    public class UpdatePartnersCommandHandler : IRequestHandler<UpdatePartnersCommand, PartnersDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileService _fileService;

        public UpdatePartnersCommandHandler(IUnitOfWork unitOfWork, IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _fileService = fileService;
        }
        public async Task<PartnersDto> Handle(UpdatePartnersCommand request, CancellationToken cancellationToken)
        {
            var partners = await _unitOfWork.Partners.GetByIdAsync(request.Id);
            if (partners == null)
            {
                throw new NotFoundException("Partners not found");
            }


            // Şəkil əməliyyatları
            if (request.RemoveImage && !string.IsNullOrEmpty(partners.ImageUrl))
            {
                await _fileService.DeletePartnerImageAsync(partners.ImageUrl);
                partners.ImageUrl = string.Empty;
            }
            else if (request.ImageUrl != null)
            {
                // Köhnə şəkli sil
                if (!string.IsNullOrEmpty(partners.ImageUrl))
                {
                    await _fileService.DeletePartnerImageAsync(partners.ImageUrl);
                }

                // Yeni şəkli yüklə
                partners.ImageUrl = await _fileService.SavePartnerImageAsync(request.ImageUrl, partners.Id);
            }

            await _unitOfWork.Partners.UpdateAsync(partners);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new PartnersDto
            {
                Id = partners.Id,
                ImageUrl = partners.ImageUrl
            };
        }
    }
}
