export type ValidateResult = 'success' | 'error' | 'default' | 'warning';

export type ValidateFunction = (text?: any, required?: boolean) => ValidateResult;

export interface SelectionOption {
  id: number | string;
  value: string;
  description?: string;
  disabled?: boolean;
}

export interface FormInputControl {
  required: boolean;
  validate: ValidateFunction;
}

type FieldType =
  | 'TextInput'
  | 'SelectWithFilter'
  | 'ToggleSwitch'
  | 'MultiSelectWithFilter'
  | 'Password';

export interface Field<T> {
  keyName: keyof T;
  label: string;
  type: FieldType;
  helperText: string;
  helperTextInvalid: string;
  inputControl: FormInputControl;
  textInputType?:
    | 'number'
    | 'time'
    | 'text'
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'month'
    | 'password'
    | 'search'
    | 'tel'
    | 'url';
  options?: SelectionOption[];
  direction?: 'up' | 'down';
}

export const validateAge: ValidateFunction = (s, r) =>
  !s
    ? r
      ? 'error'
      : 'default'
    : /^[1-9]?[1-2]?[0-9]{1}$/.test(s.toString())
    ? 'success'
    : 'error';

export const validateFullName: ValidateFunction = (s, r) =>
  !s
    ? r
      ? 'error'
      : 'default'
    : /^[a-zA-Z]+ +[a-zA-Z]+[a-zA-Z ]+?$/.test(s.toString())
    ? 'success'
    : 'error';

export const validateCountry: ValidateFunction = (s, r) =>
  !s
    ? r
      ? 'error'
      : 'default'
    : /^[a-zA-Z]+[a-zA-Z ]+?$/.test(s.toString())
    ? 'success'
    : 'error';

export const validateString: ValidateFunction = (s, r) => (!s && r ? 'error' : 'success');

export const validateId: ValidateFunction = (s, r) =>
  !s ? (r ? 'error' : 'default') : /^[1-9][0-9]*$/.test(s.toString()) ? 'success' : 'error';

export const validateBoolean: ValidateFunction = (s, r) =>
  !s ? (r ? 'error' : 'success') : 'success';

export const validateUsername: ValidateFunction = (s, r) =>
  !s
    ? r
      ? 'error'
      : 'default'
    : /^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/.test(s.toString())
    ? 'success'
    : 'error';

export const validateEmail: ValidateFunction = (s, r) =>
  !s
    ? r
      ? 'error'
      : 'default'
    : /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/.test(s.toString())
    ? 'success'
    : 'error';

export const validateAtLeastOneOptionRequired: ValidateFunction = (s, r) =>
  s && (s as string[]).length >= 1 ? 'success' : r ? 'error' : 'default';

export const validatePassword: ValidateFunction = (s, r) =>
  !s
    ? r
      ? 'error'
      : 'default'
    : /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(s.toString())
    ? 'success'
    : 'error';
