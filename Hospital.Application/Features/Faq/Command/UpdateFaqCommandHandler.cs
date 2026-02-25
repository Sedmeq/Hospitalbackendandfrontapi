using Hospital.Application.DTOs;
using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Faq.Command
{
    public class UpdateFaqCommandHandler : IRequestHandler<UpdateFaqCommand, FaqDto>
    {
        private readonly IUnitOfWork _unitOfWork;

        public UpdateFaqCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<FaqDto> Handle(UpdateFaqCommand request, CancellationToken cancellationToken)
        {
            var faq = await _unitOfWork.Faqs.GetByIdAsync(request.Id);
            if (faq == null)
                throw new NotFoundException("FAQ not found.");

            faq.Question = request.Question;
            faq.Answer = request.Answer;
            faq.IsActive = request.IsActive;
            faq.Order = request.Order;
            faq.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Faqs.UpdateAsync(faq);
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
