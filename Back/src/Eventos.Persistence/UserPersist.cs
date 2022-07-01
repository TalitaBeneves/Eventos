using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Eventos.Domain.Identity;
using Eventos.Persistence.Contextos;
using Eventos.Persistence.Contratos;
using Microsoft.EntityFrameworkCore;

namespace Eventos.Persistence
{
  public class UserPersist : GeralPersist, IUserPersist
  {
    private readonly EventosContext _context;
    public UserPersist(EventosContext context) : base(context)
    {
      _context = context;
    }
    public async Task<IEnumerable<User>> GetUsersAsync()
    {
      return await _context.Users.ToListAsync();
    }

    public async Task<User> GetUserByIdAsync(int id)
    {
      return await _context.Users.FindAsync(id);
    }

    public async Task<User> GetUserByUserNameAsync(string userName)
    {
      return await _context.Users.SingleOrDefaultAsync(user => user.UserName == userName.ToLower());
    }

  }
}