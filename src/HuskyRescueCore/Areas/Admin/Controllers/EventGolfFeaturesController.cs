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
    public class EventGolfFeaturesController : Controller
    {
        private readonly ApplicationDbContext _context;

        public EventGolfFeaturesController(ApplicationDbContext context)
        {
            _context = context;    
        }

        // GET: EventGolfFeatures
        public async Task<IActionResult> Index()
        {
            var applicationDbContext = _context.EventGolfFeatures.Include(e => e.EventGolf);
            return View(await applicationDbContext.ToListAsync());
        }

        // GET: EventGolfFeatures/Details/5
        public async Task<IActionResult> Details(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var eventGolfFeatures = await _context.EventGolfFeatures.FirstAsync(m => m.EventGolfId == id);
            if (eventGolfFeatures == null)
            {
                return NotFound();
            }

            return View(eventGolfFeatures);
        }

        // GET: EventGolfFeatures/Create
        public IActionResult Create()
        {
            ViewData["EventGolfId"] = new SelectList(_context.EventGolf, "Id", "TypeOfEvent");
            return View();
        }

        // POST: EventGolfFeatures/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("EventGolfId,Id,Feature")] EventGolfFeatures eventGolfFeatures)
        {
            if (ModelState.IsValid)
            {
                eventGolfFeatures.EventGolfId = Guid.NewGuid();
                _context.Add(eventGolfFeatures);
                await _context.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            ViewData["EventGolfId"] = new SelectList(_context.EventGolf, "Id", "TypeOfEvent", eventGolfFeatures.EventGolfId);
            return View(eventGolfFeatures);
        }

        // GET: EventGolfFeatures/Edit/5
        public async Task<IActionResult> Edit(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var eventGolfFeatures = await _context.EventGolfFeatures.FirstAsync(m => m.EventGolfId == id);
            if (eventGolfFeatures == null)
            {
                return NotFound();
            }
            ViewData["EventGolfId"] = new SelectList(_context.EventGolf, "Id", "TypeOfEvent", eventGolfFeatures.EventGolfId);
            return View(eventGolfFeatures);
        }

        // POST: EventGolfFeatures/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Guid id, [Bind("EventGolfId,Id,Feature")] EventGolfFeatures eventGolfFeatures)
        {
            if (id != eventGolfFeatures.EventGolfId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(eventGolfFeatures);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!EventGolfFeaturesExists(eventGolfFeatures.EventGolfId))
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
            ViewData["EventGolfId"] = new SelectList(_context.EventGolf, "Id", "TypeOfEvent", eventGolfFeatures.EventGolfId);
            return View(eventGolfFeatures);
        }

        // GET: EventGolfFeatures/Delete/5
        public async Task<IActionResult> Delete(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var eventGolfFeatures = await _context.EventGolfFeatures.FirstAsync(m => m.EventGolfId == id);
            if (eventGolfFeatures == null)
            {
                return NotFound();
            }

            return View(eventGolfFeatures);
        }

        // POST: EventGolfFeatures/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(Guid id)
        {
            var eventGolfFeatures = await _context.EventGolfFeatures.FirstAsync(m => m.EventGolfId == id);
            _context.EventGolfFeatures.Remove(eventGolfFeatures);
            await _context.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        private bool EventGolfFeaturesExists(Guid id)
        {
            return _context.EventGolfFeatures.Any(e => e.EventGolfId == id);
        }
    }
}
