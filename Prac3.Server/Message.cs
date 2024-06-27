namespace Prac3.Server
{
    public class Message
    {
        public int Id { get; set; }

        public required int From { get; set; }

        public required int To { get; set; }

        public required string Title { get; set; }

        public required string Description { get; set; }

        public DateTime SendingDate { get; set; }

        public bool Status { get; set; }
    }

    public class SendingMessage
    {
        public required int From { get; set; }

        public required int To { get; set; }

        public required string Title { get; set; }

        public required string Description { get; set; }
    }
}
