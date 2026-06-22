# EstateFlow

EstateFlow; emlak danışmanları için hazırlanmış, müşteri web sitesi ve yönetici panelini aynı çözümde birleştiren modern bir emlak CRM uygulamasıdır. Ziyaretçiler müşteri sitesinden aktif ilanları görüntüleyebilir ve talep bırakabilir; gelen talepler yönetici panelinde müşteri kaydı ve görev olarak takip edilir.

## Özellikler

- Public müşteri sitesi: aktif ilan listeleme, ilan detayı ve talep formu
- Yönetici paneli: ilan, müşteri, randevu, görev, doküman ve rapor yönetimi
- Web talebi akışı: müşteri sitesinden gelen talepler otomatik `Customer` + `TaskItem` kaydı oluşturur
- Web talebi ayrımı: panelde `Web Talebi` rozeti ve kaynak filtresi
- JWT tabanlı kimlik doğrulama ve rol kontrolü
- SQL Server + Entity Framework Core veri katmanı
- Premium EstateFlow tasarım diliyle React arayüzü
- UTF-8 uyumlu SQL script çalıştırma wrapper'ı
- Port çakışmalarını temizleyen tek komutluk geliştirme başlatıcısı

## Teknoloji Yığını

| Katman | Teknolojiler |
| --- | --- |
| Backend | .NET 10, ASP.NET Core Web API, EF Core, SQL Server, JWT, Swagger |
| Frontend | React, TypeScript, Vite, Tailwind CSS, React Router, Axios, TanStack Query |
| Araçlar | PowerShell, sqlcmd, npm |

## Proje Yapısı

```text
backend/EstateFlow.Api
  Controllers, DTOs, Entities, Data, Services, Repositories, Middleware, Scripts

frontend/EstateFlow.Client
  src/api, components, layouts, pages, routes, types, utils
```

## Uygulama Kökleri

```text
http://localhost:5173/musteri         Müşteri web sitesi
http://localhost:5173/musteri/ilanlar Aktif ilanlar
http://localhost:5173/panel           Yönetici paneli
http://localhost:5104/swagger         Backend Swagger
```

## Kurulum

Gereksinimler:

- .NET SDK 10
- Node.js ve npm
- SQL Server Express veya erişilebilir bir SQL Server instance'ı
- SQL Server command line tools (`sqlcmd`)

Repository'yi klonladıktan sonra frontend bağımlılıklarını kurun:

```powershell
cd frontend\EstateFlow.Client
npm install
```

Backend veritabanını hazırlayın:

```powershell
cd backend\EstateFlow.Api
dotnet ef database update
```

## Geliştirme Ortamını Başlatma

Proje kökünde aşağıdaki komut backend ve frontend'i birlikte başlatır. Aynı zamanda `5104` ve `5173` portlarını kullanan eski EstateFlow süreçlerini kapatır.

```powershell
powershell -ExecutionPolicy Bypass -File .\start-dev.ps1
```

Varsayılan portlar:

```text
Backend:  5104
Frontend: 5173
```

Log dosyaları proje köküne yazılır:

```text
backend-api.out.log
backend-api.err.log
frontend-vite.out.log
frontend-vite.err.log
```

## Varsayılan Kullanıcılar

`SeedDataOnStartup` açıkken uygulama minimum giriş kullanıcılarını oluşturur. Demo portföy, müşteri veya görev verisi otomatik basılmaz.

```text
Admin:      admin@estateflow.local / Admin123!
Consultant: consultant@estateflow.local / Consultant123!
```

## Veritabanı Ayarları

Development bağlantı örneği:

```text
Server=.\SQLEXPRESS;Database=EstateFlowDb;Integrated Security=True;Encrypt=False;TrustServerCertificate=True;MultipleActiveResultSets=true
```

Ayar dosyaları:

```text
backend/EstateFlow.Api/appsettings.json
backend/EstateFlow.Api/appsettings.Development.json
backend/EstateFlow.Api/appsettings.Example.json
```

Production ortamında `ConnectionStrings:DefaultConnection`, `Jwt:Key`, `Cors:AllowedOrigins` ve `PublicLeads:DefaultAdminEmail` değerleri güncellenmelidir.

## Örnek İlan ve Veri Scriptleri

Türkçe karakterlerin bozulmaması için SQL scriptlerini doğrudan `sqlcmd` ile değil, UTF-8 wrapper ile çalıştırın.

```powershell
powershell -ExecutionPolicy Bypass -File .\backend\EstateFlow.Api\Scripts\RunSqlUtf8.ps1 -Script .\backend\EstateFlow.Api\Scripts\FixTurkishPropertyEncoding.sql
powershell -ExecutionPolicy Bypass -File .\backend\EstateFlow.Api\Scripts\RunSqlUtf8.ps1 -Script .\backend\EstateFlow.Api\Scripts\FixNiluferPropertyImage.sql
powershell -ExecutionPolicy Bypass -File .\backend\EstateFlow.Api\Scripts\RunSqlUtf8.ps1 -Script .\backend\EstateFlow.Api\Scripts\InsertSampleProperties.sql
```

Farklı server veya veritabanı kullanmak için:

```powershell
powershell -ExecutionPolicy Bypass -File .\backend\EstateFlow.Api\Scripts\RunSqlUtf8.ps1 -Server ".\SQLEXPRESS" -Database "EstateFlowDb" -Script .\backend\EstateFlow.Api\Scripts\InsertSampleProperties.sql
```

Wrapper şu parametrelerle çalışır:

```text
-No         SQL bağlantısında şifrelemeyi opsiyonel yapar
-C          SQL Server sertifikasına güvenir
-f 65001    SQL dosyasını UTF-8 okur
-E          Windows kimliği ile bağlanır
```

## Müşteri Talebi Akışı

Müşteri sitesi anonim çalışır. Ziyaretçi genel talep veya ilan detayından talep bıraktığında backend şu kayıtları oluşturur:

- `Customer` kaydı
- İlgili müşteriye bağlı `TaskItem` kaydı
- Müşteri notunda `Kaynak: Web sitesi talebi` bilgisi

Panelde bu kayıtlar `Web Talebi` rozetiyle görünür. Müşteriler ekranındaki `Kaynak > Web Talebi` filtresi sadece müşteri sitesinden gelen talepleri listeler.

## Build ve Kontrol Komutları

Backend build:

```powershell
dotnet build backend\EstateFlow.Api\EstateFlow.Api.csproj
```

Frontend build:

```powershell
cd frontend\EstateFlow.Client
npm run build
```

## API Notları

Public endpoint'ler:

```text
GET  /api/public/properties
GET  /api/public/properties/{id}
POST /api/public/leads
```

Panel endpoint'leri JWT ile korunur. Swagger arayüzü development ortamında kullanılabilir:

```text
http://localhost:5104/swagger
```

## Production Notları

- `Jwt:Key` güçlü, uzun ve gizli bir değer olmalıdır.
- `Cors:AllowedOrigins` sadece gerçek frontend domainlerini içermelidir.
- `SeedDataOnStartup` production ortamında genellikle `false` tutulmalıdır.
- SQL bağlantı bilgileri production SQL Server'a göre güncellenmelidir.
- Public talep ataması için `PublicLeads:DefaultAdminEmail` değerindeki admin kullanıcının sistemde bulunduğundan emin olun.

## Lisans

Bu proje için henüz bir lisans dosyası eklenmemiştir.