using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Eventos.Application.Contratos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
// using Eventos.Api.Helpers;
// using Eventos.API.Extensions;
using Eventos.Application.Dtos;
using Eventos.API.Extensions;
using Eventos.API.Helpers;

namespace Eventos.API.Controllers
{
  [Authorize]
  [ApiController]
  [Route("api/[controller]")]
  public class AccountController : ControllerBase
  {

    private readonly IAccountService _accountService;
    private readonly ITokenService _tokenService;
    private readonly Util _util;
    private readonly string _destino = "Perfil";

    public AccountController(IAccountService accountService, Util util, ITokenService tokenService)
    {
      _accountService = accountService;
      _tokenService = tokenService;
      _util = util;
    }
    [HttpGet("GetUser")]
    public async Task<IActionResult> GetUser()
    {
      try
      {
        var userName = User.GetUserName();
        var user = await _accountService.GetUserByUserNameAsync(userName);
        return Ok(user);
      }
      catch (Exception ex)
      {
        return this.StatusCode(StatusCodes.Status500InternalServerError,
            $"Erro ao tentar recuperar Usuário. Erro: {ex.Message}");
      }
    }

    [HttpPost("Register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register(UserDto userDto)
    {
      try
      {
        if (await _accountService.UserExists(userDto.UserName))
          return BadRequest("Usuário já existe");

        var user = await _accountService.CreateAccountAsync(userDto);
        if (user != null)
          return Ok(new
          {
            userName = user.UserName,
            PrimeroNome = user.PrimeiroNome,
            token = _tokenService.CreateToken(user).Result
          });

        return BadRequest("Usuário não criado, tente novamente mais tarde!");
      }
      catch (Exception ex)
      {
        return this.StatusCode(StatusCodes.Status500InternalServerError,
            $"Erro ao tentar Registrar Usuário. Erro: {ex.Message}");
      }
    }

    [HttpPost("Login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login(UserLoginDto userLogin)
    {
      try
      {
        var user = await _accountService.GetUserByUserNameAsync(userLogin.UserName);
        if (user == null) return Unauthorized("Usuário ou Senha está errado");

        var result = await _accountService.CheckUserPasswordAsync(user, userLogin.Password);
        if (!result.Succeeded) return Unauthorized();

        return Ok(new
        {
          userName = user.UserName,
          PrimeroNome = user.PrimeiroNome,
          token = _tokenService.CreateToken(user).Result
        });
      }
      catch (Exception ex)
      {
        return this.StatusCode(StatusCodes.Status500InternalServerError,
            $"Erro ao tentar realizar Login. Erro: {ex.Message}");
      }
    }

    [HttpPut("UpdateUser")]
    public async Task<IActionResult> UpdateUser(UserUpdateDto userUpdateDto)
    {
      try
      {
        if (userUpdateDto.UserName != User.GetUserName())
          return Unauthorized("Usuário Inválido");

        var user = await _accountService.GetUserByUserNameAsync(User.GetUserName());
        if (user == null) return Unauthorized("Usuário Inválido");

        var userReturn = await _accountService.UpdateAccount(userUpdateDto);
        if (userReturn == null) return NoContent();

        return Ok(new
        {
          userName = userReturn.UserName,
          PrimeroNome = userReturn.PrimeiroNome,
          token = _tokenService.CreateToken(userReturn).Result
        });
      }
      catch (Exception ex)
      {
        return this.StatusCode(StatusCodes.Status500InternalServerError,
            $"Erro ao tentar Atualizar Usuário. Erro: {ex.Message}");
      }
    }

    [HttpPost("upload-image")]
    public async Task<IActionResult> UploadImage()
    {
      try
      {
        var user = await _accountService.GetUserByUserNameAsync(User.GetUserName());
        if (user == null) return NoContent();

        var file = Request.Form.Files[0];
        if (file.Length > 0)
        {
          _util.DeleteImage(user.ImagemURL, _destino);
          user.ImagemURL = await _util.SaveImage(file, _destino);
        }
        var EventoRetorno = await _accountService.UpdateAccount(user);

        return Ok(EventoRetorno);
      }
      catch (Exception ex)
      {
        return this.StatusCode(StatusCodes.Status500InternalServerError,
            $"Erro ao tentar realizar upload de foto do usuário. Erro: {ex.Message}");
      }
    }
  }
}