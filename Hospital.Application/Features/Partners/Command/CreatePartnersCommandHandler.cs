using Hospital.Application.DTOs;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Partners.Command
{
    public class CreatePartnersCommandHandler : IRequestHandler<CreatePartnersCommand, PartnersDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileService _fileService;

        public CreatePartnersCommandHandler(IUnitOfWork unitOfWork, IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _fileService = fileService;
        }

        public async Task<PartnersDto> Handle(CreatePartnersCommand request, CancellationToken cancellationToken)
        {
            var partners = new Domain.Entities.Partners();

            await _unitOfWork.Partners.AddAsync(partners);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            if (request.ImageUrl != null)
            {
                var imagePath = await _fileService.SavePartnerImageAsync(request.ImageUrl, partners.Id);
                partners.ImageUrl = imagePath;
                await _unitOfWork.Partners.UpdateAsync(partners);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }
            return new PartnersDto
            {
                Id = partners.Id,
                ImageUrl = partners.ImageUrl,
            };
        }
    }
}
