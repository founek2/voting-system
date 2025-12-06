import enNS1 from "./en/ns1.json";
import csNS1 from "./cs/ns1.json";
import i18n, { ParseKeys, TFunctionStrict } from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';

export const defaultNS = "ns1";
export const resources = {
    en: {
        ns1: enNS1,
    },
    cs: {
        ns1: csNS1,
    },
} as const;

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        ns: ["ns1"],
        defaultNS,
        resources,
    });

export type NS = ['ns1']
export type DefaultNS = 'ns1';

export type LocalizedLabelKey = Exclude<Parameters<TFunctionStrict<DefaultNS>>[0], null | undefined>;