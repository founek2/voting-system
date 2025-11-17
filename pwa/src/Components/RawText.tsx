import { TFunction } from "i18next";
import React from "react"
import { useTranslation } from "react-i18next";

export function RawText({ key }: { key: Parameters<TFunction<"ns1", undefined>>[0] }) {
    const { t } = useTranslation();

    if (!key) return null;

    return <>{t(key as any)}</>;
}