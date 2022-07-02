using System.Threading.Tasks;
using Eventos.Domain;
using Eventos.Persistence.Models;

namespace Eventos.Persistence.Contratos
{
  public interface IPalestrantePersist : IGeralPersist
  {
    Task<PageList<Palestrante>> GetAllPalestrantesAsync(PageParams pageParams, bool includeEventos = false);
    Task<Palestrante> GetPalestranteByUserIdAsync(int userId, bool includeEventos = false);
  }
}