
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

using DWTAttendance.Data;
using DWTAttendance.Models;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class AttendanceController : ControllerBase
{
    private readonly AppDbContext _context;


    public AttendanceController(AppDbContext context)
    {
        _context = context;
    }


    [HttpGet]

    public async Task<ActionResult<IEnumerable<AttendanceRecord>>> GetAttendanceRecords()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var records = await _context.AttendanceRecords
            .Where(r => r.userId == userId)
            .ToListAsync();


        return Ok(records);
    }


    [HttpGet("{id}")]

    public async Task<ActionResult<AttendanceRecord>> GetAttendanceRecord(int id)
    {

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var record = await _context.AttendanceRecords
            .FirstOrDefaultAsync(r => r.Id == id && r.userId == userId);

        if (record == null)
        {
            return NotFound();
        }

        return Ok(record);
    }


    [HttpPost]

    public async Task<ActionResult> AddAttendanceRecord([FromBody] AttendanceRecord record)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        try
        {

            var now = DateTime.Now;
            string formattedDate = now.ToString("dddd MMM dd, yyyy");
            string formattedTime = now.ToString("h:mm:ss tt");
            var isoDate = now.ToString("yyyy-MM-dd");

            var existingRecord = await _context.AttendanceRecords
                .FirstOrDefaultAsync(r => r.Date == isoDate && r.userId == userId);

            if (existingRecord == null)
            {
                if (record.Type != 1)
                    return BadRequest("Please Check-In First");

                var newRecord = new AttendanceRecord
                {
                    userId = userId,
                    Date = isoDate,
                    DisplayDate = formattedDate,
                    CheckIn = formattedTime,
                    Type = 1
                };
                _context.AttendanceRecords.Add(newRecord);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Check-In recorded", record = newRecord });
            }
            else
            {

                switch (record.Type)
                {
                    case 2:
                        if (existingRecord.CheckIn == null)
                            return BadRequest("Cannot Break-Out without Check-In");
                        existingRecord.BreakOut = formattedTime;
                        break;
                    case 3:
                        if (existingRecord.BreakOut == null)
                            return BadRequest("Cannot Break-In without Break-Out");
                        existingRecord.BreakIn = formattedTime;
                        break;
                    case 4:
                        if (existingRecord.BreakIn == null)
                            return BadRequest("Cannot Check-Out without Break-In");
                        existingRecord.CheckOut = formattedTime;
                        break;
                    default:
                        return BadRequest("Invalid action type.");
                }

                await _context.SaveChangesAsync();
                return Ok(new { message = "Action recorded", record = existingRecord });


            }


        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }




    [HttpDelete("{id}")]

    public async Task<ActionResult> DeleteAttendanceRecord(int id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var record = await _context.AttendanceRecords.FirstOrDefaultAsync(r => r.Id == id && r.userId == userId);
        if (record == null)
        {
            return NotFound();
        }

        _context.AttendanceRecords.Remove(record);
        await _context.SaveChangesAsync();

        return Ok("Successful Remove");
    }


    [HttpPut("{id}")]

    public async Task<IActionResult> UpdateAttendanceRecord(int id, [FromBody] AttendanceRecord record)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        try
        {

            var existingRecord = await _context.AttendanceRecords
                .FirstOrDefaultAsync(r => r.Id == id && r.userId == userId);

            if (existingRecord == null)
            {
                return NotFound("No record found with this ID. Please Check-In first.");
            }


            if (!string.IsNullOrEmpty(record.BreakOut) && string.IsNullOrEmpty(existingRecord.CheckIn))
            {
                return BadRequest("Cannot add Break-Out without Check-In");
            }

            if (!string.IsNullOrEmpty(record.BreakIn) && string.IsNullOrEmpty(existingRecord.BreakOut))
            {
                return BadRequest("Cannot add Break-In without Break-Out");
            }

            if (!string.IsNullOrEmpty(record.CheckOut) && string.IsNullOrEmpty(existingRecord.BreakIn))
            {
                return BadRequest("Cannot add Check-Out without Break-In");
            }


            if (!string.IsNullOrEmpty(record.BreakOut))
                existingRecord.BreakOut = record.BreakOut;

            if (!string.IsNullOrEmpty(record.BreakIn))
                existingRecord.BreakIn = record.BreakIn;

            if (!string.IsNullOrEmpty(record.CheckOut))
                existingRecord.CheckOut = record.CheckOut;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Attendance record updated successfully!",
                record = existingRecord
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}