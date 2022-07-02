using System.Collections.Generic;

namespace Eventos.Application.Dtos
{
  public class PalestranteDto
  {
    public int Id { get; set; }
    public int UserId { get; set; }
    public UserUpdateDto User { get; set; }
    public string MiniCurriculo { get; set; }
    public IEnumerable<RedeSocialDto> RedesSociais { get; set; }
    public IEnumerable<EventoDto> Palestrantes { get; set; }

  }
}