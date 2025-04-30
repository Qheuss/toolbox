'use client';

import React from 'react';
import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { optimisationSchema } from '@/schemas/optimisation';
import TextField from '../UI/TextField';
import SubmitButton from '../UI/SubmitButton';

const Optimisation = () => {
  const { fieldContext, formContext } = createFormHookContexts();

  const { useAppForm } = createFormHook({
    fieldComponents: {
      TextField,
    },
    formComponents: {
      SubmitButton,
    },
    fieldContext,
    formContext,
  });

  const form = useAppForm({
    defaultValues: {
      username: '',
      age: 0,
      email: '',
    },
    validators: {
      onSubmit: optimisationSchema,
    },
    onSubmit: ({ value }) => {
      alert(JSON.stringify(value, null, 2));
    },
  });

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <h1>Personal Information</h1>

        <form.AppField
          name='username'
          children={(field) => (
            <>
              <field.TextField
                name={field.name}
                label={field.name}
                error={field.state.meta.errors?.[0]}
                defaultValue={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </>
          )}
        />

        <form.AppField
          name='email'
          children={(field) => (
            <>
              <field.TextField
                name={field.name}
                label={field.name}
                error={field.state.meta.errors?.[0]}
                defaultValue={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </>
          )}
        />

        <form.AppField
          name='age'
          children={(field) => (
            <>
              <field.TextField
                name={field.name}
                label={field.name}
                error={field.state.meta.errors?.[0]}
                defaultValue={field.state.value}
                type='number'
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              />
            </>
          )}
        />

        <form.AppForm>
          <form.SubmitButton
            text='Envoyer'
            disabled={form.state.isSubmitting}
          />
        </form.AppForm>
      </form>
    </>
  );
};

export default Optimisation;
