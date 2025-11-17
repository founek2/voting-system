import { TFunction } from "i18next";
import React from "react"
import { useTranslation } from "react-i18next";
import { LocalizedLabelKey } from "../locales/i18n";

export function RawText({ textKey }: { textKey: LocalizedLabelKey }) {
    const { t } = useTranslation();

    if (!textKey) return null;

    return <>{t(textKey)}</>;
}