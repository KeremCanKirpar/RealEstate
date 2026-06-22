using System.Linq.Expressions;
using EstateFlow.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace EstateFlow.Api.Repositories;

public class Repository<T>(ApplicationDbContext db) : IRepository<T> where T : class
{
    public IQueryable<T> Query()
    {
        return db.Set<T>().AsQueryable();
    }

    public Task<T?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return db.Set<T>().FindAsync([id], cancellationToken).AsTask();
    }

    public async Task<IReadOnlyList<T>> ListAsync(Expression<Func<T, bool>>? predicate = null, CancellationToken cancellationToken = default)
    {
        var query = db.Set<T>().AsQueryable();
        if (predicate is not null)
        {
            query = query.Where(predicate);
        }

        return await query.ToListAsync(cancellationToken);
    }

    public async Task AddAsync(T entity, CancellationToken cancellationToken = default)
    {
        await db.Set<T>().AddAsync(entity, cancellationToken);
    }

    public void Remove(T entity)
    {
        db.Set<T>().Remove(entity);
    }

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return db.SaveChangesAsync(cancellationToken);
    }
}
