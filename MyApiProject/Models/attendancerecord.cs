using System.ComponentModel.DataAnnotations;


namespace DWTAttendance.Models
{
    public class AttendanceRecord
    {
        [Key]

        public int Id { get; set; }
        public string? userId { get; set; }


        

        public string? Date { get; set; }
        public string? DisplayDate { get; set; }

        public string? CheckIn { get; set; }
        public string? BreakOut { get; set; }
        public string? BreakIn { get; set; }
        public string? CheckOut { get; set; }
        public string? Hours { get; set; }
        public int? Type { get; set; }



    }
}