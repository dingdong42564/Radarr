using System;
using FluentValidation;
using NzbDrone.Common.Extensions;
using NzbDrone.Core.Annotations;
using NzbDrone.Core.Validation;

namespace NzbDrone.Core.ImportLists.Simkl
{
    public class SimklSettingsBaseValidator<TSettings> : AbstractValidator<TSettings>
    where TSettings : SimklSettingsBase<TSettings>
    {
        public SimklSettingsBaseValidator()
        {
            RuleFor(c => c.BaseUrl).ValidRootUrl();

            RuleFor(c => c.AccessToken).NotEmpty()
                                       .OverridePropertyName("SignIn")
                                       .WithMessage("Must authenticate with Simkl");

            RuleFor(c => c.Expires).NotEmpty()
                                   .OverridePropertyName("SignIn")
                                   .WithMessage("Must authenticate with Simkl")
                                   .When(c => c.AccessToken.IsNotNullOrWhiteSpace() && c.RefreshToken.IsNotNullOrWhiteSpace());
        }
    }

    public class SimklSettingsBase<TSettings> : ImportListSettingsBase<TSettings>
        where TSettings : SimklSettingsBase<TSettings>
    {
        private static readonly SimklSettingsBaseValidator<TSettings> Validator = new ();

        public SimklSettingsBase()
        {
            SignIn = "startOAuth";
        }

        public string BaseUrl { get; set; } = "https://api.simkl.com";

        [FieldDefinition(0, Label = "Access Token", Type = FieldType.Textbox, Hidden = HiddenType.Hidden)]
        public string AccessToken { get; set; }

        [FieldDefinition(0, Label = "Refresh Token", Type = FieldType.Textbox, Hidden = HiddenType.Hidden)]
        public string RefreshToken { get; set; }

        [FieldDefinition(0, Label = "Expires", Type = FieldType.Textbox, Hidden = HiddenType.Hidden)]
        public DateTime Expires { get; set; }

        [FieldDefinition(0, Label = "Auth User", Type = FieldType.Textbox, Hidden = HiddenType.Hidden)]
        public string AuthUser { get; set; }

        [FieldDefinition(99, Label = "Authenticate with Simkl", Type = FieldType.OAuth)]
        public string SignIn { get; set; }

        public override NzbDroneValidationResult Validate()
        {
            return new NzbDroneValidationResult(Validator.Validate((TSettings)this));
        }
    }
}
