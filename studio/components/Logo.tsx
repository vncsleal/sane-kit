import { studioConfig } from "../config";

const en_Logo = `https://l3pden50fc.ufs.sh/f/qVxhWi9olDGtbhbcXCAgqS7DnVdjakXxi8FyRKutmBTf5bHh`
const ptbr_Logo = `https://l3pden50fc.ufs.sh/f/qVxhWi9olDGttNNBYkZ2z7WYXP0LK1R58dnMGCo93lfBqIrb`;
const isPortuguese = studioConfig.language === 'pt-BR'


export default function Logo() {
  return (
    <img 
    src={isPortuguese ? ptbr_Logo : en_Logo}
      alt="Sane Kit Logo" 
        style={{ width: '20px', height: 'auto', mixBlendMode: studioConfig.language === 'en' ? 'difference' : 'normal' }}
    />
  );
}