namespace EstateFlow.Api.Entities;

public enum UserRole
{
    Admin,
    Consultant
}

public enum ListingType
{
    ForSale,
    ForRent
}

public enum PropertyType
{
    Apartment,
    Villa,
    Land,
    Office,
    Shop
}

public enum PropertyStatus
{
    Active,
    Passive,
    Sold,
    Rented
}

public enum CustomerType
{
    Buyer,
    Tenant,
    PropertyOwner
}

public enum CustomerStatus
{
    New,
    Interested,
    Contacted,
    DealMade,
    Passive
}

public enum AppointmentType
{
    PropertyViewing,
    OfficeMeeting,
    PhoneCall
}

public enum AppointmentStatus
{
    Planned,
    Completed,
    Cancelled
}

public enum TaskItemStatus
{
    Todo,
    InProgress,
    Waiting,
    Done
}

public enum Priority
{
    Low,
    Medium,
    High
}

public enum DocumentType
{
    TitleDeed,
    Contract,
    IdCopy,
    AuthorizationDocument,
    ExpertiseReport
}
