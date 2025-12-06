import React from 'react';
import { Typography, Link as MuiLink, TypographyProps } from '@mui/material';
import { useTranslation } from 'react-i18next';

export function LanguageButton(props: TypographyProps) {
    const { t, i18n } = useTranslation()
    const changeLanguageTo = i18n.language === 'cs' ? 'en' : 'cs';

    return <Typography sx={{ display: "flex", alignItems: 'center' }} {...props}>
        <MuiLink href={`/?lng=${changeLanguageTo}`} onClick={e => {
            e.preventDefault();
            i18n.changeLanguage(changeLanguageTo);
        }} underline="none">
            {t('footer.language')}
        </MuiLink>
    </Typography>
}