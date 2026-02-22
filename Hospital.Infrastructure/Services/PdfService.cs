using Hospital.Application.Interfaces;
using Hospital.Domain.Entities;
using Microsoft.AspNetCore.Hosting;
using QuestPDF.Infrastructure;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Infrastructure.Services
{

    public class PdfService : IPdfService
    {
        private readonly IWebHostEnvironment _env;

        public PdfService(IWebHostEnvironment env)
        {
            _env = env;
        }

        public async Task<string> GeneratePrescriptionPdfAsync(PrescriptionPdfModel model)
        {
            QuestPDF.Settings.License = LicenseType.Community;

            var folderPath = Path.Combine(_env.WebRootPath, "prescriptions");
            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            var fileName = $"prescription_{model.PrescriptionId}_{DateTime.Now:yyyyMMddHHmmss}.pdf";
            var fullPath = Path.Combine(folderPath, fileName);

            var document = QuestPDF.Fluent.Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(40);
                    page.DefaultTextStyle(x => x.FontSize(11));

                    // ── HEADER ──
                    page.Header().Column(col =>
                    {
                        col.Item().Row(row =>
                        {
                            row.RelativeItem().Column(c =>
                            {
                                c.Item().Text("Hospital Management System")
                                    .Bold().FontSize(18).FontColor(Colors.Blue.Darken3);
                                c.Item().Text($"Dr. {model.DoctorName}")
                                    .FontSize(12).FontColor(Colors.Grey.Darken1);
                                c.Item().Text(model.DepartmentName)
                                    .FontSize(11).FontColor(Colors.Grey.Medium);
                            });

                            row.ConstantItem(130).AlignRight().Column(c =>
                            {
                                c.Item().Text("PRESCRIPTION")
                                    .Bold().FontSize(14).FontColor(Colors.Blue.Medium);
                                c.Item().Text($"#{model.PrescriptionId:D6}")
                                    .FontSize(11).FontColor(Colors.Grey.Darken1);
                                c.Item().Text(model.PrescriptionDate.ToString("dd MMM yyyy"))
                                    .FontSize(10).FontColor(Colors.Grey.Medium);
                            });
                        });

                        col.Item().PaddingTop(8).LineHorizontal(2).LineColor(Colors.Blue.Darken3);
                    });

                    // ── CONTENT ──
                    page.Content().PaddingTop(20).Column(col =>
                    {
                        // Patient box
                        col.Item()
                            .Background(Colors.Blue.Lighten5)
                            .Padding(12)
                            .Column(c =>
                            {
                                c.Item().Text("PATIENT")
                                    .Bold().FontSize(9).FontColor(Colors.Blue.Darken2);
                                c.Item().PaddingTop(4).Text(model.PatientName)
                                    .Bold().FontSize(14);
                            });

                        col.Item().PaddingTop(20);

                        // Medicines table
                        col.Item().Text("Prescribed Medicines")
                            .Bold().FontSize(12).FontColor(Colors.Blue.Darken2);

                        col.Item().PaddingTop(8).Table(table =>
                        {
                            table.ColumnsDefinition(cols =>
                            {
                                cols.ConstantColumn(30);   // #
                                cols.RelativeColumn(3);    // Medicine
                                cols.RelativeColumn(4);    // Instructions
                                cols.RelativeColumn(1);    // Qty
                            });

                            table.Header(h =>
                            {
                                void HCell(string text) =>
                                    h.Cell().Background(Colors.Blue.Darken3).Padding(8)
                                        .Text(text).Bold().FontSize(10).FontColor(Colors.White);

                                HCell("#");
                                HCell("Medicine");
                                HCell("Instructions");
                                HCell("Qty");
                            });

                            for (int i = 0; i < model.Medicines.Count; i++)
                            {
                                var med = model.Medicines[i];
                                var bg = i % 2 == 0 ? Colors.White : Colors.Grey.Lighten4;

                                void DCell(string text) =>
                                    table.Cell().Background(bg).Padding(8)
                                        .Text(text).FontSize(10);

                                DCell((i + 1).ToString());
                                DCell(med.MedicineName);
                                DCell(med.Instructions);
                                DCell(med.Quantity.ToString());
                            }
                        });

                        // Signature
                        col.Item().PaddingTop(60).AlignRight().Column(c =>
                        {
                            c.Item().Width(160).LineHorizontal(1).LineColor(Colors.Grey.Lighten1);
                            c.Item().PaddingTop(4).Text($"Dr. {model.DoctorName}")
                                .Bold().FontSize(11);
                            c.Item().Text(model.DepartmentName)
                                .FontSize(10).FontColor(Colors.Grey.Medium);
                        });
                    });

                    // ── FOOTER ──
                    page.Footer().AlignCenter().Text(t =>
                    {
                        t.Span("Generated electronically on ")
                            .FontSize(9).FontColor(Colors.Grey.Medium);
                        t.Span(DateTime.Now.ToString("dd/MM/yyyy HH:mm"))
                            .FontSize(9).FontColor(Colors.Grey.Medium);
                    });
                });
            });

            var pdfBytes = document.GeneratePdf();
            await File.WriteAllBytesAsync(fullPath, pdfBytes);

            return $"prescriptions/{fileName}";
        }
    }
}
