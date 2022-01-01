using AutoMapper;
using Eventos.Application.Dtos;
using Eventos.Domain;

namespace Eventos.API.Helpers
{
    public class EventosProfile : Profile
    {
        public EventosProfile()
        {
          CreateMap<Evento, EventoDto>().ReverseMap();
          CreateMap<Lote, LoteDto>().ReverseMap();
          CreateMap<RedeSocial, RedeSocialDto>().ReverseMap();
          CreateMap<Palestrante, PalestranteDto>().ReverseMap();
        }
    }
}