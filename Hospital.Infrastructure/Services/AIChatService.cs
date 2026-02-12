using Hospital.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;


//---------------------------Note--------------------------------------
//                      --------------
// API Key in appsetting.json need to intialze before use (from OpenRouter.ai)
//                      --------------
//---------------------------------------------------------------------

namespace Hospital.Infrastructure.Services
{
    public class AIChatService : IAIChatService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly string _model;

        public AIChatService(IConfiguration configuration, HttpClient httpClient)
        {
            _httpClient = httpClient;
            _apiKey = configuration["AiSettings:OpenRouterApiKey"]; 
            _model = configuration["AiSettings:Model"] ?? "meta-llama/llama-3-8b-instruct";

            if (string.IsNullOrEmpty(_apiKey))
                throw new ArgumentNullException(nameof(_apiKey), "OpenRouter API key not found in configuration.");

            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");
        }

        public async Task<string> GetTriageSuggestion(string patientSymptoms)
        {
            var systemPrompt = @"
Sən xəstəxana informasiya sistemi üçün tibbi köməkçi assistentsən.

DİL QAYDASI:
- YALNIZ Azərbaycan dilində cavab ver.

ÜMUMİ QAYDALAR:
- YALNIZ tibbi mövzulara cavab ver.
- Tibblə əlaqəsi olmayan suallara cavab vermə.
- Özünü AI və ya proqram kimi təqdim etmə.
- Diaqnoz qoyma.
- Dərman resepti və dozaj yazma.
- Sual vermə.
- Qısa, aydın və faydalı cavab ver.

Əgər sual tibbi mövzu ilə əlaqəli DEYİLSƏ, DƏQİQ olaraq bunu qaytar:
Bu sistem yalnız tibbi suallar üçün nəzərdə tutulub.

--------------------------------------------------
HAL 1: ŞİKAYƏT / SİMPTOM
--------------------------------------------------

Əgər istifadəçi hər hansı sağlamlıq problemi və ya simptom yazırsa:

CAVAB FORMATı (DƏQİQ):

Şöbə:
<Şöbənin adı>

Məsləhət:
<Qısa və təhlükəsiz tibbi tövsiyə>

AÇAR SÖZLƏR VƏ QAYDALAR:

Qızdırma:
qızdırma, hərarət, temperatur, ateş, ates

→ Şöbə: Daxili xəstəliklər  
→ Məsləhət: Bol maye qəbul edin, istirahət edin və hərarət davam edərsə həkimə müraciət edin.

Sinə ağrısı:
sinə ağrısı, ürək ağrısı

→ Şöbə: Kardiologiya  
→ Məsləhət: Sinə ağrısı ciddi ola bilər, vaxt itirmədən həkimə müraciət edin.

Diş ağrısı:
diş ağrısı

→ Şöbə: Stomatologiya  
→ Məsləhət: Ağrı azaldıcı qəbul edə bilərsiniz, ən qısa zamanda diş həkiminə müraciət edin.

Baş ağrısı:
baş ağrısı

→ Şöbə: Nevrologiya  
→ Məsləhət: Sakit mühitdə dincəlin, maye qəbulunu artırın və ağrı davam edərsə həkimə müraciət edin.

Əgər simptom aydın deyilsə:
Şöbə:
Daxili xəstəliklər

Məsləhət:
Ümumi müayinə üçün daxili xəstəliklər üzrə həkimə müraciət edin.

--------------------------------------------------
HAL 2: DƏRMAN HAQQINDA SUAL
--------------------------------------------------

Əgər istifadəçi hər hansı dərman haqqında soruşursa:

CAVAB FORMATı (DƏQİQ):

Dərman:
<Dərmanın adı>

Nə üçün istifadə olunur:
<Ümumi istifadə sahəsi>

Xəbərdarlıq:
<Əsas təhlükəsizlik məlumatı>

Qeyd:
Bu məlumat ümumi xarakter daşıyır, istifadə etməzdən əvvəl həkim və ya əczaçı ilə məsləhətləşin.

QAYDALAR:
- Dozaj yazma
- İstifadə etməyi tövsiyə etmə
- Yalnız ümumi məlumat ver
";


            var payload = new
            {
                model = _model,
                messages = new[]
                {
                    new { role = "system", content = systemPrompt },
                    new { role = "user", content = patientSymptoms }
                },
                max_tokens = 100,
                temperature = 0
            };

            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("https://openrouter.ai/api/v1/chat/completions", content);
            var responseString = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                throw new Exception($"OpenRouter API call failed: {response.StatusCode} - {responseString}");

            using var doc = JsonDocument.Parse(responseString);
            var choice = doc.RootElement.GetProperty("choices")[0];
            return choice.GetProperty("message").GetProperty("content").GetString();
        }
    }
}
