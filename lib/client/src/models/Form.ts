export type FormHandles = {
  submitForm: () => Promise<void>;
  fallback?: NonNullable<React.ReactNode>;
};
