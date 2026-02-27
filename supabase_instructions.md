# Supabase ir Prompts sąrankos instrukcijos

Norint, kad „Promptų“ puslapis veiktų teisingai su „Supabase“ ir „RoboHash“ API, jums reikės atlikti kelis žingsnius tiek Supabase konsolėje, tiek savo projekto aplinkoje.

## 1. Supabase sąranka (Duomenų bazė)
Atlikite šiuos žingsnius [Supabase platformoje](https://supabase.com/):

1. **Susikurkite arba atidarykite projektą**: Prisijunkite prie Supabase ir sukurkite naują projektą arba atidarykite esamą.
2. **Eikite į SQL Editor**: Kairiajame meniu pasirinkite "SQL Editor".
3. **Sukurkite lentelę**: Pridėkite naują užklausą (New Query) ir įklijuokite bei įvykdykite šį kodą:
   ```sql
   create table public.prompts (
     id uuid default gen_random_uuid() primary key,
     vardas text not null,
     prompto_tekstas text not null,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   -- Optional: allow public read/insert operations (not recommended for actual production without RLS setup, but works for prototyping)
   alter table public.prompts enable row level security;
   create policy "Allow public read" on public.prompts for select using (true);
   create policy "Allow public insert" on public.prompts for insert with check (true);
   ```
   * *Aukščiau esantis kodas sukurs **prompts** lentelę su "vardas" ir "prompto_tekstas" laukais, bei įjungs paprasčiausias taisykles, kad leistų visiems skaityti ir įkelti duomenis.*

4. **Gaukite API raktus**:
   - Eikite į Project Settings (krumpliaračio ikona) -> API.
   - Nukopijuokite **Project URL** ir **anon / public** raktą.

## 2. Projekto aplinkos kintamųjų konfigūracija
Kad projektas galėtų susijungti su Supabase:

1. Pagrindiniame `VibeHub` kataloge sukurkite failą pavadinimu `.env.local` (jei jo dar nėra).
2. Įkelkite nukopijuotus duomenis atsikiriant juos šitaip:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=jusu_supabase_project_url_cia
   NEXT_PUBLIC_SUPABASE_ANON_KEY=jusu_supabase_anon_raktas_cia
   ```
3. Restartuokite Next.js serverį terminale (suspaudus „Ctrl+C“ ir po to suvedus `npm run dev`).

## 3. RoboHash Avatarai (jokių papildomų veiksmų nereikia)
Aš jau integravau Avatarų generavimą į pačios lentelės puslapio kodą. Jį rasite pritaikytą taip, kad šalia autoriaus vardo bus dinamiškai atvaizduojamas avataras pagal:
`https://api.dicebear.com/9.x/pixel-art/svg?seed=[Autoriaus Vardas]`

Kuomet įvesite, pvz., "Jonas", sistema pati suformuos tokį atvaizdą.
Jums telieka sukelti duomenis naudotis sukurta forma.
