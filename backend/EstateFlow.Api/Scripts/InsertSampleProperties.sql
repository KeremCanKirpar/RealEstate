-- UTF-8 çalıştırma komutu:
-- powershell -ExecutionPolicy Bypass -File "backend\EstateFlow.Api\Scripts\RunSqlUtf8.ps1" -Script "backend\EstateFlow.Api\Scripts\InsertSampleProperties.sql"

SET NOCOUNT ON;

DECLARE @UserId int;

SELECT TOP 1 @UserId = Id
FROM Users
WHERE Email = N'consultant@estateflow.local';

IF @UserId IS NULL
BEGIN
    SELECT TOP 1 @UserId = Id
    FROM Users
    WHERE Email = N'admin@estateflow.local';
END;

IF @UserId IS NULL
BEGIN
    THROW 50001, N'Önce backend seed çalıştırılarak admin veya danışman kullanıcısı oluşturulmalı.', 1;
END;

IF NOT EXISTS (SELECT 1 FROM Properties WHERE Title = N'Etiler''de Geniş Balkonlu 3+1 Daire')
BEGIN
    INSERT INTO Properties
    (
        Title, Description, ListingType, PropertyType, Price, City, District, Neighborhood, Address,
        SquareMeters, RoomCount, BuildingAge, Floor, TotalFloors, HeatingType, IsFurnished, Dues, Deposit,
        Status, OwnerName, OwnerPhone, CreatedAt, UpdatedAt, UserId
    )
    VALUES
    (
        N'Etiler''de Geniş Balkonlu 3+1 Daire',
        N'Etiler merkezde, geniş balkonlu, ebeveyn banyolu ve kapalı otoparklı bakımlı aile dairesi.',
        N'ForSale', N'Apartment', 18500000, N'İstanbul', N'Beşiktaş', N'Etiler', N'Nispetiye Caddesi çevresi',
        165, N'3+1', 6, 5, 12, N'Merkezi pay ölçer', 0, 4200, 0,
        N'Active', N'Burak Tan', N'+90 532 410 22 18', DATEADD(day, -2, SYSUTCDATETIME()), NULL, @UserId
    );

    DECLARE @ApartmentId int = SCOPE_IDENTITY();

    INSERT INTO PropertyImages (PropertyId, ImageUrl, IsMainImage, CreatedAt)
    VALUES
    (@ApartmentId, N'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80', 1, SYSUTCDATETIME()),
    (@ApartmentId, N'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=80', 0, SYSUTCDATETIME());
END;

IF NOT EXISTS (SELECT 1 FROM Properties WHERE Title = N'Alaçatı''da Havuzlu Taş Villa')
BEGIN
    INSERT INTO Properties
    (
        Title, Description, ListingType, PropertyType, Price, City, District, Neighborhood, Address,
        SquareMeters, RoomCount, BuildingAge, Floor, TotalFloors, HeatingType, IsFurnished, Dues, Deposit,
        Status, OwnerName, OwnerPhone, CreatedAt, UpdatedAt, UserId
    )
    VALUES
    (
        N'Alaçatı''da Havuzlu Taş Villa',
        N'Alaçatı merkeze yakın, özel havuzlu, bahçeli, tam mobilyalı ve sezonluk kiralamaya uygun taş villa.',
        N'ForRent', N'Villa', 165000, N'İzmir', N'Çeşme', N'Alaçatı', N'Hacımemiş çevresi',
        240, N'4+1', 4, 1, 2, N'Klima', 1, 6500, 330000,
        N'Active', N'Elif Sönmez', N'+90 533 612 45 90', DATEADD(day, -1, SYSUTCDATETIME()), NULL, @UserId
    );

    DECLARE @VillaId int = SCOPE_IDENTITY();

    INSERT INTO PropertyImages (PropertyId, ImageUrl, IsMainImage, CreatedAt)
    VALUES
    (@VillaId, N'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1400&q=80', 1, SYSUTCDATETIME()),
    (@VillaId, N'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=80', 0, SYSUTCDATETIME());
END;


IF NOT EXISTS (SELECT 1 FROM Properties WHERE Title = N'Çankaya''da Site İçinde 2+1 Daire')
BEGIN
    INSERT INTO Properties
    (
        Title, Description, ListingType, PropertyType, Price, City, District, Neighborhood, Address,
        SquareMeters, RoomCount, BuildingAge, Floor, TotalFloors, HeatingType, IsFurnished, Dues, Deposit,
        Status, OwnerName, OwnerPhone, CreatedAt, UpdatedAt, UserId
    )
    VALUES
    (
        N'Çankaya''da Site İçinde 2+1 Daire',
        N'Güvenlikli sitede, kapalı otoparklı, balkonlu ve metro bağlantısına yakın modern 2+1 daire.',
        N'ForSale', N'Apartment', 6750000, N'Ankara', N'Çankaya', N'Oran', N'Turan Güneş Bulvarı çevresi',
        112, N'2+1', 5, 7, 15, N'Merkezi pay ölçer', 0, 2800, 0,
        N'Active', N'Merve Aksoy', N'+90 532 118 72 40', DATEADD(day, -5, SYSUTCDATETIME()), NULL, @UserId
    );

    DECLARE @CankayaApartmentId int = SCOPE_IDENTITY();

    INSERT INTO PropertyImages (PropertyId, ImageUrl, IsMainImage, CreatedAt)
    VALUES
    (@CankayaApartmentId, N'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=1400&q=80', 1, SYSUTCDATETIME()),
    (@CankayaApartmentId, N'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80', 0, SYSUTCDATETIME());
