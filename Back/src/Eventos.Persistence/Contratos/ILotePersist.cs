using System.Threading.Tasks;
using Eventos.Domain;

namespace Eventos.Persistence.Contratos
{
  public interface ILotePersist
  {
    Task<Lote[]> GetLotesByEventoIdAsync(int eventoId);
  
    /// <param name="eventoId">Código chave da tabela evento</param>
    /// <param name="id">Código chave da tabela do meu lote</param>
    /// <returns>Apenas 1 lote</returns>
    Task<Lote> GetLoteByIdsAsync(int eventoId, int id);
  }
}