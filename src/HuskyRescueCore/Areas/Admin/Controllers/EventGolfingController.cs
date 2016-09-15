using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using HuskyRescueCore.Data;
using HuskyRescueCore.Models;

namespace HuskyRescueCore.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class EventGolfingController : Controller
    {
        private readonly ApplicationDbContext _context;

        public EventGolfingController(ApplicationDbContext context)
        {
            _context = context;    
        }

        // GET: EventGolves
        public async Task<IActionResult> Index()
        {
            var applicationDbContext = _context.EventGolf.Include(e => e.Business).Include(e => e.EventType);
            return View(await applicationDbContext.ToListAsync());
        }

        // GET: EventGolves/Details/5
        public async Task<IActionResult> Details(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var eventGolf = await _context.EventGolf.SingleOrDefaultAsync(m => m.Id == id);
            if (eventGolf == null)
            {
                return NotFound();
            }

            return View(eventGolf);
        }

        // GET: EventGolves/Create
        public IActionResult Create()
        {
            ViewData["BusinessId"] = new SelectList(_context.Business, "Id", "EIN");
            ViewData["EventTypeId"] = new SelectList(_context.EventType, "Id", "Code");
            return View();
        }

        // POST: EventGolves/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,AreTicketsSold,BannerImagePath,BusinessId,DateAdded,DateDeleted,DateOfEvent,DateUpdated,EndTime,EventTypeId,IsActive,IsDeleted,Name,Notes,PublicDescription,StartTime,TicketPriceDiscount,TicketPriceFull,BanquetStartTime,CostBanquet,CostFoursome,CostSingle,GolfingStartTime,RegistrationStartTime,TournamentType,WelcomeMessage")] EventGolf eventGolf)
        {
            if (ModelState.IsValid)
            {
                eventGolf.Id = Guid.NewGuid();
                _context.Add(eventGolf);
                await _context.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            ViewData["BusinessId"] = new SelectList(_context.Business, "Id", "EIN", eventGolf.BusinessId);
            ViewData["EventTypeId"] = new SelectList(_context.EventType, "Id", "Code", eventGolf.EventTypeId);
            return View(eventGolf);
        }

        // GET: EventGolves/Edit/5
        public async Task<IActionResult> Edit(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var eventGolf = await _context.EventGolf.SingleOrDefaultAsync(m => m.Id == id);
            if (eventGolf == null)
            {
                return NotFound();
            }
            ViewData["BusinessId"] = new SelectList(_context.Business, "Id", "EIN", eventGolf.BusinessId);
            ViewData["EventTypeId"] = new SelectList(_context.EventType, "Id", "Code", eventGolf.EventTypeId);
            return View(eventGolf);
        }

        // POST: EventGolves/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Guid id, [Bind("Id,AreTicketsSold,BannerImagePath,BusinessId,DateAdded,DateDeleted,DateOfEvent,DateUpdated,EndTime,EventTypeId,IsActive,IsDeleted,Name,Notes,PublicDescription,StartTime,TicketPriceDiscount,TicketPriceFull,BanquetStartTime,CostBanquet,CostFoursome,CostSingle,GolfingStartTime,RegistrationStartTime,TournamentType,WelcomeMessage")] EventGolf eventGolf)
        {
            if (id != eventGolf.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(eventGolf);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!EventGolfExists(eventGolf.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction("Index");
            }
            ViewData["BusinessId"] = new SelectList(_context.Business, "Id", "EIN", eventGolf.BusinessId);
            ViewData["EventTypeId"] = new SelectList(_context.EventType, "Id", "Code", eventGolf.EventTypeId);
            return View(eventGolf);
        }

        // GET: EventGolves/Delete/5
        public async Task<IActionResult> Delete(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var eventGolf = await _context.EventGolf.SingleOrDefaultAsync(m => m.Id == id);
            if (eventGolf == null)
            {
                return NotFound();
            }

            return View(eventGolf);
        }

        // POST: EventGolves/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(Guid id)
        {
            var eventGolf = await _context.EventGolf.SingleOrDefaultAsync(m => m.Id == id);
            _context.EventGolf.Remove(eventGolf);
            await _context.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        private bool EventGolfExists(Guid id)
        {
            return _context.EventGolf.Any(e => e.Id == id);
        }
    }
}