END;

IF NOT EXISTS (SELECT 1 FROM Properties WHERE Title = N'Nilüfer''de Yeni Nesil 4+1 Dubleks Daire')
BEGIN
    INSERT INTO Properties
    (
        Title, Description, ListingType, PropertyType, Price, City, District, Neighborhood, Address,
        SquareMeters, RoomCount, BuildingAge, Floor, TotalFloors, HeatingType, IsFurnished, Dues, Deposit,
        Status, OwnerName, OwnerPhone, CreatedAt, UpdatedAt, UserId
    )
    VALUES
    (
        N'Nilüfer''de Yeni Nesil 4+1 Dubleks Daire',
        N'Geniş teraslı, akıllı ev altyapılı, aile yaşamına uygun ferah dubleks daire.',
        N'ForSale', N'Apartment', 9200000, N'Bursa', N'Nilüfer', N'Balat', N'Balat merkez çevresi',
        205, N'4+1', 2, 8, 9, N'Yerden ısıtma', 0, 3600, 0,
        N'Active', N'Onur Kılıç', N'+90 533 284 19 63', DATEADD(day, -4, SYSUTCDATETIME()), NULL, @UserId
    );

    DECLARE @NiluferApartmentId int = SCOPE_IDENTITY();

    INSERT INTO PropertyImages (PropertyId, ImageUrl, IsMainImage, CreatedAt)
    VALUES
    (@NiluferApartmentId, N'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80', 1, SYSUTCDATETIME()),
    (@NiluferApartmentId, N'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80', 0, SYSUTCDATETIME());
END;

IF NOT EXISTS (SELECT 1 FROM Properties WHERE Title = N'Konyaaltı''nda Eşyalı 1+1 Kiralık Daire')
BEGIN
    INSERT INTO Properties
    (
        Title, Description, ListingType, PropertyType, Price, City, District, Neighborhood, Address,
        SquareMeters, RoomCount, BuildingAge, Floor, TotalFloors, HeatingType, IsFurnished, Dues, Deposit,
        Status, OwnerName, OwnerPhone, CreatedAt, UpdatedAt, UserId
    )
    VALUES
    (
        N'Konyaaltı''nda Eşyalı 1+1 Kiralık Daire',
        N'Sahile yürüyüş mesafesinde, tam eşyalı, site havuzlu ve kısa sürede taşınmaya uygun kiralık daire.',
        N'ForRent', N'Apartment', 28500, N'Antalya', N'Konyaaltı', N'Hurma', N'Boğaçayı çevresi',
        68, N'1+1', 4, 3, 8, N'Klima', 1, 1900, 57000,
        N'Active', N'Sinem Yalçın', N'+90 535 604 88 21', DATEADD(day, -3, SYSUTCDATETIME()), NULL, @UserId
    );

    DECLARE @KonyaaltiApartmentId int = SCOPE_IDENTITY();

    INSERT INTO PropertyImages (PropertyId, ImageUrl, IsMainImage, CreatedAt)
    VALUES
    (@KonyaaltiApartmentId, N'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80', 1, SYSUTCDATETIME()),
    (@KonyaaltiApartmentId, N'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&w=1400&q=80', 0, SYSUTCDATETIME());
END;

IF NOT EXISTS (SELECT 1 FROM Properties WHERE Title = N'Odunpazarı''nda Merkezi 2+1 Kiralık Daire')
BEGIN
    INSERT INTO Properties
    (
        Title, Description, ListingType, PropertyType, Price, City, District, Neighborhood, Address,
        SquareMeters, RoomCount, BuildingAge, Floor, TotalFloors, HeatingType, IsFurnished, Dues, Deposit,
        Status, OwnerName, OwnerPhone, CreatedAt, UpdatedAt, UserId
    )
    VALUES
    (
        N'Odunpazarı''nda Merkezi 2+1 Kiralık Daire',
        N'Tramvaya yakın, aydınlık cepheli, öğrenciler ve çalışanlar için ulaşımı güçlü kiralık daire.',
        N'ForRent', N'Apartment', 22500, N'Eskişehir', N'Odunpazarı', N'Yenikent', N'Atatürk Bulvarı bağlantısı',
        95, N'2+1', 9, 2, 6, N'Kombi', 0, 1200, 45000,
        N'Active', N'Kerem Arslan', N'+90 536 733 10 54', DATEADD(day, -2, SYSUTCDATETIME()), NULL, @UserId
    );

    DECLARE @OdunpazariApartmentId int = SCOPE_IDENTITY();

    INSERT INTO PropertyImages (PropertyId, ImageUrl, IsMainImage, CreatedAt)
    VALUES
    (@OdunpazariApartmentId, N'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80', 1, SYSUTCDATETIME()),
    (@OdunpazariApartmentId, N'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1400&q=80', 0, SYSUTCDATETIME());
END;
SELECT Id, Title, ListingType, PropertyType, City, District, Status
FROM Properties
WHERE Title IN (
    N'Etiler''de Geniş Balkonlu 3+1 Daire',
    N'Alaçatı''da Havuzlu Taş Villa',
    N'Çankaya''da Site İçinde 2+1 Daire',
    N'Nilüfer''de Yeni Nesil 4+1 Dubleks Daire',
    N'Konyaaltı''nda Eşyalı 1+1 Kiralık Daire',
    N'Odunpazarı''nda Merkezi 2+1 Kiralık Daire'
)
ORDER BY Id;