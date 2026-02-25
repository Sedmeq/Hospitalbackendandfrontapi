using Hospital.Application.DTOs;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Faq.Queries
{
    public class GetAllFaqsQueryHandler : IRequestHandler<GetAllFaqsQuery, IEnumerable<FaqDto>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetAllFaqsQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<FaqDto>> Handle(GetAllFaqsQuery request, CancellationToken cancellationToken)
        {
            var faqs = await _unitOfWork.Faqs.GetFaqsOrderedAsync();

            return faqs.Select(f => new FaqDto
            {
                Id = f.Id,
                Question = f.Question,
                Answer = f.Answer,
                IsActive = f.IsActive,
                Order = f.Order,
                CreatedAt = f.CreatedAt,
                UpdatedAt = f.UpdatedAt
            });
        }
    }

}
