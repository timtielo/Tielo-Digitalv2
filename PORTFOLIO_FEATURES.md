 # Portfolio Dashboard Features

## Nieuwe Functies

### 1. Afbeeldingen Downloaden

Je kunt nu eenvoudig afbeeldingen uit je portfolio downloaden.

**Hoe te gebruiken:**
1. Ga naar je Portfolio pagina in het dashboard
2. Klik op "Bewerken" bij een project
3. Bij elke afbeelding (Voor/Na foto) zie je nu drie knoppen:
   - **Bewerken** - Open de afbeelding in de editor om grootte aan te passen
   - **Download** (download icoon) - Download de afbeelding naar je computer
   - **Verwijderen** (prullenbak icoon) - Verwijder de afbeelding

### 2. Afbeeldingen Bewerken

Bewerk bestaande afbeeldingen zonder ze te hoeven verwijderen en opnieuw uploaden.

**Hoe te gebruiken:**
1. Open het bewerkingsscherm van een project
2. Klik op de "Bewerken" knop onder een bestaande afbeelding
3. De afbeelding wordt automatisch geladen in de image editor
4. Pas de grootte en uitsnede aan naar wens
5. Sla op om de nieuwe versie te uploaden

**Voordelen:**
- Geen herhaald uploaden nodig
- Behoud dezelfde afbeelding met nieuwe afmetingen
- Snel en eenvoudig formaat aanpassen
- Directe preview van de wijzigingen

### 3. Dupliceer Portfolio Items

Je kunt nu eenvoudig portfolio items dupliceren met één klik op de dupliceer knop (icoon met twee overlappende vierkanten).

**Hoe te gebruiken:**
1. Ga naar je Portfolio pagina in het dashboard
2. Zoek het project dat je wilt dupliceren
3. Klik op het dupliceer icoon (naast bewerken)
4. Het gedupliceerde item krijgt automatisch "(kopie)" achter de titel
5. Alle data inclusief afbeeldingen worden gekopieerd
6. Featured status wordt automatisch uitgeschakeld voor het duplicaat

### 4. CSV Template Downloaden

Download een CSV template met voorbeelddata om te zien hoe je portfolio items moet formatteren.

**Hoe te gebruiken:**
1. Klik op de "CSV Template" knop bovenaan de Portfolio pagina
2. Een bestand `portfolio-template.csv` wordt gedownload
3. Open het bestand in Excel, Google Sheets, of een tekstverwerker
4. Bekijk de voorbeelddata en het formaat

**Template structuur:**
- `title` - Projecttitel (verplicht)
- `category` - Categorie naam (verplicht)
- `location` - Locatie van het project (verplicht)
- `date` - Datum in formaat YYYY-MM-DD (verplicht)
- `description` - Beschrijving (optioneel)
- `before_image` - URL naar voor-foto (optioneel)
- `after_image` - URL naar na-foto (optioneel)
- `featured` - "true" of "false" voor uitgelicht (optioneel, standaard false)

### 5. CSV Import

Importeer meerdere portfolio items tegelijk via een CSV bestand.

**Hoe te gebruiken:**
1. Klik op de "Importeer CSV" knop bovenaan de Portfolio pagina
2. Selecteer je CSV bestand
3. Bekijk de preview van alle items die geïmporteerd worden
4. Nieuwe categorieën worden automatisch aangemaakt en worden groen gemarkeerd
5. Selecteer/deselecteer items die je wilt importeren
6. Controleer eventuele validatiefouten (geel gemarkeerd)
7. Klik op "Importeer X item(s)" om de import uit te voeren

**Validatie:**
- Verplichte velden worden gecontroleerd
- Datum formaat moet YYYY-MM-DD zijn
- URLs voor afbeeldingen worden gevalideerd
- Ongeldige rijen worden gemarkeerd met specifieke foutmeldingen

**Automatische Categorie Aanmaak:**
Als je CSV een categorie bevat die nog niet bestaat, wordt deze automatisch aangemaakt tijdens het importeren. Dit wordt aangegeven met een groene "Nieuwe categorie" badge in de preview.

## Tips

1. **CSV Formaat**: Gebruik altijd UTF-8 encoding voor je CSV bestanden om problemen met speciale karakters te voorkomen

2. **Datums**: Gebruik het formaat YYYY-MM-DD (bijvoorbeeld: 2024-12-02)

3. **URLs**: Afbeelding URLs zijn optioneel, maar moeten wel geldig zijn als je ze invult

4. **Featured Items**: Gebruik "true" voor uitgelichte projecten, laat leeg of gebruik "false" voor normale projecten

5. **Bulk Import**: Je kunt grote aantallen portfolio items in één keer importeren. Alle geldige items worden toegevoegd, ook als sommige items fouten bevatten

6. **Categorieën**: Nieuwe categorieën worden automatisch aangemaakt, je hoeft ze niet vooraf toe te voegen

## Voorbeeld CSV Inhoud

```csv
title,category,location,date,description,before_image,after_image,featured
"Badkamer Renovatie","Renovatie","Amsterdam","2024-01-15","Complete renovatie met nieuwe tegels","Doe-dit-in-online-dashboard","","false"
"Nieuwe Keuken","Nieuwbouw","Rotterdam","2024-02-20","Moderne keuken installatie","","","true"
```

## Veelgestelde Vragen

**Q: Kan ik bestaande items updaten via CSV?**
A: Nee, de CSV import voegt alleen nieuwe items toe. Om bestaande items aan te passen, gebruik de bewerk functie.

**Q: Wat gebeurt er als ik een fout maak in de CSV?**
A: Items met fouten worden gemarkeerd in de preview en kun je deselecteren. Geldige items kunnen nog steeds geïmporteerd worden.

**Q: Hoe voeg ik afbeeldingen toe via CSV?**
A: Upload eerst je afbeeldingen naar een hosting service (bijv. je eigen website of cloud storage) en gebruik de publieke URLs in de CSV kolommen.

**Q: Moet ik categorieën eerst aanmaken?**
A: Nee! Als je een categorie gebruikt die nog niet bestaat, wordt deze automatisch aangemaakt tijdens het importeren.

**Q: Kan ik een bestaande afbeelding bewerken?**
A: Ja! Klik op de "Bewerken" knop onder de afbeelding. De image editor wordt automatisch geopend met je bestaande afbeelding.

**Q: Hoe download ik een afbeelding?**
A: Klik op het download icoon (pijl naar beneden) onder de afbeelding. Het bestand wordt direct naar je computer gedownload.
