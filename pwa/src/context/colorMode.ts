import { PaletteMode } from '@mui/material';
import { createContext } from 'react';

export type IColorModeContext = [PaletteMode, React.Dispatch<React.SetStateAction<PaletteMode>>];

const defaultContext: IColorModeContext = ['light', () => { }]
export const ColorModeContext = createContext<IColorModeContext>(defaultContext);