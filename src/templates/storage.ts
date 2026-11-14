import { safeGetStorage, safeSetStorage } from "../lib/storage";
import { MezgebTemplate } from "./types";

const MY_TEMPLATES_KEY = "mezgeb_my_templates";
const BUILDER_DRAFT_KEY = "mezgeb_builder_draft_v1";

export function loadMyTemplates(): { templates: MezgebTemplate[]; blocked: boolean } {
  const res = safeGetStorage(MY_TEMPLATES_KEY);
  if (!res.value) {
    return { templates: [], blocked: res.blocked };
  }
  try {
    const parsed = JSON.parse(res.value);
    return {
      templates: Array.isArray(parsed) ? (parsed as MezgebTemplate[]) : [],
      blocked: res.blocked,
    };
  } catch {
    return { templates: [], blocked: res.blocked };
  }
}

export function saveAllMyTemplates(templates: MezgebTemplate[]): { blocked: boolean } {
  return safeSetStorage(MY_TEMPLATES_KEY, JSON.stringify(templates));
}

export function saveToMyTemplates(template: MezgebTemplate): {
  templates: MezgebTemplate[];
  blocked: boolean;
} {
  const { templates } = loadMyTemplates();
  const stamped: MezgebTemplate = {
    ...structuredClone(template),
    category: template.category ?? "custom",
    tested: false,
    version: (template.version ?? 0) + 1,
    updatedAt: new Date().toISOString(),
  };

  const idx = templates.findIndex((t) => t.id === stamped.id);
  const next = idx >= 0
    ? templates.map((t, i) => (i === idx ? stamped : t))
    : [stamped, ...templates];

  const { blocked } = saveAllMyTemplates(next);
  return { templates: next, blocked };
}

export function deleteFromMyTemplates(id: string): {
  templates: MezgebTemplate[];
  blocked: boolean;
} {
  const { templates } = loadMyTemplates();
  const next = templates.filter((t) => t.id !== id);
  const { blocked } = saveAllMyTemplates(next);
  return { templates: next, blocked };
}

export function renameMyTemplate(
  id: string,
  name: { en: string; am: string }
): { templates: MezgebTemplate[]; blocked: boolean } {
  const { templates } = loadMyTemplates();
  const next = templates.map((t) =>
    t.id === id
      ? {
          ...t,
          name: { en: name.en.trim() || t.name.en, am: name.am.trim() || t.name.am },
          updatedAt: new Date().toISOString(),
        }
      : t
  );
  const { blocked } = saveAllMyTemplates(next);
  return { templates: next, blocked };
}

export function duplicateMyTemplate(template: MezgebTemplate): {
  copy: MezgebTemplate;
  templates: MezgebTemplate[];
  blocked: boolean;
} {
  const copy: MezgebTemplate = {
    ...structuredClone(template),
    id: `${template.id.replace(/-copy.*$/, "")}-copy-${Date.now().toString(36).slice(-4)}`,
    name: {
      en: `${template.name.en} (copy)`,
      am: `${template.name.am} (ቅጂ)`,
    },
    category: "custom",
    tested: false,
    version: 1,
    updatedAt: new Date().toISOString(),
  };
  const { templates } = loadMyTemplates();
  const next = [copy, ...templates];
  const { blocked } = saveAllMyTemplates(next);
  return { copy, templates: next, blocked };
}

export function loadBuilderDraft(): { template: MezgebTemplate | null; blocked: boolean } {
  const res = safeGetStorage(BUILDER_DRAFT_KEY);
  if (!res.value) return { template: null, blocked: res.blocked };
  try {
    const parsed = JSON.parse(res.value) as MezgebTemplate;
    if (parsed && Array.isArray(parsed.questions)) {
      return { template: parsed, blocked: res.blocked };
    }
    return { template: null, blocked: res.blocked };
  } catch {
    return { template: null, blocked: res.blocked };
  }
}

export function saveBuilderDraft(template: MezgebTemplate | null): { blocked: boolean } {
  if (!template) {
    return safeSetStorage(BUILDER_DRAFT_KEY, "");
  }
  return safeSetStorage(BUILDER_DRAFT_KEY, JSON.stringify(template));
}
