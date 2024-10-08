using System.Linq;
using System.Reflection;
using Microsoft.AspNetCore.Mvc;
using NzbDrone.Core.Configuration;
using Radarr.Http.REST;
using Radarr.Http.REST.Attributes;

namespace Radarr.Api.V3.Config
{
    public abstract class ConfigController<TResource> : RestController<TResource>
        where TResource : RestResource, new()
    {
        protected readonly IConfigService _configService;

        protected ConfigController(IConfigService configService)
        {
            _configService = configService;
        }

        protected override TResource GetResourceById(int id)
        {
            return GetConfig();
        }

        [HttpGet]
        [Produces("application/json")]
        public TResource GetConfig()
        {
            var resource = ToResource(_configService);
            resource.Id = 1;

            return resource;
        }

        [RestPutById]
        [Consumes("application/json")]
        public virtual ActionResult<TResource> SaveConfig([FromBody] TResource resource)
        {
            var dictionary = resource.GetType()
                .GetProperties(BindingFlags.Instance | BindingFlags.Public)
                .ToDictionary(prop => prop.Name, prop => prop.GetValue(resource, null));

            _configService.SaveConfigDictionary(dictionary);

            return Accepted(resource.Id);
        }

        protected abstract TResource ToResource(IConfigService model);
    }
}
