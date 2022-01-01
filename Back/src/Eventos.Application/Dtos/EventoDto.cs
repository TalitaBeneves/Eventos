using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Eventos.Application.Dtos
{
    public class EventoDto
    {
        public int Id { get; set; }
        public string Local { get; set; }
        public string DataEvento { get; set; }
        
        [Required,
         MaxLength(50, ErrorMessage = "{0} ddeve ter no máximo 50 caracteres.")]
        public string Tema { get; set; }

        [Range(1, 12000)]
        public int QtdPessoa { get; set; }

         [RegularExpression(@".*\.(gif|jpe?g|bmp|png)$",
            ErrorMessage = "Não é uma imagem válida. (gif, jpg, jpeg, bmp ou png)")]
        public string ImagemURL { get; set; }

        [Required]
        public string Telefone { get; set; }
        
        [EmailAddress]
        public string Email { get; set; }

        public IEnumerable<LoteDto> Lotes { get; set; }
        public IEnumerable<RedeSocialDto> RedesSociais { get; set; }
        public IEnumerable<PalestranteDto> Palestrantes { get; set; }
    }
}