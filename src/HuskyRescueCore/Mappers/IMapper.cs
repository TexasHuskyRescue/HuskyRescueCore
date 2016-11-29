namespace HuskyRescueCore.Mappers
{
    using System.Collections.Generic;

    using Models.RescueGroupViewModels;

    public interface IMapper<in T>
    {
        List<RescueGroupAnimal> Map(T jsonObjectSourceString);
    }
}