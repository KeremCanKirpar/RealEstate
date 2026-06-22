using EstateFlow.Api.DTOs;
using EstateFlow.Api.Entities;

namespace EstateFlow.Api.Helpers;

public static class EntityMappingExtensions
{
    public static UserResponse ToResponse(this User user)
    {
        return new UserResponse(user.Id, user.FullName, user.Email, user.Role, user.CreatedAt);
    }

    public static PropertyResponse ToResponse(this Property property)
    {
        return new PropertyResponse
        {
            Id = property.Id,
            Title = property.Title,
            Description = property.Description,
            ListingType = property.ListingType,
            PropertyType = property.PropertyType,
            Price = property.Price,
            City = property.City,
            District = property.District,
            Neighborhood = property.Neighborhood,
            Address = property.Address,
            SquareMeters = property.SquareMeters,
            RoomCount = property.RoomCount,
            BuildingAge = property.BuildingAge,
            Floor = property.Floor,
            TotalFloors = property.TotalFloors,
            HeatingType = property.HeatingType,
            IsFurnished = property.IsFurnished,
            Dues = property.Dues,
            Deposit = property.Deposit,
            Status = property.Status,
            OwnerName = property.OwnerName,
            OwnerPhone = property.OwnerPhone,
            CreatedAt = property.CreatedAt,
            UpdatedAt = property.UpdatedAt,
            UserId = property.UserId,
            ConsultantName = property.User?.FullName ?? string.Empty,
            Images = property.Images
                .OrderByDescending(image => image.IsMainImage)
                .ThenBy(image => image.Id)
                .Select(image => new PropertyImageResponse
                {
                    Id = image.Id,
                    ImageUrl = image.ImageUrl,
                    IsMainImage = image.IsMainImage,
                    CreatedAt = image.CreatedAt
                })
                .ToList()
        };
    }

    public static PublicPropertyResponse ToPublicResponse(this Property property)
    {
        return new PublicPropertyResponse
        {
            Id = property.Id,
            Title = property.Title,
            Description = property.Description,
            ListingType = property.ListingType,
            PropertyType = property.PropertyType,
            Price = property.Price,
            City = property.City,
            District = property.District,
            Neighborhood = property.Neighborhood,
            SquareMeters = property.SquareMeters,
            RoomCount = property.RoomCount,
            BuildingAge = property.BuildingAge,
            Floor = property.Floor,
            TotalFloors = property.TotalFloors,
            HeatingType = property.HeatingType,
            IsFurnished = property.IsFurnished,
            Dues = property.Dues,
            Deposit = property.Deposit,
            CreatedAt = property.CreatedAt,
            Images = property.Images
                .OrderByDescending(image => image.IsMainImage)
                .ThenBy(image => image.Id)
                .Select(image => new PublicPropertyImageResponse
                {
                    Id = image.Id,
                    ImageUrl = image.ImageUrl,
                    IsMainImage = image.IsMainImage
                })
                .ToList()
        };
    }

    public static CustomerResponse ToResponse(this Customer customer)
    {
        return new CustomerResponse
        {
            Id = customer.Id,
            FullName = customer.FullName,
            Phone = customer.Phone,
            Email = customer.Email,
            CustomerType = customer.CustomerType,
            BudgetMin = customer.BudgetMin,
            BudgetMax = customer.BudgetMax,
            DesiredPropertyType = customer.DesiredPropertyType,
            DesiredCity = customer.DesiredCity,
            DesiredDistrict = customer.DesiredDistrict,
            Notes = customer.Notes,
            Status = customer.Status,
            CreatedAt = customer.CreatedAt,
            UserId = customer.UserId,
            ConsultantName = customer.User?.FullName ?? string.Empty,
            CustomerNotes = customer.CustomerNotes
                .OrderByDescending(note => note.CreatedAt)
                .Select(note => new CustomerNoteResponse
                {
                    Id = note.Id,
                    CustomerId = note.CustomerId,
                    Note = note.Note,
                    CreatedAt = note.CreatedAt,
                    UserId = note.UserId,
                    ConsultantName = note.User?.FullName ?? string.Empty
                })
                .ToList()
        };
    }

    public static AppointmentResponse ToResponse(this Appointment appointment)
    {
        return new AppointmentResponse
        {
            Id = appointment.Id,
            CustomerId = appointment.CustomerId,
            CustomerName = appointment.Customer?.FullName ?? string.Empty,
            PropertyId = appointment.PropertyId,
            PropertyTitle = appointment.Property?.Title,
            AppointmentDate = appointment.AppointmentDate,
            AppointmentType = appointment.AppointmentType,
            Location = appointment.Location,
            Status = appointment.Status,
            Notes = appointment.Notes,
            CreatedAt = appointment.CreatedAt,
            UserId = appointment.UserId,
            ConsultantName = appointment.User?.FullName ?? string.Empty
        };
    }

    public static TaskResponse ToResponse(this TaskItem task)
    {
        return new TaskResponse
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            DueDate = task.DueDate,
            Priority = task.Priority,
            Status = task.Status,
            UserId = task.UserId,
            ConsultantName = task.User?.FullName ?? string.Empty,
            CustomerId = task.CustomerId,
            CustomerName = task.Customer?.FullName,
            PropertyId = task.PropertyId,
            PropertyTitle = task.Property?.Title,
            CreatedAt = task.CreatedAt
        };
    }

    public static DocumentResponse ToResponse(this Document document)
    {
        return new DocumentResponse
        {
            Id = document.Id,
            FileName = document.FileName,
            FileUrl = document.FileUrl,
            DocumentType = document.DocumentType,
            PropertyId = document.PropertyId,
            PropertyTitle = document.Property?.Title,
            CustomerId = document.CustomerId,
            CustomerName = document.Customer?.FullName,
            CreatedAt = document.CreatedAt,
            UserId = document.UserId,
            ConsultantName = document.User?.FullName ?? string.Empty
        };
    }
}
