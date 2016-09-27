using System;

namespace HuskyRescueCore.Models.AdopterViewModels.Admin
{
    public class AdoptionListViewModel
    {
        public Guid Id { get; set; }
        public Guid PersonId { get; set; }
        public AdoptionStatusViewModel Status { get; set; }
        public string AppCellPhone { get; set; }
        public string AppHomePhone { get; set; }
        public string AppEmail { get; set; }
        public string AppNameFull { get; set; }
        public string AppSpouseNameFull { get; set; }
        public DateTime DateSubmitted { get; set; }
        public string AppAddressFull { get; set; }
    }
}
