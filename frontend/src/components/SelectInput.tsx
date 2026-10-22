//Input para seleção de gênero e ordenação por data
type SelectOption = {
  value: string;
  label: string;
};

type SelectInputProps = {
  id: string;
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function SelectInput({
  id,
  label,
  value,
  options,
  onChange,
  disabled = false,
}: SelectInputProps) {
  return (
    <label
      className="flex min-w-0 flex-1 flex-col items-stretch gap-1 text-left text-xs text-muted sm:w-auto sm:flex-none sm:flex-row sm:items-center sm:gap-2 sm:text-sm"
      htmlFor={id}
    >
      <span>{label}</span>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="w-full min-w-0 flex-1 rounded-md border border-line bg-surface px-1.5 py-2 text-xs text-cream outline-none focus:border-accent disabled:opacity-60 sm:w-auto sm:flex-none sm:px-3 sm:text-sm"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
