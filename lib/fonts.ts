import { Bungee, Lilita_One } from "next/font/google";
import { Righteous } from "next/font/google";
import { Comfortaa } from "next/font/google";
import { Nunito } from "next/font/google";

const bungee = Bungee({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bungee',
});

const righteous = Righteous({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-righteous',
});

const comfortaa = Comfortaa({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-comfortaa',
});

const nunito = Nunito({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-nunito',
});

const lilita = Lilita_One({
    subsets: ['latin'],
  weight: '400',
  variable: '--font-lilita',
});

export { bungee, righteous, comfortaa, nunito ,lilita};