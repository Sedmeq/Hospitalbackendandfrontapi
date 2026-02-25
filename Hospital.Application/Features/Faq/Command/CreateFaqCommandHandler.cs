using Hospital.Application.DTOs;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Faq.Command
{
    public class CreateFaqCommandHandler : IRequestHandler<CreateFaqCommand, FaqDto>
    {
        private readonly IUnitOfWork _unitOfWork;

        public CreateFaqCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<FaqDto> Handle(CreateFaqCommand request, CancellationToken cancellationToken)
        {
            var faq = new Domain.Entities.Faq
            {
                Question = request.Question,
                Answer = request.Answer,
                IsActive = request.IsActive,
                Order = request.Order,
                CreatedAt = DateTime.UtcNow
            };

            await _unitOfWork.Faqs.AddAsync(faq);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new FaqDto
            {
                Id = faq.Id,
                Question = faq.Question,
                Answer = faq.Answer,
                IsActive = faq.IsActive,
                Order = faq.Order,
                CreatedAt = faq.CreatedAt,
                UpdatedAt = faq.UpdatedAt
            };
        }
    }
}
