SET NOCOUNT ON;

-- UTF-8 çalıştırma komutu:
-- powershell -ExecutionPolicy Bypass -File "backend\EstateFlow.Api\Scripts\RunSqlUtf8.ps1" -Script "backend\EstateFlow.Api\Scripts\FixNiluferPropertyImage.sql"

DECLARE @PropertyId int;
DECLARE @MainImageUrl nvarchar(700) = N'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80';
DECLARE @SecondImageUrl nvarchar(700) = N'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80';

SELECT TOP 1 @PropertyId = Id
FROM Properties
WHERE OwnerPhone = N'+90 533 284 19 63'
   OR Title = N'Nilüfer''de Yeni Nesil 4+1 Dubleks Daire';

IF @PropertyId IS NULL
BEGIN
    THROW 50002, N'Nilüfer ilanı bulunamadı.', 1;
END;

UPDATE PropertyImages
SET IsMainImage = 0
WHERE PropertyId = @PropertyId;

IF EXISTS (SELECT 1 FROM PropertyImages WHERE PropertyId = @PropertyId)
BEGIN
    UPDATE TOP (1) PropertyImages
    SET ImageUrl = @MainImageUrl,
        IsMainImage = 1
    WHERE PropertyId = @PropertyId;
END
ELSE
BEGIN
    INSERT INTO PropertyImages (PropertyId, ImageUrl, IsMainImage, CreatedAt)
    VALUES (@PropertyId, @MainImageUrl, 1, SYSUTCDATETIME());
END;

IF NOT EXISTS (SELECT 1 FROM PropertyImages WHERE PropertyId = @PropertyId AND ImageUrl = @SecondImageUrl)
BEGIN
    INSERT INTO PropertyImages (PropertyId, ImageUrl, IsMainImage, CreatedAt)
    VALUES (@PropertyId, @SecondImageUrl, 0, SYSUTCDATETIME());
END;

SELECT p.Id, p.Title, i.ImageUrl, i.IsMainImage
FROM Properties p
INNER JOIN PropertyImages i ON i.PropertyId = p.Id
WHERE p.Id = @PropertyId
ORDER BY i.IsMainImage DESC, i.Id;