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

const languages = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'ca', name: 'Català' },
  { code: 'gl', name: 'Galego' },
  { code: 'eu', name: 'Euskara' },
  { code: 'bg', name: 'Български' },
  { code: 'cs', name: 'Čeština' },
  { code: 'da', name: 'Dansk' },
  { code: 'el', name: 'Ελληνικά' },
  { code: 'et', name: 'Eesti' },
  { code: 'fi', name: 'Suomi' },
  { code: 'ga', name: 'Gaeilge' },
  { code: 'hr', name: 'Hrvatski' },
  { code: 'hu', name: 'Magyar' },
  { code: 'lv', name: 'Latviešu' },
  { code: 'lt', name: 'Lietuvių' },
  { code: 'mt', name: 'Malti' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'pl', name: 'Polski' },
  { code: 'pt', name: 'Português' },
  { code: 'ro', name: 'Română' },
  { code: 'sk', name: 'Slovenčina' },
  { code: 'sl', name: 'Slovenščina' },
  { code: 'sv', name: 'Svenska' }
];

export function PublicNavbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentLang = searchParams.get('lang') || 'es';

  const handleLanguageChange = (value: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('lang', value);
    router.push(url.toString());
  };

  return (
    <div className="border-b">
      <div className="flex h-16 items-center justify-between px-4 max-w-4xl mx-auto">
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
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 