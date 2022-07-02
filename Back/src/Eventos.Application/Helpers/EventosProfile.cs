using AutoMapper;
using Eventos.Application.Dtos;
using Eventos.Domain;
using Eventos.Domain.Identity;
using Eventos.Persistence.Models;

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

          CreateMap<User, UserDto>().ReverseMap();
          CreateMap<User, UserLoginDto>().ReverseMap();
          CreateMap<User, UserUpdateDto>().ReverseMap();
        }
    }
}