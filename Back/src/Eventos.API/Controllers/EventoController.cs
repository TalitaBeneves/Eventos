using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Eventos.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Eventos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventoController : ControllerBase
    {
        public IEnumerable<Evento> _evento = new Evento[] {
                new Evento() {
                    EventoId = 1,
                    Local = "Rio de Janeiro",
                    DataEvento = DateTime.Now.AddDays(2).ToString("dd/MM/yyyy"),
                    Tema = "Angular e .Net 5",
                    QtdPessoa = 250,
                    Lote = "1 lote",
                    ImagemURL = "foto.png"
                },

                new Evento() {
                    EventoId = 2,
                    Local = "Berlin",
                    DataEvento = DateTime.Now.AddDays(5).ToString("dd/MM/yyyy"),
                    Tema = "Angular",
                    QtdPessoa = 200,
                    Lote = "2 lote",
                    ImagemURL = "foto1.png"
                },
            };
        public EventoController()
        {
           
        }

        [HttpGet]
        public IEnumerable<Evento> Get()
        {
            return _evento;
        }

        [HttpGet("{id}")]
        public IEnumerable<Evento> GetById(int id)
        {
            return _evento.Where(evento => evento.EventoId == id);
        }

        [HttpPost]
        public string Post()
        {
            return "bla";
        }
        [HttpPut("{id}")]
        public string Put(int id)
        {
            return $"Put = {id}";
        }
        [HttpDelete("{id}")]
        public string Delete(int id)
        {
           return $"Delete = {id}";
        }
    }
}
