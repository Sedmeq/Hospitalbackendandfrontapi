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
    public class DeleteFaqCommandHandler : IRequestHandler<DeleteFaqCommand, FaqDto>
    {
        private readonly IUnitOfWork _unitOfWork;

        public DeleteFaqCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<FaqDto> Handle(DeleteFaqCommand request, CancellationToken cancellationToken)
        {
            var faq = await _unitOfWork.Faqs.GetByIdAsync(request.Id);
            if (faq == null)
                throw new NotFoundException("FAQ not found.");

            await _unitOfWork.Faqs.DeleteAsync(faq);
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
