import React from "react";
import { useI18n } from "../../i18n";
import { Button, Dialog, Field } from "../../ui";

/** One import dialog used by the gallery, the start screen and the builder menu. */
export function ImportTemplateDialog({
  open,
  onClose,
  text,
  onTextChange,
  error,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  text: string;
  onTextChange: (v: string) => void;
  error: string | null;
  onSubmit: () => void;
}) {
  const { t } = useI18n();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t("builderImportJsonTitle")}
      maxWidthClass="max-w-lg"
      closeLabel={t("closeButton")}
      primaryAction={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t("cancelButton")}
          </Button>
          <Button variant="primary" disabled={!text.trim()} onClick={onSubmit}>
            {t("builderImportJsonBtn")}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <p className="text-sm text-[var(--muted)]">{t("builderImportJsonDesc")}</p>
        <div className="space-y-1.5">
          <label htmlFor="mz-import-file" className="block text-[15px] font-medium text-[var(--ink)]">
            {t("builderImportJsonFileLabel")}
          </label>
          <input
            id="mz-import-file"
            type="file"
            accept=".json,application/json"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => onTextChange(typeof reader.result === "string" ? reader.result : "");
              reader.readAsText(file);
            }}
            className="block w-full text-sm text-[var(--muted)] file:mr-3 file:min-h-[40px] file:px-4 file:rounded-[10px] file:border file:border-[var(--line-strong)] file:bg-[var(--paper)] file:text-[var(--ink)] file:font-medium file:cursor-pointer"
          />
        </div>
        <Field
          id="mz-import-text"
          label={t("builderImportJsonTextLabel")}
          as="textarea"
          error={error ?? undefined}
          textareaProps={{
            rows: 7,
            value: text,
            onChange: (e) => onTextChange(e.target.value),
            spellCheck: false,
            style: { fontFamily: "var(--font-mono)", fontSize: 13 },
          }}
        />
      </div>
    </Dialog>
  );
}
