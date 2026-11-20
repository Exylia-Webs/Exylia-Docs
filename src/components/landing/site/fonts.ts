import { Archivo, Instrument_Serif, JetBrains_Mono } from "next/font/google";

const sans = Archivo({ subsets: ["latin", "latin-ext"], axes: ["wdth"], variable: "--xs-sans", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin", "latin-ext"], weight: "400", style: ["normal", "italic"], variable: "--xs-serif", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--xs-mono", display: "swap" });

export const xsFonts = `${sans.variable} ${serif.variable} ${mono.variable}`;
