'use client';

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

const languages = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ca', name: 'Català', flag: '🏴' },
  { code: 'gl', name: 'Galego', flag: '🏴' },
  { code: 'eu', name: 'Euskara', flag: '🏴' },
  { code: 'bg', name: 'Български', flag: '🇧🇬' },
  { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
  { code: 'da', name: 'Dansk', flag: '🇩🇰' },
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'et', name: 'Eesti', flag: '🇪🇪' },
  { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
  { code: 'ga', name: 'Gaeilge', flag: '🇮🇪' },
  { code: 'hr', name: 'Hrvatski', flag: '🇭🇷' },
  { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
  { code: 'lv', name: 'Latviešu', flag: '🇱🇻' },
  { code: 'lt', name: 'Lietuvių', flag: '🇱🇹' },
  { code: 'mt', name: 'Malti', flag: '🇲🇹' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
  { code: 'sk', name: 'Slovenčina', flag: '🇸🇰' },
  { code: 'sl', name: 'Slovenščina', flag: '🇸🇮' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' }
];

export function PublicNavbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentLang = searchParams.get('lang') || 'es';
  const currentLanguage = languages.find(lang => lang.code === currentLang);

  const handleLanguageChange = (value: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('lang', value);
    router.push(url.toString());
  };

  return (
    <div className="border-b">
      <div className="flex h-16 items-center justify-between px-2 sm:px-4 max-w-4xl mx-auto">
        <Link href="/" className="flex items-center">
          <Image 
            src="/icons/VinoVeo Logo.png" 
            alt="VinoVeo Logo" 
            width={120} 
            height={48}
            priority
            className="h-8 w-auto"
          />
        </Link>
        
        <Select value={currentLang} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[140px] sm:w-[180px] px-2 sm:px-3">
            <SelectValue>
              <span className="flex items-center gap-1 sm:gap-2">
                <span>{currentLanguage?.flag}</span>
                <span>{currentLanguage?.name}</span>
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-[300px]">
              {languages.map((lang) => (
                <SelectItem 
                  key={lang.code} 
                  value={lang.code}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3"
                >
                  <span className="flex items-center gap-1 sm:gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </span>
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 