import { useCallback } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import Select from "react-select";
import { skillGradeData } from "../../core/meding-pod-data/common";
import { createTalisman, Talisman, talismanNames } from "../../core/mhr";

const levels = [
  { value: 1, label: 1 },
  { value: 2, label: 2 },
  { value: 3, label: 3 },
  { value: 4, label: 4 },
];
const slots = [
  { value: 0, label: "-" },
  { value: 1, label: "Lv1" },
  { value: 2, label: "Lv2" },
  { value: 3, label: "Lv3" },
];

type Props = {
  onSubmit?: (talisman: Talisman) => void;
};

export default function TalismanForm({ onSubmit: onSubmitSuper }: Props) {
  const { methods, values, onSubmit } = useTalismanForm(onSubmitSuper);

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit}>
        <div>
          <label>
            <span>種類</span>
            <MySelect
              name="name"
              required
              options={talismanNames.map((name) => ({
                value: name,
                label: name,
              }))}
              defaultValue="神嵐の護石"
            />
          </label>
        </div>
        <div>
          <label>
            <span>スキル1</span>
            <MySelect
              name="skill1"
              required
              options={Array.from(skillGradeData.keys()).map((name) => ({
                value: name,
                label: name,
              }))}
            />
          </label>
          <label>
            <span>レベル</span>
            <MySelect
              name="level1"
              required={Boolean(values.skill1)}
              options={levels}
            />
          </label>
        </div>
        <div>
          <label>
            <span>スキル2</span>
            <MySelect
              name="skill2"
              disabled={!values.skill1}
              options={["-", ...Array.from(skillGradeData.keys())].map(
                (name) => ({
                  value: name === "-" ? "" : name,
                  label: name,
                })
              )}
            />
          </label>
          <label>
            <span>レベル</span>
            <MySelect
              name="level2"
              required={values.skill2 && values.skill2?.value !== "-"}
              disabled={!values.skill1 || values.skill2?.value === "-"}
              options={levels}
            />
          </label>
        </div>
        <div>
          <label>
            <span>スロット1</span>
            <MySelect name="slot1" options={slots} />
          </label>
          <label>
            <span>スロット2</span>
            <MySelect
              name="slot2"
              disabled={!values.slot1?.value}
              options={slots}
            />
          </label>
          <label>
            <span>スロット3</span>
            <MySelect
              name="slot3"
              disabled={!values.slot1?.value || !values.slot2?.value}
              options={slots}
            />
          </label>
        </div>
        <button>登録</button>
      </form>
    </FormProvider>
  );
}

function MySelect({
  name,
  required,
  disabled,
  options,
  defaultValue,
}: {
  name: string;
  required?: boolean;
  disabled?: boolean;
  options?: Array<{ value: string | number; label: string | number }>;
  defaultValue?: string;
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      defaultValue={defaultValue}
      render={({ field }) => (
        <Select
          {...field}
          options={options}
          isDisabled={disabled}
          defaultInputValue={defaultValue}
        />
      )}
    />
  );
}

function useTalismanForm(onSubmit: Props["onSubmit"]) {
  const methods = useForm();
  const { handleSubmit, watch } = methods;
  const values = watch();

  const handler = useCallback((data) => {
    try {
      const talisman = createTalisman({
        name: data.name?.value,
        skill1: data.skill1?.value,
        level1: data.level1?.value,
        skill2: data.skill2?.value || undefined,
        level2: data.skill2?.value
          ? data.level2?.value || undefined
          : undefined,
        slot1: data.slot1?.value,
        slot2: data.slot1?.value ? data.slot2?.value : undefined,
        slot3:
          data.slot1?.value && data.slot2?.value
            ? data.slot3?.value
            : undefined,
      });
      onSubmit?.(talisman);
    } catch (e) {
      console.warn(e);
    }
  }, []);

  return { methods, values, onSubmit: handleSubmit(handler) };
}
