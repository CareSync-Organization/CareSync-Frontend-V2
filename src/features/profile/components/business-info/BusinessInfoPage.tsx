import { useForm } from "@tanstack/react-form";
import { Mail, Phone, Save } from "lucide-react";

import { ActionButton } from "@/components/shared/ActionButton";
import { TextInput } from "@/components/shared/forms/InputField";
import { TextareaField } from "@/components/shared/forms/TextareaField";
import { getFieldError } from "@/lib/get-field-error";

import {
  companyInfoSchema,
  type CompanyInfoValues,
} from "../../schemas/companyInfo.schema";
import { CompanyInfoForm } from "./CompanyInfoForm";
import { PreferencesCard } from "./PreferencesCard";

export function BusinessInfoPage() {
  const form = useForm({
    defaultValues: {
      companyName: "TechForward Solutions",
      sector: "E-commerce",
      companyEmail: "support@techforward.com",
      contactNumber: "+1 (415) 987-6543",
      companyAddress: "",
    } satisfies CompanyInfoValues,
    onSubmit: async ({ value }) => {
      console.log("Saving business info:", value);
    },
  });

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <CompanyInfoForm>
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field
            name="companyName"
            validators={{ onChange: companyInfoSchema.shape.companyName }}
          >
            {(field) => (
              <TextInput
                name={field.name}
                label="Company Name"
                placeholder="e.g., TechForward Solutions"
                value={field.state.value}
                error={getFieldError(field.state.meta.errors)}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>
          <form.Field
            name="sector"
            validators={{ onChange: companyInfoSchema.shape.sector }}
          >
            {(field) => (
              <TextInput
                name={field.name}
                label="Sector"
                placeholder="e.g., E-commerce"
                value={field.state.value}
                error={getFieldError(field.state.meta.errors)}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>
        </div>

        <form.Field
          name="companyEmail"
          validators={{ onChange: companyInfoSchema.shape.companyEmail }}
        >
          {(field) => (
            <TextInput
              name={field.name}
              label="Company Email"
              type="email"
              placeholder="support@company.com"
              value={field.state.value}
              error={getFieldError(field.state.meta.errors)}
              startIcon={<Mail className="size-4" />}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>

        <form.Field
          name="contactNumber"
          validators={{ onChange: companyInfoSchema.shape.contactNumber }}
        >
          {(field) => (
            <TextInput
              name={field.name}
              label="Contact Number"
              type="tel"
              placeholder="+1 (415) 987-6543"
              value={field.state.value}
              error={getFieldError(field.state.meta.errors)}
              startIcon={<Phone className="size-4" />}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>

        <form.Field name="companyAddress">
          {(field) => (
            <TextareaField
              name={field.name}
              label="Company Address"
              placeholder="Enter your company address..."
              value={field.state.value ?? ""}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className="min-h-24"
            />
          )}
        </form.Field>
      </CompanyInfoForm>

      <PreferencesCard />

      <div className="flex justify-end">
        <ActionButton type="submit" startIcon={<Save className="size-4" />}>
          Save Changes
        </ActionButton>
      </div>
    </form>
  );
}
