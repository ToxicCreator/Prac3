using Npgsql;
using System.Data;

namespace Prac3.Server
{
    public class DataBaseManager
    {
        readonly string postgresConnnectionString = "SERVER=localhost; PORT=5432; DATABASE=PKIS; USER ID=postgres; PASSWORD=postgres";

        public User CheckUser(string login, string password)
        {
            using NpgsqlConnection connection = new(postgresConnnectionString);
            connection.Open();
            using var command = new NpgsqlCommand
            {
                Connection = connection,
                CommandType = CommandType.Text,
                CommandText = "SELECT * FROM users WHERE login=$1 AND password=$2;",
                Parameters =
                {
                    new() { Value = login },
                    new() { Value = password }
                }
            };
            using var reader = command.ExecuteReader();
            if (!reader.HasRows)
            {
                throw new Exception("Пользователь не найден");
            }
            reader.Read();
            User user = new()
            {
                Id = (int) reader.GetValue(0),
                Login = reader.GetValue(1)?.ToString() ?? String.Empty,
                //Password = reader.GetValue(2)?.ToString() ?? String.Empty,
                FIO = reader.GetValue(3)?.ToString() ?? String.Empty
            };
            return user;
        }

        public void AddUser(string login, string password, string fio)
        {
            using NpgsqlConnection connection = new(postgresConnnectionString);
            connection.Open();
            using var command = new NpgsqlCommand
            {
                Connection = connection,
                CommandType = CommandType.Text,
                CommandText = "INSERT INTO users (login, password, fio) VALUES ($1, $2, $3);",
                Parameters =
                {
                    new() { Value = login },
                    new() { Value = password },
                    new() { Value = fio }
                }
            };
            command.ExecuteNonQuery();
        }

        public User[] AllUsers()
        {
            using NpgsqlConnection connection = new(postgresConnnectionString);
            connection.Open();
            using var command = new NpgsqlCommand
            {
                Connection = connection,
                CommandType = CommandType.Text,
                CommandText = "SELECT id, fio FROM users;"
            };
            using var reader = command.ExecuteReader();
            List<User> users = [];
            while (reader.Read())
            {
                User user = new()
                {
                    Id = (int)reader.GetValue(0),
                    FIO = reader.GetValue(1)?.ToString() ?? String.Empty
                };
                users.Add(user);
            }
            return [.. users];
        }

        public Message[] GetMessages(int user_id)
        {
            using NpgsqlConnection connection = new(postgresConnnectionString);
            connection.Open();
            using var command = new NpgsqlCommand
            {
                Connection = connection,
                CommandType = CommandType.Text,
                CommandText = "SELECT * FROM messages WHERE to_id=$1 ORDER BY sending_date;",
                Parameters =
                {
                    new() { Value = user_id }
                }
            };
            using var reader = command.ExecuteReader();
            List<Message> messages = [];
            while (reader.Read())
            {
                Message message = new()
                {
                    Id = (int)reader.GetValue(0),
                    From = (int)reader.GetValue(1),
                    To = (int)reader.GetValue(2),
                    Title = reader.GetValue(3)?.ToString() ?? String.Empty,
                    Description = reader.GetValue(4)?.ToString() ?? String.Empty,
                    SendingDate = (DateTime)reader.GetValue(5),
                    Status = (bool)reader.GetValue(6)
                };
                messages.Add(message);
            }
            return [.. messages];
        }

        public void AddMessage(int from, int to, string title, string description, DateTime sending_date)
        {
            using NpgsqlConnection connection = new(postgresConnnectionString);
            connection.Open();
            using var command = new NpgsqlCommand
            {
                Connection = connection,
                CommandType = CommandType.Text,
                CommandText = "INSERT INTO messages (from_id, to_id, title, description, sending_date) VALUES ($1, $2, $3, $4, $5);",
                Parameters =
                {
                    new() { Value = from },
                    new() { Value = to },
                    new() { Value = title },
                    new() { Value = description },
                    new() { Value = sending_date }
                }
            };
            command.ExecuteNonQuery();
        }
    }
}
