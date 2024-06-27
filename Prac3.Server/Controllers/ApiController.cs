using Microsoft.AspNetCore.Mvc;

namespace Prac3.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ApiController : ControllerBase
    {
        readonly DataBaseManager dataBaseManager = new();

        [HttpGet()]
        [Route("Login")]
        public IActionResult Login(string login, string password)
        {
            var user = dataBaseManager.CheckUser(login, password);
            return new OkObjectResult(user);
        }

        [HttpGet()]
        [Route("Registration")]
        public IActionResult Registration(string login, string password, string fio)
        {
            try
            {
                dataBaseManager.CheckUser(login, password);
                return Conflict(new { message = "User already exist." });
            }
            catch (Exception)
            {
                dataBaseManager.AddUser(login, password, fio);
                User user = dataBaseManager.CheckUser(login, password);
                return new OkObjectResult(user);
            }
        }

        [HttpGet()]
        [Route("Users")]
        public IActionResult Users()
        {
            var users = dataBaseManager.AllUsers();
            return new OkObjectResult(users);
        }

        [HttpGet()]
        [Route("Messages")]
        public IActionResult Messages(int user_id)
        {
            var messages = dataBaseManager.GetMessages(user_id);
            return new OkObjectResult(messages);
        }

        [HttpPost]
        [Route("Send")]
        [Consumes("application/json")]
        public IActionResult Send(SendingMessage message)
        {
            dataBaseManager.AddMessage(message.From, message.To, message.Title, message.Description, DateTime.Now);
            return Ok();
        }
    }
}
