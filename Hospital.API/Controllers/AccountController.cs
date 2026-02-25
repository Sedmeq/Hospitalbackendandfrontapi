using Hospital.Application.DTOs;
using Hospital.Application.Features.ChangePassword.Command;
using Hospital.Application.Features.ForgotPassword.Command;
using Hospital.Application.Features.GoogleAuth.Command;
using Hospital.Application.Features.Login.Command;
using Hospital.Application.Features.Logout;
using Hospital.Application.Features.Register.Command;
using Hospital.Application.Features.ResetPassword.Command;
using Hospital.Application.Interfaces;
using Hospital.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace Hospital.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IMediator _mediator;
       
        public AccountController(IMediator mediator)
        {
            _mediator = mediator;
            

        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginCommand command)
        {
            var loginResponse = await _mediator.Send(command);
            return Ok(loginResponse);
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterCommand command)
        {
            var registerResponse = await _mediator.Send(command);
            return Ok(registerResponse);
        }


        //[HttpGet("confirm-email")]
        //public async Task<IActionResult> ConfirmEmail([FromQuery] ConfirmEmailCommand command)
        //{
        //    var result = await _mediator.Send(command);
        //    if (result)
        //    {
        //        return Ok("Email confirmed successfully.");
        //    }
        //    return BadRequest("Email could not be confirmed.");
        //}

        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail([FromQuery] ConfirmEmailCommand command)
        {
            var result = await _mediator.Send(command);

            // React login URL (öz portunu yaz)
            var loginUrlSuccess = "http://localhost:5173/login?verified=true";
            var loginUrlFail = "http://localhost:5173/login?verified=false";

            if (result)
                return Redirect(loginUrlSuccess);

            return Redirect(loginUrlFail);
        }



        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordCommand command)
        {
            
            var result = await _mediator.Send(command);
            return Ok(result);
        }



        [HttpPost("google-signin")]
        public async Task<IActionResult> GoogleSignIn([FromBody] GoogleSignInRequest request)
        {
            var command = new GoogleSignInCommand { IdToken = request.IdToken };
            var result = await _mediator.Send(command);
            return Ok(result);
        }




        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await _mediator.Send(new LogoutCommand());
            return Ok("Successfully logged out.");
        }



        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordCommand command)
        {
            await _mediator.Send(command);
            // Security: həmişə eyni mesaj qaytar
            return Ok("If an account with that email exists, a password reset link has been sent.");
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok("Password has been reset successfully.");
        }

        // Əgər email link ilə GET istəyi gəlirsə (optional):
        [HttpGet("reset-password")]
        public async Task<IActionResult> ResetPasswordRedirect([FromQuery] string userId, [FromQuery] string token)
        {
            // React frontend-ə yönləndir
            var redirectUrl = $"http://localhost:5173/reset-password?userId={userId}&token={token}";
            return Redirect(redirectUrl);
        }

    }
}
