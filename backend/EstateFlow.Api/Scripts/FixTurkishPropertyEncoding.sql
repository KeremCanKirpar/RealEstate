SET NOCOUNT ON;

-- Bu dosyayı sqlcmd ile mutlaka UTF-8 okuyarak çalıştırın:
-- powershell -ExecutionPolicy Bypass -File "backend\EstateFlow.Api\Scripts\RunSqlUtf8.ps1" -Script "backend\EstateFlow.Api\Scripts\FixTurkishPropertyEncoding.sql"

UPDATE Properties
SET
    Title = N'Etiler''de Geniş Balkonlu 3+1 Daire',
    Description = N'Etiler merkezde, geniş balkonlu, ebeveyn banyolu ve kapalı otoparklı bakımlı aile dairesi.',
    City = N'İstanbul',
    District = N'Beşiktaş',
    Neighborhood = N'Etiler',
    Address = N'Nispetiye Caddesi çevresi',
    HeatingType = N'Merkezi pay ölçer',
    OwnerName = N'Burak Tan'
WHERE OwnerPhone = N'+90 532 410 22 18';

UPDATE Properties
SET
    Title = N'Alaçatı''da Havuzlu Taş Villa',
    Description = N'Alaçatı merkeze yakın, özel havuzlu, bahçeli, tam mobilyalı ve sezonluk kiralamaya uygun taş villa.',
    City = N'İzmir',
    District = N'Çeşme',
    Neighborhood = N'Alaçatı',
    Address = N'Hacımemiş çevresi',
    HeatingType = N'Klima',
    OwnerName = N'Elif Sönmez'
WHERE OwnerPhone = N'+90 533 612 45 90';

UPDATE Properties
SET
    Title = N'Çankaya''da Site İçinde 2+1 Daire',
    Description = N'Güvenlikli sitede, kapalı otoparklı, balkonlu ve metro bağlantısına yakın modern 2+1 daire.',
    City = N'Ankara',
    District = N'Çankaya',
    Neighborhood = N'Oran',
    Address = N'Turan Güneş Bulvarı çevresi',
    HeatingType = N'Merkezi pay ölçer',
    OwnerName = N'Merve Aksoy'
WHERE OwnerPhone = N'+90 532 118 72 40';

UPDATE Properties
SET
    Title = N'Nilüfer''de Yeni Nesil 4+1 Dubleks Daire',
    Description = N'Geniş teraslı, akıllı ev altyapılı, aile yaşamına uygun ferah dubleks daire.',
    City = N'Bursa',
    District = N'Nilüfer',
    Neighborhood = N'Balat',
    Address = N'Balat merkez çevresi',
    HeatingType = N'Yerden ısıtma',
    OwnerName = N'Onur Kılıç'
WHERE OwnerPhone = N'+90 533 284 19 63';

UPDATE Properties
SET
    Title = N'Konyaaltı''nda Eşyalı 1+1 Kiralık Daire',
    Description = N'Sahile yürüyüş mesafesinde, tam eşyalı, site havuzlu ve kısa sürede taşınmaya uygun kiralık daire.',
    City = N'Antalya',
    District = N'Konyaaltı',
    Neighborhood = N'Hurma',
    Address = N'Boğaçayı çevresi',
    HeatingType = N'Klima',
    OwnerName = N'Sinem Yalçın'
WHERE OwnerPhone = N'+90 535 604 88 21';

UPDATE Properties
SET
    Title = N'Odunpazarı''nda Merkezi 2+1 Kiralık Daire',
    Description = N'Tramvaya yakın, aydınlık cepheli, öğrenciler ve çalışanlar için ulaşımı güçlü kiralık daire.',
    City = N'Eskişehir',
    District = N'Odunpazarı',
    Neighborhood = N'Yenikent',
    Address = N'Atatürk Bulvarı bağlantısı',
    HeatingType = N'Kombi',
    OwnerName = N'Kerem Arslan'
WHERE OwnerPhone = N'+90 536 733 10 54';

SELECT Id, Title, City, District, Neighborhood
FROM Properties
WHERE OwnerPhone IN
(
    N'+90 532 410 22 18',
    N'+90 533 612 45 90',
    N'+90 532 118 72 40',
    N'+90 533 284 19 63',
    N'+90 535 604 88 21',
    N'+90 536 733 10 54'
)
ORDER BY Id;