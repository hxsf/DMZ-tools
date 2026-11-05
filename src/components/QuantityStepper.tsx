import { useTranslation } from "react-i18next";
import { Icon } from "./Icon";

interface QuantityStepperProps {
  readonly name: string;
  readonly value: string;
  readonly disabled?: boolean;
  readonly onChange: (value: string) => void;
}

export function QuantityStepper({ name, value, disabled, onChange }: QuantityStepperProps) {
  const { t } = useTranslation();
  const quantity = /^\d+$/.test(value.trim()) ? Number(value) : Number.NaN;
  const valid = Number.isSafeInteger(quantity) && quantity >= 0;

  return (
    <div class="quantity-stepper">
      <button
        type="button"
        aria-label={t("common.decrease", { name })}
        disabled={disabled || !valid || quantity === 0}
        onClick={() => onChange(String(quantity - 1))}
      >
        <Icon name="minus" />
      </button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        aria-label={t("printer.countLabel", { name })}
        aria-invalid={!valid}
        disabled={disabled}
        onInput={(event) => onChange(event.currentTarget.value)}
        onBlur={(event) => {
          if (event.currentTarget.value.trim() === "") onChange("0");
        }}
      />
      <button
        type="button"
        aria-label={t("common.increase", { name })}
        disabled={disabled || !valid || quantity >= Number.MAX_SAFE_INTEGER}
        onClick={() => onChange(String(quantity + 1))}
      >
        <Icon name="plus" />
      </button>
    </div>
  );
}
