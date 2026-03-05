using Hospital.Application.Interfaces;
using Hospital.Domain.Entities;
using Microsoft.AspNetCore.Hosting;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Infrastructure.Services
{
    public class LabPdfService : ILabPdfService
    {
        private readonly IWebHostEnvironment _env;

        // wwwroot altındakı qovluq adı (dəyişdirilmək lazım olarsa yalnız burada dəyişilir)
        private const string FolderName = "lab-results";

        public LabPdfService(IWebHostEnvironment env)
        {
            _env = env;
        }

        // ─────────────────────────────────────────────────────────
        // PUBLIC: Path helpers
        // ─────────────────────────────────────────────────────────

        /// <summary>
        /// DB-dəki relative path-i tam fiziki yola çevirir.
        /// Nümunə: "lab-results/labresult_42.pdf" → "/var/app/wwwroot/lab-results/labresult_42.pdf"
        /// </summary>
        public string GetPdfFullPath(string relativePath)
        {
            // relativePath içərisindəki "/" Path.Combine ilə düzgün işləsin deyə normalize edirik
            var normalized = relativePath.Replace('/', Path.DirectorySeparatorChar);
            return Path.Combine(_env.WebRootPath, normalized);
        }

        /// <summary>
        /// PDF faylını disk-dən silir. Fayl tapılmasa istisna atmır.
        /// </summary>
        public void DeletePdfFile(string relativePath)
        {
            if (string.IsNullOrWhiteSpace(relativePath)) return;
            var fullPath = GetPdfFullPath(relativePath);
            if (File.Exists(fullPath))
                File.Delete(fullPath);
        }

        // ─────────────────────────────────────────────────────────
        // PUBLIC: PDF Generation
        // ─────────────────────────────────────────────────────────

        /// <summary>
        /// Lab nəticəsi üçün PDF generasiya edir.
        /// Qaytarır: "lab-results/labresult_{id}_{timestamp}.pdf"  (DB-yə yazılır)
        /// </summary>
        public async Task<string> GenerateLabResultPdfAsync(LabResultPdfModel model)
        {
            QuestPDF.Settings.License = LicenseType.Community;

            // 1. wwwroot/lab-results/ qovluğunu yarat (yoxdursa)
            var folderPath = Path.Combine(_env.WebRootPath, FolderName);
            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            // 2. Fayl adı
            var fileName = $"labresult_{model.LabResultId}_{DateTime.UtcNow:yyyyMMddHHmmss}.pdf";
            var fullPath = Path.Combine(folderPath, fileName);

            // 3. PDF yarat
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(40);
                    page.DefaultTextStyle(x => x.FontSize(11));

                    // ── HEADER ───────────────────────────────────
                    page.Header().Column(col =>
                    {
                        col.Item().Row(row =>
                        {
                            row.RelativeItem().Column(c =>
                            {
                                c.Item().Text("Hospital Management System")
                                    .Bold().FontSize(18).FontColor(Colors.Teal.Darken3);
                                c.Item().Text("Laboratory Results Report")
                                    .FontSize(12).FontColor(Colors.Grey.Darken1);
                                c.Item().Text($"Dr. {model.DoctorName}  |  {model.DepartmentName}")
                                    .FontSize(10).FontColor(Colors.Grey.Medium);
                            });

                            row.ConstantItem(150).AlignRight().Column(c =>
                            {
                                c.Item().Text("LAB RESULT")
                                    .Bold().FontSize(14).FontColor(Colors.Teal.Medium);
                                c.Item().Text($"#{model.LabResultId:D6}")
                                    .FontSize(11).FontColor(Colors.Grey.Darken1);
                                c.Item().Text(model.ResultDate.ToString("dd MMM yyyy"))
                                    .FontSize(10).FontColor(Colors.Grey.Medium);
                            });
                        });

                        col.Item().PaddingTop(8).LineHorizontal(2).LineColor(Colors.Teal.Darken3);
                    });

                    // ── CONTENT ──────────────────────────────────
                    page.Content().PaddingTop(20).Column(col =>
                    {
                        // Patient info box
                        col.Item()
                            .Background(Colors.Teal.Lighten5)
                            .Border(1).BorderColor(Colors.Teal.Lighten2)
                            .Padding(12)
                            .Row(row =>
                            {
                                row.RelativeItem().Column(c =>
                                {
                                    c.Item().Text("PATIENT")
                                        .Bold().FontSize(9).FontColor(Colors.Teal.Darken2);
                                    c.Item().PaddingTop(4).Text(model.PatientName)
                                        .Bold().FontSize(13);
                                });
                                row.ConstantItem(200).Column(c =>
                                {
                                    c.Item().Text("DATE OF RESULT")
                                        .Bold().FontSize(9).FontColor(Colors.Teal.Darken2);
                                    c.Item().PaddingTop(4).Text(model.ResultDate.ToString("dd MMMM yyyy"))
                                        .FontSize(12);
                                });
                            });

                        // Title & Notes
                        col.Item().PaddingTop(16).Column(c =>
                        {
                            c.Item().Text(model.Title)
                                .Bold().FontSize(14).FontColor(Colors.Teal.Darken2);

                            if (!string.IsNullOrWhiteSpace(model.Notes))
                            {
                                c.Item().PaddingTop(6)
                                    .Background(Colors.Grey.Lighten4)
                                    .Padding(10)
                                    .Text($"Notes: {model.Notes}")
                                    .FontSize(10).Italic().FontColor(Colors.Grey.Darken2);
                            }
                        });

                        col.Item().PaddingTop(20);

                        // Results table
                        col.Item().Text("Test Results")
                            .Bold().FontSize(12).FontColor(Colors.Teal.Darken2);

                        col.Item().PaddingTop(8).Table(table =>
                        {
                            table.ColumnsDefinition(cols =>
                            {
                                cols.ConstantColumn(30);   // #
                                cols.RelativeColumn(3);    // Test Name
                                cols.RelativeColumn(2);    // Value + Unit
                                cols.RelativeColumn(2);    // Reference Range
                                cols.ConstantColumn(80);   // Status
                            });

                            // Table header
                            table.Header(h =>
                            {
                                void HCell(string text) =>
                                    h.Cell().Background(Colors.Teal.Darken3).Padding(8)
                                        .Text(text).Bold().FontSize(10).FontColor(Colors.White);

                                HCell("#");
                                HCell("Test Name");
                                HCell("Value");
                                HCell("Reference Range");
                                HCell("Status");
                            });

                            // Table rows
                            for (int i = 0; i < model.Items.Count; i++)
                            {
                                var item = model.Items[i];
                                var bg = i % 2 == 0 ? Colors.White : Colors.Grey.Lighten4;

                                var (statusColor, statusBg) = item.Status switch
                                {
                                    "High" => (Colors.Orange.Darken2, Colors.Orange.Lighten4),
                                    "Low" => (Colors.Blue.Darken2, Colors.Blue.Lighten4),
                                    "Critical" => (Colors.Red.Darken2, Colors.Red.Lighten4),
                                    _ => (Colors.Green.Darken2, Colors.Green.Lighten4)
                                };

                                table.Cell().Background(bg).Padding(8)
                                    .Text((i + 1).ToString()).FontSize(10).FontColor(Colors.Grey.Medium);
                                table.Cell().Background(bg).Padding(8)
                                    .Text(item.TestName).Bold().FontSize(10);
                                table.Cell().Background(bg).Padding(8)
                                    .Text($"{item.Value} {item.Unit}".Trim()).FontSize(10);
                                table.Cell().Background(bg).Padding(8)
                                    .Text(item.ReferenceRange).FontSize(10).FontColor(Colors.Grey.Darken1);
                                table.Cell().Background(statusBg).AlignCenter().Padding(8)
                                    .Text(item.Status).Bold().FontSize(10).FontColor(statusColor);
                            }
                        });

                        // Doctor signature
                        col.Item().PaddingTop(50).AlignRight().Column(c =>
                        {
                            c.Item().Width(170).LineHorizontal(1).LineColor(Colors.Grey.Lighten1);
                            c.Item().PaddingTop(5).AlignCenter()
                                .Text($"Dr. {model.DoctorName}")
                                .Bold().FontSize(11);
                            if (!string.IsNullOrWhiteSpace(model.DepartmentName))
                            {
                                c.Item().AlignCenter()
                                    .Text(model.DepartmentName)
                                    .FontSize(9).FontColor(Colors.Grey.Medium);
                            }
                        });
                    });

                    // ── FOOTER ────────────────────────────────────
                    page.Footer().Row(row =>
                    {
                        row.RelativeItem().Text("This document is electronically generated and valid without signature.")
                            .FontSize(8).FontColor(Colors.Grey.Lighten1).Italic();
                        row.ConstantItem(180).AlignRight()
                            .Text($"Generated: {DateTime.UtcNow:dd/MM/yyyy HH:mm} UTC")
                            .FontSize(8).FontColor(Colors.Grey.Medium);
                    });
                });
            });

            // 4. Diske yaz
            var pdfBytes = document.GeneratePdf();
            await File.WriteAllBytesAsync(fullPath, pdfBytes);

            // 5. DB-yə yazılacaq relative path-i qaytar
            return $"{FolderName}/{fileName}";
        }
    }
}
