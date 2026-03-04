/**
 * OB -- German Content Bundle
 * ============================
 * All German content embedded as JS for file:// compatibility.
 * Loaded before content.js. When present, content.js uses this
 * instead of fetch(). Regenerate by copying JSON file contents here.
 */
(function () {
  "use strict";
  var OB = window.OB = window.OB || {};

  OB._bundleDe = {
    "course.json": {
  "id": "wc-ocp1",
  "title": "Windchill: Optionen und konfigurierbare Produkte 1",
  "description": "Lernen Sie geschäftliche Ansätze für konfigurierbare Produkte kennen, erkunden Sie die Terminologie von Optionen und Varianten, untersuchen Sie Regeln und meistern Sie Optionssätze.",
  "prerequisite": "Windchill: Stücklistenumstrukturierung",
  "modules": [
    {
      "id": "m1",
      "title": "Einführung in konfigurierbare Produkte",
      "description": "Untersuchen Sie Geschäftsstrategien für Produktvariabilität, Produktplattformen, Produktvarianten und Windchill-Konfigurationsansätze.",
      "estimatedMinutes": 55,
      "topicCount": 7,
      "exerciseTopicStart": 5,
      "contentFile": "modules/m1-configurable-products.json",
      "quizFile": "quizzes/q1-configurable-products.json"
    },
    {
      "id": "m2",
      "title": "Windchill-Optionen und -Varianten überprüfen",
      "description": "Untersuchen Sie die Terminologie von Optionen und Varianten, besprechen Sie Optionen und Auswahlmöglichkeiten, erkunden Sie Präferenzen und erstellen Sie konfigurierbare Module.",
      "estimatedMinutes": 25,
      "topicCount": 5,
      "contentFile": "modules/m2-options-and-variants.json",
      "quizFile": "quizzes/q2-options-and-variants.json"
    },
    {
      "id": "m3",
      "title": "Regeln für Optionen und Varianten untersuchen",
      "description": "Untersuchen Sie Einschluss-, Ausschluss-, Aktivierungs- und bedingte Regeln. Erkunden Sie die Regelvalidierung und Ausdrucksaliase.",
      "estimatedMinutes": 20,
      "topicCount": 4,
      "exerciseTopicStart": 4,
      "contentFile": "modules/m3-rules.json",
      "quizFile": "quizzes/q3-rules.json"
    },
    {
      "id": "m4",
      "title": "Optionssätze erkunden",
      "description": "Definieren Sie Optionssätze, erkunden Sie das Änderungsmanagement, weisen Sie Optionssätze zu, wenden Sie Ausdrücke an und verwenden Sie Optionsfilter.",
      "estimatedMinutes": 25,
      "topicCount": 5,
      "exerciseTopicStart": 4,
      "contentFile": "modules/m4-option-sets.json",
      "quizFile": "quizzes/q4-option-sets.json"
    }
  ]
},
    "modules/m1-configurable-products.json": {
  "id": "m1",
  "title": "Einführung in konfigurierbare Produkte",
  "description": "Untersuchen Sie Geschäftsstrategien für Produktvariabilität, besprechen Sie Überlegungen zu Produktplattformen und Produktvarianten und untersuchen Sie Produktkonfigurationsansätze mit Windchill.",
  "topics": [
    {
      "id": "m1t1",
      "title": "Geschäftsstrategien für Produktvariabilität",
      "estimatedMinutes": 6,
      "content": [
        {
          "type": "paragraph",
          "text": "Fertigungsunternehmen setzen unterschiedliche Geschäftsstrategien ein, um Produkte mit optionalen und anpassbaren Komponenten zu liefern. Das Verständnis dieser Strategien ist der erste Schritt zur Konfiguration von Windchill für Ihre Produktvariabilitätsanforderungen."
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Fünf Geschäftsstrategien"
        },
        {
          "type": "comparison-table",
          "headers": [
            "Strategie",
            "Beschreibung",
            "Beispiel"
          ],
          "rows": [
            [
              "Auftragsmontage (Assemble-to-Order)",
              "Entwicklung von Produkten mit einer endlichen Liste diskreter Optionsauswahlmöglichkeiten für wichtige Produktmerkmale. Die Fertigung erfolgt ohne Beteiligung der Produktentwicklung.",
              "Personenkraftwagen, Baumaschinen, Computer"
            ],
            [
              "Lagermontage (Assemble-to-Stock)",
              "Entwicklung eines allgemeinen Produkts mit mehreren diskreten Variationen, die aus geringfügigen Änderungen der Merkmale bestehen.",
              "Konsumgüter in mehreren Farben und Größen (Kleidung, Haushaltsgeräte)"
            ],
            [
              "Auftragskonfiguration (Configure-to-Order)",
              "Entwicklung flexibler Produkte, die mithilfe eines Konfigurators mit Regeln konfiguriert oder an die individuellen Kundenbedürfnisse angepasst werden können.",
              "Industrieanlagen, Unternehmenssoftware mit voneinander abhängigen Optionen"
            ],
            [
              "Auftragskonstruktion (Engineer-to-Order)",
              "Wie Auftragskonfiguration, erfordert jedoch die Beteiligung des Entwicklungsteams für Validierung und kundenspezifisches Design pro Auftrag.",
              "Komplexe Systeme (Turbinen, Flugzeugkomponenten), die eine Überprüfung durch die Konstruktion erfordern"
            ],
            [
              "Vertrag (Contract)",
              "Vollständig kundenspezifisches Design und Fertigung nach Kundenspezifikationen. Einzigartiges Produkt pro Vertrag.",
              "Einzelanfertigungen -- Verteidigungssysteme, kundenspezifische Infrastruktur"
            ]
          ]
        },
        {
          "type": "callout",
          "variant": "insight",
          "text": "Der wesentliche Unterschied zwischen diesen Strategien ist der Grad der Beteiligung der Produktentwicklung pro Auftrag. Auftragsmontage erfordert keine Beteiligung, während der Vertrag für jeden Kunden eine vollständige kundenspezifische Konstruktion erfordert."
        },
        {
          "type": "interactive-match",
          "prompt": "Ordnen Sie jedes Szenario der richtigen Geschäftsstrategie zu:",
          "pairs": [
            {
              "left": "Ein Automobilhersteller bietet Pakete mit vordefinierten Optionen wie Sport, Luxus und Basis an",
              "right": "Auftragsmontage (Assemble-to-Order)"
            },
            {
              "left": "Ein Turbinenhersteller entwickelt jedes Produkt mit einer Konstruktionsüberprüfung nach Kundenspezifikationen",
              "right": "Auftragskonstruktion (Engineer-to-Order)"
            },
            {
              "left": "Eine Bekleidungsmarke produziert Hemden in 5 Farben und 4 Größen",
              "right": "Lagermontage (Assemble-to-Stock)"
            },
            {
              "left": "Ein Rüstungsunternehmen baut ein einzigartiges Radarsystem für einen Militärvertrag",
              "right": "Vertrag (Contract)"
            }
          ]
        }
      ],
      "keyTakeaways": [
        "Es gibt fünf Hauptgeschäftsstrategien, die von Lagermontage (geringste Anpassung) bis Vertrag (vollständig kundenspezifisch) reichen",
        "Die Strategiewahl bestimmt, wie viel Beteiligung der Produktentwicklung pro Auftrag erforderlich ist",
        "Windchill OCP unterstützt hauptsächlich Auftragsmontage- und Auftragskonfigurationsstrategien"
      ]
    },
    {
      "id": "m1t2",
      "title": "Generisches Plattformdesign",
      "estimatedMinutes": 5,
      "content": [
        {
          "type": "paragraph",
          "text": "Bevor Produktvarianten erstellt werden, etablieren Unternehmen zunächst eine generische Produktplattform. Diese Plattform dient als Grundlage, aus der alle Produktvariationen abgeleitet werden."
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Vier Schritte des Plattformdesigns"
        },
        {
          "type": "paragraph",
          "text": "Die Plattformdesignphase folgt einem strukturierten Prozess zur Erstellung einer wiederverwendbaren Produktgrundlage:"
        },
        {
          "type": "reveal-cards",
          "cards": [
            {
              "front": "Schritt 1: Anforderungen an die Plattformoptionalität analysieren",
              "back": "Analysieren Sie die Anforderungen des neuen Produkts und identifizieren Sie die Optionen, die zur Erfüllung dieser Anforderungen benötigt werden. Bestimmen Sie, was variabel und was fest sein muss."
            },
            {
              "front": "Schritt 2: Vorhandene Produkte auf Wiederverwendung prüfen",
              "back": "Untersuchen Sie bestehende Variantendesigns auf Wiederverwendbarkeit und prüfen Sie neue Konzepte. Nutzen Sie vorhandene Elemente, bevor Sie neue Designs erstellen."
            },
            {
              "front": "Schritt 3: Generische Produktdefinition erstellen",
              "back": "Entwickeln Sie das Framework zur Unterstützung der Produktoptionalität. Verwenden Sie vorhandene Teile, Optionen und Regeln wieder. Definieren Sie neue Regeln und Logik zur Auswahl von Produktoptionen. Evaluieren und iterieren Sie nach Bedarf."
            },
            {
              "front": "Schritt 4: Plattform freigeben und pflegen",
              "back": "Nach erfolgreichem Design und Validierung geben Sie die generische Plattform an die Fertigungsplanung oder Fertigung frei. Verwalten und modifizieren Sie die Plattform bei Bedarf im Laufe der Zeit."
            }
          ]
        },
        {
          "type": "callout",
          "variant": "tip",
          "text": "Eine gut gestaltete Plattform maximiert die Wiederverwendung über Varianten hinweg. Das Ziel ist es, die gemeinsamen Teile wirklich gemeinsam zu machen und die variablen Abschnitte klar zu identifizieren."
        }
      ],
      "keyTakeaways": [
        "Plattformdesign ist eine Voraussetzung für die Variantengenerierung",
        "Prüfen Sie immer vorhandene Produkte auf Wiederverwendbarkeit, bevor Sie neue Designs erstellen",
        "Das Plattform-Framework definiert, welche Teile fest und welche variabel sind"
      ]
    },
    {
      "id": "m1t3",
      "title": "Variantengenerierung",
      "estimatedMinutes": 5,
      "content": [
        {
          "type": "paragraph",
          "text": "Sobald eine generische Plattform vorhanden ist, können spezifische Produktvarianten generiert werden, um Markt- oder Kundenanforderungen zu erfüllen. Der Variantengenerierungsprozess baut auf der Plattform auf, um konfigurierte Produkte zu erstellen."
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Schritte der Variantengenerierung"
        },
        {
          "type": "reveal-cards",
          "cards": [
            {
              "front": "Schritt 1: Spezifische Variantenanforderungen analysieren",
              "back": "Analysieren Sie markt- oder kundenspezifische Bedürfnisse. Was benötigt dieser bestimmte Kunde oder dieses Marktsegment, das sich von der Basisplattform unterscheidet?"
            },
            {
              "front": "Schritt 2: Vorhandene Plattformen auf Wiederverwendung prüfen",
              "back": "Bewerten Sie bestehende generische Plattformen, um die am besten geeignete für die Anforderungen auszuwählen. Wählen Sie die Plattform, die die geringste Anpassung erfordert."
            },
            {
              "front": "Schritt 3: Variantendefinition erstellen",
              "back": "Definieren Sie die Konfiguration für die Variante und generieren Sie Ergebnisse wie Teilestrukturen und Dokumentation. Modifizieren Sie das spezifische Variantendesign nach Bedarf."
            },
            {
              "front": "Schritt 4: Variante freigeben und pflegen",
              "back": "Sobald die Variante generiert und genehmigt ist, geben Sie sie an die Fertigung frei. Pflegen und modifizieren Sie die Variantendefinition nach Bedarf."
            }
          ]
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Verwaltung konfigurierbarer Produkte"
        },
        {
          "type": "paragraph",
          "text": "Unternehmen übernehmen gängige Branchenpraktiken zur Verwaltung von Produktinformationen während des Variantendesign- und Generierungsprozesses:"
        },
        {
          "type": "comparison-table",
          "headers": [
            "Praxis",
            "Beschreibung"
          ],
          "rows": [
            [
              "Modulare Produktstruktur",
              "Zerlegung des Produkts in modulare Abschnitte, die bestimmte Funktionen unterstützen. Module können produktübergreifend verwendet werden."
            ],
            [
              "Überladene Produktstruktur",
              "Abschnitte der Struktur enthalten mehrere Designs, um verschiedene Fähigkeitsstufen für diese Funktion zu erfüllen."
            ],
            [
              "Optionsverwaltung",
              "Definition von Optionen und Auswahlmöglichkeiten zur Identifizierung variabler Merkmale. Zuordnung von Auswahlmöglichkeiten zu Designs in überladenen Abschnitten zur Steuerung der Auswahl."
            ],
            [
              "Auftragsstruktur",
              "Eine Teilestruktur ohne zusätzliche Optionen, die einen bestimmten Kundenauftrag widerspiegelt. Analysiert, getestet und validiert."
            ]
          ]
        },
        {
          "type": "callout",
          "variant": "info",
          "text": "Eine überladene Struktur ist ein Schlüsselkonzept: Sie enthält ALLE möglichen Designvariationen. Während der Variantengenerierung wird die überladene Struktur auf nur die Teile gefiltert, die für eine bestimmte Konfiguration benötigt werden."
        }
      ],
      "keyTakeaways": [
        "Die Variantengenerierung folgt vier Schritten, die den Plattformdesignprozess widerspiegeln",
        "Bewerten Sie immer vorhandene Plattformen, bevor Sie eine neue Variante von Grund auf erstellen",
        "Überladene Produktstrukturen enthalten alle möglichen Variationen; Optionsfilter reduzieren sie auf spezifische Konfigurationen"
      ]
    },
    {
      "id": "m1t4",
      "title": "Produktkonfiguration in Windchill",
      "estimatedMinutes": 6,
      "content": [
        {
          "type": "paragraph",
          "text": "Windchill bietet spezifische Funktionen zur Unterstützung Ihrer Geschäftsstrategie für die Bereitstellung konfigurierbarer Produkte. Das Verständnis, wie Geschäftsstrategien auf Windchill-Funktionen abgebildet werden, ist für eine erfolgreiche Implementierung unerlässlich."
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Geschäftsstrategien in Windchill abgebildet"
        },
        {
          "type": "comparison-table",
          "headers": [
            "Geschäftsansatz",
            "Windchill-Fähigkeit",
            "Funktionsweise"
          ],
          "rows": [
            [
              "Auftragsmontage / Lagermontage",
              "Optionen und Auswahlmöglichkeiten zur Filterung",
              "Optionen und Auswahlmöglichkeiten filtern eine überladene Produktstruktur. Aufträge werden typischerweise über einen externen Verkaufskonfigurator (ATO) oder in Windchill (ATS) erstellt."
            ],
            [
              "Auftragskonfiguration / Auftragskonstruktion",
              "Listenbasierte Optionen + Parameter",
              "Listenbasierte Optionen filtern die Struktur, während Parameter eine erweiterte Auswahllogik für zusätzliche Konfiguration bieten."
            ]
          ]
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Windchill-Fähigkeiten für Produktvariabilität"
        },
        {
          "type": "reveal-cards",
          "cards": [
            {
              "front": "Konfigurierbare Produktstruktur",
              "back": "Windchill-Teile können als konfigurierbar definiert werden, wobei Abschnitte mit mehreren Designs gekennzeichnet werden. Unterstützt modulare und überladene Strukturen."
            },
            {
              "front": "Optionen für die Filterauswahllogik",
              "back": "Definieren Sie eine Liste fester Optionen und Auswahlmöglichkeiten, die diskrete Konfigurationen beschreiben. Produktübergreifend wiederverwendbar, mit Regeln, die gültige Kombinationen einschränken."
            },
            {
              "front": "Erweiterte Auswahllogik (Parameter)",
              "back": "Parameter bieten eine erweiterte Auswahllogik unter Verwendung von Einschränkungen, um Benutzereingaben während der Konfiguration zu steuern. Geht über einfache Options-/Auswahllisten hinaus."
            },
            {
              "front": "Kombination von Filterung und erweiterter Auswahl",
              "back": "Filtern Sie zuerst eine überladene Struktur mit listenbasierten Optionen und konfigurieren Sie dann weiter mit Parametern. Bietet maximale Flexibilität."
            },
            {
              "front": "Variantengenerierung und Wiederverwendung",
              "back": "Erstellen und aktualisieren Sie Varianten mithilfe von Filterung und Auswahllogik. Windchill zeichnet Optionsauswahlmöglichkeiten in einer Variantenspezifikation auf und sucht nach vorhandenen Varianten zur Wiederverwendung."
            }
          ]
        },
        {
          "type": "callout",
          "variant": "insight",
          "text": "Der kombinierte Ansatz ist der leistungsstärkste: Verwenden Sie Optionen für die breite Filterung (\"Welcher Motor?\") und dann Parameter für die Feinabstimmung der Konfiguration (\"Welche Bohrgröße?\"). Dieser zweistufige Ansatz deckt die meisten realen Produktvariabilitätsszenarien ab."
        },
        {
          "type": "interactive-match",
          "prompt": "Ordnen Sie jede Windchill-Fähigkeit ihrem Hauptzweck zu:",
          "pairs": [
            {
              "left": "Optionen und Auswahlmöglichkeiten",
              "right": "Überladene Strukturen mittels diskreter Auswahl filtern"
            },
            {
              "left": "Parameter",
              "right": "Erweiterte Auswahllogik mit Einschränkungen bereitstellen"
            },
            {
              "left": "Variantenspezifikation",
              "right": "Die zur Generierung einer bestimmten Variante verwendeten Eingaben aufzeichnen"
            },
            {
              "left": "Konfigurierbares Modul",
              "right": "Produktabschnitte mit mehreren Designvariationen kennzeichnen"
            }
          ]
        }
      ],
      "keyTakeaways": [
        "Auftragsmontage/Lagermontage verwendet Optionen und Auswahlmöglichkeiten zur Filterung; Auftragskonfiguration/Auftragskonstruktion fügt Parameter hinzu",
        "Optionen und Parameter können für maximale Konfigurierbarkeit kombiniert werden",
        "Windchill verfolgt Variantenspezifikationen, um die Wiederverwendung von Varianten über Aufträge hinweg zu ermöglichen"
      ]
    },
    {
      "id": "m1t5",
      "title": "Vorhandene Optionen und Auswahlmöglichkeiten untersuchen",
      "estimatedMinutes": 15,
      "isExercise": true,
      "content": [
        {
          "type": "paragraph",
          "text": "In dieser Übung erkunden Sie das PTC Motorcycle-Produkt in Windchill, um zu verstehen, wie Optionspools, Optionen, Auswahlmöglichkeiten und Produktstrukturen organisiert sind. Sie navigieren durch den Optionspool, untersuchen vorhandene Optionen und deren Auswahlmöglichkeiten und durchsuchen die Produktstruktur, um konfigurierbare Module zu identifizieren."
        },
        {
          "type": "callout",
          "variant": "info",
          "text": "Sie benötigen Zugang zum Windchill-Schulungsserver, um diese Übung abzuschließen. Melden Sie sich als Ihr zugewiesener Schulungsbenutzer an."
        },
        {
          "type": "exercise",
          "exerciseId": "ex1",
          "title": "Vorhandene Optionen und Auswahlmöglichkeiten untersuchen",
          "objective": "Verstehen Sie, wie Optionspools, Optionen, Auswahlmöglichkeiten und Produktstrukturen in Windchill organisiert sind, indem Sie das PTC Motorcycle-Produkt erkunden.",
          "tasks": [
            {
              "id": "ex1-t1",
              "title": "Auf den PTC Motorcycle-Optionspool zugreifen",
              "steps": [
                {
                  "action": "Melden Sie sich bei Windchill an und navigieren Sie zur Registerkarte Durchsuchen. Gehen Sie zu Produkte und wählen Sie PTC Motorcycle.",
                  "detail": "Der Produktbereich listet alle Produkte auf, auf die Sie Zugriff haben. PTC Motorcycle ist das konfigurierbare Beispielprodukt, das in diesem Kurs durchgehend verwendet wird.",
                  "hint": "Verwenden Sie die von Ihrem Dozenten bereitgestellte URL. Ihre Anmeldedaten sind normalerweise Ihr Schulungsbenutzername und Ihr Passwort."
                },
                {
                  "action": "Klicken Sie auf die Registerkarte Optionspool auf der PTC Motorcycle-Produktseite.",
                  "detail": "Die Registerkarte Optionspool zeigt alle für dieses Produkt definierten Optionen an. Jede Option repräsentiert ein variables Merkmal des Motorrads, wie Hubraum oder Farbe.",
                  "hint": "Die Registerkarte Optionspool befindet sich neben anderen Registerkarten wie Details, Struktur und Änderung."
                },
                {
                  "action": "Untersuchen Sie die Liste der im Optionspool angezeigten Optionen. Notieren Sie die Optionsnamen und wie viele Auswahlmöglichkeiten jede hat.",
                  "detail": "Jede Option (z. B. Hubraum, Farbe, Satteltaschenposition) repräsentiert ein konfigurierbares Merkmal. Die Anzahl der Auswahlmöglichkeiten pro Option bestimmt, wie viele Variationen dieses Merkmal unterstützt.",
                  "hint": null
                },
                {
                  "action": "Klicken Sie auf die Option Hubraum, um deren Auswahlmöglichkeiten anzuzeigen.",
                  "detail": "Optionen enthalten Auswahlmöglichkeiten, die die gültigen Werte für dieses Merkmal definieren. Für den Hubraum sehen Sie Auswahlmöglichkeiten wie 600cc, 1000cc und 1200cc. Jede Auswahlmöglichkeit kann Teilen in der Produktstruktur zugewiesen werden.",
                  "hint": "Klicken Sie auf den Link des Optionsnamens oder das Informationssymbol, um die Optionsdetailseite zu öffnen."
                },
                {
                  "action": "Überprüfen Sie die Auswahlnamen, Beschreibungen und zugehörigen Bilder oder Attribute für den Hubraum.",
                  "detail": "Auswahlmöglichkeiten enthalten oft Beschreibungen, die den Benutzern helfen zu verstehen, was jede Auswahl bedeutet. Gut dokumentierte Auswahlmöglichkeiten reduzieren Konfigurationsfehler bei der Variantengenerierung.",
                  "hint": null
                },
                {
                  "action": "Navigieren Sie zurück zum Optionspool und klicken Sie auf die Option Farbe. Untersuchen Sie deren Auswahlmöglichkeiten.",
                  "detail": "Beachten Sie, dass die Farbauswahlmöglichkeiten (z. B. Rot, Blau, Schwarz) der gleichen Struktur wie die Hubraum-Auswahlmöglichkeiten folgen. Alle Optionen folgen einem einheitlichen Muster: Optionsname, Auswahlliste und optionale Beschreibungen.",
                  "hint": "Verwenden Sie die Zurück-Schaltfläche des Browsers oder die Brotkrümelnavigation, um zum Optionspool zurückzukehren."
                },
                {
                  "action": "Navigieren Sie zurück zum Optionspool und klicken Sie auf Satteltaschenposition. Untersuchen Sie die aktuellen Auswahlmöglichkeiten.",
                  "detail": "Satteltaschenposition steuert, wo Satteltaschen am Motorrad montiert werden. Beachten Sie, dass diese Option derzeit bestimmte Positionsauswahlmöglichkeiten hat. Sie werden diese Option in Übung 2 ändern.",
                  "hint": null
                }
              ]
            },
            {
              "id": "ex1-t2",
              "title": "Ordner durchsuchen und Produktstruktur anzeigen",
              "steps": [
                {
                  "action": "Navigieren Sie zur Registerkarte Ordner auf der PTC Motorcycle-Produktseite. Durchsuchen Sie die Ordnerstruktur.",
                  "detail": "Produkte organisieren ihren Inhalt in Ordnern. Das Durchsuchen von Ordnern hilft Ihnen zu verstehen, wie Designdaten, Optionen und andere Artefakte innerhalb eines Produktkontexts organisiert sind.",
                  "hint": "Die Registerkarte Ordner kann je nach Ihrer Windchill-Version als 'Ordnerinhalt' bezeichnet werden."
                },
                {
                  "action": "Verwenden Sie die Suchfunktion, um ein bestimmtes Teil zu finden (z. B. suchen Sie nach 'Motor' oder 'Rahmen').",
                  "detail": "Die Windchill-Suche ermöglicht es Ihnen, Teile, Dokumente und andere Objekte innerhalb eines Produkts schnell zu finden. Dies ist schneller als das Durchsuchen von Ordnern, wenn Sie wissen, wonach Sie suchen.",
                  "hint": "Verwenden Sie das Suchfeld oben auf der Seite oder gehen Sie zur Registerkarte Suche. Setzen Sie den Suchbereich auf das aktuelle Produkt."
                },
                {
                  "action": "Klicken Sie auf ein Teil aus den Suchergebnissen, um dessen Detailseite zu öffnen. Sehen Sie sich den Teiletyp und andere Attribute an.",
                  "detail": "Jedes Teil hat einen Typ (z. B. Teil, Baugruppe) und Attribute, die seine Eigenschaften definieren. Das Verständnis von Teiletypen ist wichtig, da konfigurierbare Module bestimmte Teiletypen sein müssen.",
                  "hint": null
                },
                {
                  "action": "Klicken Sie auf die Registerkarte Struktur für das PTC Motorcycle-Teil der obersten Ebene, um die Produktstruktur anzuzeigen.",
                  "detail": "Die Produktstruktur zeigt, wie Teile in einer Eltern-Kind-Hierarchie organisiert sind. Dies ist die Stückliste (BOM). Einige Abschnitte dieser Struktur sind mit mehreren Designoptionen überladen.",
                  "hint": "Navigieren Sie zum PTC Motorcycle-Teil der obersten Ebene und klicken Sie auf die Registerkarte Struktur."
                },
                {
                  "action": "Erweitern Sie den Strukturbaum und identifizieren Sie Teile, die als Konfigurierbare Module gekennzeichnet sind (achten Sie auf das Symbol oder die Bezeichnung für konfigurierbares Modul).",
                  "detail": "Konfigurierbare Module sind Abschnitte der Struktur, die mehrere Designvariationen enthalten. Sie sind die Schlüsselbausteine für die Produktkonfigurierbarkeit. Sie können sie an ihrem Symbol oder an der Bezeichnung 'Konfigurierbares Modul' in den Teiledetails erkennen.",
                  "hint": "Konfigurierbare Module erscheinen typischerweise an wichtigen funktionalen Grenzpunkten in der Struktur, wie 'Motorbaugruppe' oder 'Rahmenbaugruppe'."
                },
                {
                  "action": "Klicken Sie auf ein konfigurierbares Modul und untersuchen Sie dessen untergeordnete Teile. Beachten Sie, wie mehrere alternative Designs unter demselben Modul erscheinen.",
                  "detail": "Dies ist das Konzept der überladenen Struktur aus Thema 3. Mehrere untergeordnete Teile unter einem konfigurierbaren Modul stellen alternative Designs dar. Bei der Variantengenerierung wählen Optionsfilter aus, welche untergeordneten Teile basierend auf den gewählten Optionswerten einbezogen werden.",
                  "hint": null
                }
              ]
            }
          ]
        }
      ],
      "keyTakeaways": [
        "Optionspools organisieren alle Optionen und Auswahlmöglichkeiten für ein Produkt an einem Ort",
        "Jede Option repräsentiert ein variables Merkmal mit einer oder mehreren Auswahlmöglichkeiten",
        "Die Produktstruktur verwendet konfigurierbare Module, um mehrere Designvariationen zu enthalten (überladene Struktur)",
        "Optionsauswahlmöglichkeiten werden Teilen in der Struktur zugewiesen, um zu steuern, welche Designs bei der Variantengenerierung ausgewählt werden"
      ]
    },
    {
      "id": "m1t6",
      "title": "Eine neue Option und ein konfigurierbares Modul erstellen",
      "estimatedMinutes": 15,
      "isExercise": true,
      "content": [
        {
          "type": "paragraph",
          "text": "In dieser Übung erstellen Sie eine neue Option namens Motorradtyp mit zwei Auswahlmöglichkeiten, fügen eine neue Auswahlmöglichkeit zur vorhandenen Option Satteltaschenposition hinzu und kennzeichnen ein Teil als Konfigurierbares Modul und Endprodukt. Diese Aufgaben zeigen, wie die Konfigurierbarkeit eines vorhandenen Produkts erweitert werden kann."
        },
        {
          "type": "callout",
          "variant": "warning",
          "text": "Diese Übung ändert die Produktkonfiguration. Folgen Sie den Schritten sorgfältig und verwenden Sie die genauen angegebenen Namen, um die Konsistenz mit späteren Übungen sicherzustellen."
        },
        {
          "type": "exercise",
          "exerciseId": "ex2",
          "title": "Eine neue Option und ein konfigurierbares Modul erstellen",
          "objective": "Lernen Sie, wie Sie neue Optionen und Auswahlmöglichkeiten erstellen, Auswahlmöglichkeiten zu vorhandenen Optionen hinzufügen und Teile als konfigurierbare Module in Windchill kennzeichnen.",
          "tasks": [
            {
              "id": "ex2-t1",
              "title": "Die Option Motorradtyp mit Auswahlmöglichkeiten erstellen",
              "steps": [
                {
                  "action": "Navigieren Sie zum PTC Motorcycle-Produkt und öffnen Sie die Registerkarte Optionspool.",
                  "detail": "Sie werden eine neue Option im Optionspool dieses Produkts erstellen. Neue Optionen erweitern die Konfigurierbarkeit des Produkts durch Hinzufügen neuer variabler Merkmale.",
                  "hint": null
                },
                {
                  "action": "Klicken Sie auf die Schaltfläche 'Neue Option' (oder verwenden Sie das Aktionsmenü), um eine neue Option zu erstellen.",
                  "detail": "Die Aktion Neue Option öffnet ein Formular, in dem Sie den Optionsnamen, die Beschreibung und die anfänglichen Auswahlmöglichkeiten definieren. Jede Option repräsentiert eine Dimension der Produktvariabilität.",
                  "hint": "Suchen Sie nach einem Symbol 'Neue Option' in der Symbolleiste über der Optionspooltabelle oder klicken Sie mit der rechten Maustaste für das Kontextmenü."
                },
                {
                  "action": "Geben Sie 'Motorradtyp' als Optionsnamen ein und geben Sie eine Beschreibung wie 'Definiert die vorgesehene Verwendungskategorie des Motorrads' an.",
                  "detail": "Klare, beschreibende Optionsnamen helfen allen zu verstehen, was die Option steuert. Der Name sollte intuitiv genug sein, damit jemand, der eine Variante konfiguriert, genau weiß, was er auswählt.",
                  "hint": null
                },
                {
                  "action": "Fügen Sie die erste Auswahl hinzu: 'Gelände'. Geben Sie eine Beschreibung an, wie 'Motorrad konfiguriert für Gelände- und Schotterpisten'.",
                  "detail": "Auswahlmöglichkeiten definieren die gültigen Werte für eine Option. Jede Auswahl sollte einen klaren Namen und eine Beschreibung haben. Geländemotorräder haben typischerweise unterschiedliche Rahmen-, Federungs- und Reifenspezifikationen.",
                  "hint": "Nach Eingabe der Optionsdetails suchen Sie nach einer Aktion 'Auswahl hinzufügen' oder 'Neue Auswahl' im Optionserstellungsformular."
                },
                {
                  "action": "Fügen Sie die zweite Auswahl hinzu: 'Straße/Straßenzulassung'. Geben Sie eine Beschreibung an, wie 'Motorrad konfiguriert für den Straßenverkehr mit Straßenzulassung'.",
                  "detail": "Straßenmotorräder mit Straßenzulassung erfordern unterschiedliche Komponenten zur Einhaltung der Straßenvorschriften, wie Beleuchtung, Spiegel und bestimmte Reifentypen. Diese beiden Auswahlmöglichkeiten werden wesentliche strukturelle Unterschiede im Produkt bestimmen.",
                  "hint": null
                },
                {
                  "action": "Speichern Sie die neue Option Motorradtyp. Überprüfen Sie, ob sie im Optionspool neben den vorhandenen Optionen angezeigt wird.",
                  "detail": "Nach dem Speichern sind die Option und ihre Auswahlmöglichkeiten für die Verwendung in Optionssätzen verfügbar und können Teilen in der Produktstruktur zugewiesen werden. Die Option ist nun Teil des Konfigurationsvokabulars des Produkts.",
                  "hint": "Wenn die Option nicht sofort angezeigt wird, aktualisieren Sie die Optionspoolansicht."
                }
              ]
            },
            {
              "id": "ex2-t2",
              "title": "Eine 'Nicht verwendet'-Auswahl zur Satteltaschenposition hinzufügen",
              "steps": [
                {
                  "action": "Klicken Sie im Optionspool auf die vorhandene Option Satteltaschenposition, um sie zu öffnen.",
                  "detail": "Sie ändern eine vorhandene Option, indem Sie eine neue Auswahl hinzufügen. Dies ist üblich, da sich die Produktanforderungen weiterentwickeln — neue gültige Werte müssen zu vorhandenen Optionen hinzugefügt werden.",
                  "hint": null
                },
                {
                  "action": "Klicken Sie auf die Aktion 'Neue Auswahl', um eine Auswahl zur Satteltaschenposition hinzuzufügen.",
                  "detail": "Das Hinzufügen einer 'Nicht verwendet'-Auswahl ermöglicht es einer Variante, anzugeben, dass Satteltaschen überhaupt nicht enthalten sind. Ohne diese Auswahl wäre jede Variante gezwungen, Satteltaschen an irgendeiner Position zu haben.",
                  "hint": "Suchen Sie nach einer Schaltfläche 'Neue Auswahl' oder 'Auswahl hinzufügen' in der Symbolleiste der Optionsdetailansicht."
                },
                {
                  "action": "Geben Sie 'Nicht verwendet' als Auswahlnamen ein. Fügen Sie eine Beschreibung hinzu, wie 'Keine Satteltaschen sind in dieser Motorradkonfiguration enthalten'.",
                  "detail": "Eine 'Nicht verwendet'- oder 'Keine'-Auswahl ist ein gängiges Muster in der Optionsverwaltung. Sie ermöglicht es, ein Merkmal explizit auszuschließen, anstatt jede Konfiguration zu zwingen, es einzuschließen.",
                  "hint": null
                },
                {
                  "action": "Speichern Sie die neue Auswahl und überprüfen Sie, ob sie in der Auswahlliste der Satteltaschenposition erscheint.",
                  "detail": "Die Option Satteltaschenposition hat jetzt eine zusätzliche Auswahl. Diese Auswahl kann in Ausdrücken und Regeln verwendet werden, um zu steuern, ob Satteltaschenkomponenten in die Struktur einer Variante aufgenommen werden.",
                  "hint": null
                }
              ]
            },
            {
              "id": "ex2-t3",
              "title": "Ein Teil als Konfigurierbares Modul und Endprodukt kennzeichnen",
              "steps": [
                {
                  "action": "Navigieren Sie zur Registerkarte Struktur und suchen Sie das Teil 'small-offroad_standalone' in der Produktstruktur.",
                  "detail": "Dieses Teil repräsentiert eine eigenständige Gelände-Motorrad-Unterbaugruppe. Sie werden es sowohl als Konfigurierbares Modul (zur Ermöglichung der Variantenkonfiguration) als auch als Endprodukt (um anzugeben, dass es unabhängig bestellt/gefertigt werden kann) kennzeichnen.",
                  "hint": "Verwenden Sie die Suchfunktion oder erweitern Sie den Strukturbaum, um dieses Teil zu finden. Es kann mehrere Ebenen tief verschachtelt sein."
                },
                {
                  "action": "Klicken Sie mit der rechten Maustaste auf das Teil (oder verwenden Sie das Aktionsmenü) und wählen Sie die Option, es als 'Konfigurierbares Modul' festzulegen.",
                  "detail": "Das Markieren eines Teils als Konfigurierbares Modul teilt Windchill mit, dass dieser Abschnitt der Struktur mehrere Designkonfigurationen unterstützt. Untergeordnete Teile unter diesem Modul können mithilfe von Optionsauswahlmöglichkeiten gefiltert werden.",
                  "hint": "Die Aktion befindet sich möglicherweise unter 'Einrichtung' > 'Unterstützung konfigurierbarer Module' oder einem ähnlichen Menüpfad, abhängig von Ihrer Windchill-Version."
                },
                {
                  "action": "Kennzeichnen Sie dasselbe Teil ebenfalls als 'Endprodukt'.",
                  "detail": "Ein Endprodukt ist ein Produkt oder eine Unterbaugruppe, das/die unabhängig bestellt, gefertigt oder geliefert werden kann. Das Setzen dieses Kennzeichens ermöglicht es dem Teil, als auswählbares Endprodukt in Variantengenerierungs-Workflows zu erscheinen.",
                  "hint": null
                },
                {
                  "action": "Überprüfen Sie, ob das Teil jetzt das Symbol für Konfigurierbares Modul und die Endprodukt-Bezeichnung in der Strukturansicht zeigt.",
                  "detail": "Visuelle Indikatoren in der Strukturansicht bestätigen, dass die Kennzeichnungen korrekt angewendet wurden. Dieses Teil ist nun bereit, an der optionsgesteuerten Produktkonfiguration teilzunehmen.",
                  "hint": "Suchen Sie nach aktualisierten Symbolen oder Beschriftungen neben dem Teilenamen im Strukturbaum."
                },
                {
                  "action": "Öffnen Sie die Teiledetails und überprüfen Sie die Attribute, um zu bestätigen, dass beide Kennzeichnungen in den Teileeigenschaften widergespiegelt werden.",
                  "detail": "Die Teileattributseite bietet eine definitive Ansicht aller Einstellungen. Die Bestätigung hier stellt sicher, dass die Änderungen korrekt gespeichert wurden und sich bei der Variantengenerierung wie erwartet verhalten.",
                  "hint": null
                }
              ]
            }
          ]
        }
      ],
      "keyTakeaways": [
        "Neue Optionen werden im Optionspool erstellt und sind sofort für die Verwendung im Produkt verfügbar",
        "Auswahlmöglichkeiten können zu vorhandenen Optionen hinzugefügt werden, wenn sich die Produktanforderungen weiterentwickeln",
        "Eine 'Nicht verwendet'-Auswahl ist ein gängiges Muster, um den expliziten Ausschluss eines Merkmals zu ermöglichen",
        "Die Kennzeichnungen Konfigurierbares Modul und Endprodukt steuern, wie Teile an der Variantengenerierung teilnehmen"
      ]
    },
    {
      "id": "m1t7",
      "title": "Optionen- und Varianten-Präferenzen überprüfen",
      "estimatedMinutes": 10,
      "isExercise": true,
      "content": [
        {
          "type": "paragraph",
          "text": "In dieser Übung erkunden Sie die Optionen- und Varianten-Präferenzen sowohl auf Standortebene als auch auf Produktebene. Das Verständnis der Präferenzvererbung ist wichtig, da Einstellungen auf Standortebene Standardwerte festlegen, die Produkte für ihre spezifischen Bedürfnisse überschreiben können."
        },
        {
          "type": "callout",
          "variant": "info",
          "text": "Diese Übung erfordert die Anmeldung als verschiedene Benutzer (wcadmin für Standortebene, Anna Chen für Produktebene). Ihr Dozent stellt Ihnen die Anmeldedaten zur Verfügung."
        },
        {
          "type": "exercise",
          "exerciseId": "ex3",
          "title": "Optionen- und Varianten-Präferenzen überprüfen",
          "objective": "Verstehen Sie, wie Optionen- und Varianten-Präferenzen auf Standortebene vs. Produktebene konfiguriert werden und wie die Vererbung zwischen ihnen funktioniert.",
          "tasks": [
            {
              "id": "ex3-t1",
              "title": "Als Administrator anmelden",
              "steps": [
                {
                  "action": "Melden Sie sich von Ihrer aktuellen Sitzung ab und melden Sie sich als 'wcadmin' (das Standortadministratorkonto) an.",
                  "detail": "Standortadministratoren haben Zugriff auf Präferenzeinstellungen auf Standortebene, die global für alle Produkte gelten. Diese Einstellungen legen die Basiskonfiguration für die Optionen- und Varianten-Funktionalität fest.",
                  "hint": "Das Passwort für wcadmin wird von Ihrem Dozenten bereitgestellt. Verwenden Sie dieselbe Windchill-URL."
                }
              ]
            },
            {
              "id": "ex3-t2",
              "title": "Präferenzen auf Standortebene anzeigen",
              "steps": [
                {
                  "action": "Navigieren Sie zu Standort > Dienstprogramme > Präferenzverwaltung (oder Standort > Administration > Präferenzen, je nach Ihrer Version).",
                  "detail": "Präferenzen auf Standortebene legen das Standardverhalten für alle Produkte und Kontexte im System fest. Alle hier festgelegten Präferenzen gelten, sofern sie nicht auf einer niedrigeren Ebene (Organisation oder Produkt) überschrieben werden.",
                  "hint": "Suchen Sie nach 'Präferenzverwaltung' im Standortadministrationsbereich. Möglicherweise müssen Sie den Abschnitt Dienstprogramme oder Administration erweitern."
                },
                {
                  "action": "Suchen Sie die Kategorie 'Optionen und Varianten' oder navigieren Sie dorthin. Überprüfen Sie die verfügbaren Präferenzen und ihre aktuellen Werte.",
                  "detail": "Wichtige Präferenzen umfassen 'Unterstützung konfigurierbarer Module' (muss auf Ja gesetzt sein, um O&V zu verwenden), 'Optionspool-Freigabe' und verschiedene Standardwerte für das Variantengenerierungsverhalten. Notieren Sie, welche Präferenzen auf Standortebene aktiviert und welche deaktiviert sind.",
                  "hint": "Sie können in der Präferenzliste nach 'Optionen' oder 'Konfigurierbar' filtern oder suchen, um relevante Einstellungen zu finden."
                }
              ]
            },
            {
              "id": "ex3-t3",
              "title": "Als Produktmanager anmelden",
              "steps": [
                {
                  "action": "Melden Sie sich von wcadmin ab und melden Sie sich als 'Anna Chen' (oder den angegebenen Produktmanager-Benutzer) an.",
                  "detail": "Produktmanager arbeiten in bestimmten Produktkontexten und können Präferenzen auf Standortebene für ihre Produkte überschreiben. Dies zeigt, wie verschiedene Rollen unterschiedliche Präferenzkonfigurationen erleben.",
                  "hint": "Benutzername und Passwort von Anna Chen werden von Ihrem Dozenten bereitgestellt."
                }
              ]
            },
            {
              "id": "ex3-t4",
              "title": "Präferenzen auf Produktebene anzeigen und vergleichen",
              "steps": [
                {
                  "action": "Navigieren Sie zum PTC Motorcycle-Produkt und greifen Sie auf dessen Präferenzeinstellungen zu (normalerweise unter Produktdienstprogramme oder Produktadministration).",
                  "detail": "Präferenzen auf Produktebene überschreiben die Standardwerte auf Standortebene für diesen spezifischen Produktkontext. Dies ermöglicht es verschiedenen Produkten, unterschiedliche Optionen- und Varianten-Konfigurationen zu haben.",
                  "hint": "Der Pfad kann Produkt > Dienstprogramme > Präferenzverwaltung oder ähnlich sein."
                },
                {
                  "action": "Suchen Sie die 'Optionen und Varianten'-Präferenzen auf Produktebene. Vergleichen Sie sie mit den Einstellungen auf Standortebene, die Sie zuvor notiert haben.",
                  "detail": "Beachten Sie, welche Präferenzen von der Standortebene geerbt (als geerbt oder ausgegraut angezeigt) und welche explizit auf Produktebene festgelegt wurden. Überschreibungen auf Produktebene haben Vorrang vor Einstellungen auf Standortebene, jedoch nur für dieses Produkt.",
                  "hint": null
                },
                {
                  "action": "Notieren Sie den Wert der Präferenz 'Unterstützung konfigurierbarer Module'. Bestätigen Sie, dass er für das PTC Motorcycle-Produkt auf 'Ja' gesetzt ist.",
                  "detail": "Die Unterstützung konfigurierbarer Module muss aktiviert (auf 'Ja' gesetzt) sein, damit die Optionen- und Varianten-Funktionalität innerhalb eines Produkts funktioniert. Dies ist die wichtigste Präferenz — wenn sie auf 'Nein' gesetzt ist, können Sie keine konfigurierbaren Module erstellen oder eine optionsbasierte Variantengenerierung für dieses Produkt verwenden.",
                  "hint": "Wenn diese Präferenz auf Standortebene festgelegt und geerbt wird, wird sie als 'Ja (Geerbt)' angezeigt. Wenn sie auf Produktebene festgelegt ist, wird sie als 'Ja' mit einem Indikator für die Produktebene angezeigt."
                }
              ]
            }
          ]
        }
      ],
      "keyTakeaways": [
        "Präferenzen auf Standortebene legen das Standardverhalten für alle Produkte fest",
        "Präferenzen auf Produktebene können die Standardwerte auf Standortebene für bestimmte Produkte überschreiben",
        "Die Unterstützung konfigurierbarer Module muss auf Ja gesetzt sein, um die Optionen- und Varianten-Funktionalität zu nutzen",
        "Das Verständnis der Präferenzvererbung hilft bei der Diagnose von Problemen, wenn O&V-Funktionen in bestimmten Kontexten nicht verfügbar sind"
      ]
    }
  ]
},
    "modules/m2-options-and-variants.json": {
  "id": "m2",
  "title": "Windchill-Optionen und -Varianten überprüfen",
  "description": "Untersuchen Sie die Terminologie von Optionen und Varianten, besprechen Sie Optionen und Auswahlmöglichkeiten, erkunden Sie konfigurierbare Strukturen, vergleichen Sie Konfigurationsansätze und überprüfen Sie wichtige Präferenzen.",
  "topics": [
    {
      "id": "m2t1",
      "title": "Terminologie für Optionen und Varianten",
      "estimatedMinutes": 5,
      "content": [
        {
          "type": "paragraph",
          "text": "Optionen und Varianten (O&V) in Windchill verwendet ein umfangreiches Vokabular spezialisierter Begriffe. Die Beherrschung dieser Terminologie ist unerlässlich, bevor Sie mit konfigurierbaren Produkten arbeiten, da diese Begriffe in der gesamten Windchill-Oberfläche und -Dokumentation vorkommen."
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Wichtige O&V-Begriffe"
        },
        {
          "type": "comparison-table",
          "headers": [
            "Begriff",
            "Kategorie",
            "Definition"
          ],
          "rows": [
            [
              "Erweiterter Ausdruck",
              "Logik",
              "Umfasst Auswahlmöglichkeiten, Operatoren und Funktionen. Kann Teilen und Teileverwendungsverknüpfungen zugewiesen werden, um komplexe Auswahlkriterien zu definieren."
            ],
            [
              "Erweiterte Auswahllogik",
              "Logik",
              "Logik für ein konfigurierbares Modul unter Verwendung von Parametern und Einschränkungen, um Benutzereingaben während der Konfiguration zu steuern."
            ],
            [
              "Grundausdruck",
              "Logik",
              "Optionsauswahlmöglichkeiten, die Teilen und Verknüpfungen zugewiesen werden können, um festzulegen, wann eine Komponente in eine Variante aufgenommen wird."
            ],
            [
              "Bedingte Regel",
              "Logik",
              "WENN/DANN-Anweisungen, die festlegen, wann Auswahlmöglichkeiten eingeschlossen, aktiviert oder deaktiviert werden sollen, basierend auf anderen Auswahlen."
            ],
            [
              "Konfigurierbares Modul",
              "Struktur",
              "Ein Windchill-Teil mit untergeordneten Teilen, die Designvariationen darstellen. Der Baustein für Produktvariabilität."
            ],
            [
              "Konfigurierbare Produktstruktur",
              "Struktur",
              "Eine Produktstruktur, die konfigurierbare Module enthält, die mehrere Produktvarianten unterstützen."
            ],
            [
              "Aktivierungsregel",
              "Logik",
              "Lässt nur bestimmte Auswahlmöglichkeiten in der Auswahlliste erscheinen, sobald eine Zielauswahl getroffen wurde."
            ],
            [
              "Ausschlussregel",
              "Logik",
              "Beschränkt die Auswahl inkompatibler Auswahlmöglichkeiten und verhindert ungültige Konfigurationen."
            ],
            [
              "Einschlussregel",
              "Logik",
              "Verknüpft die Auswahl einer Auswahlmöglichkeit mit der automatischen Einbeziehung zugehöriger Auswahlmöglichkeiten."
            ],
            [
              "Optionsfilter",
              "Verwaltung",
              "Kriterien zum Filtern einer Produktstruktur basierend auf Teilen zugewiesenen Auswahlmöglichkeiten."
            ],
            [
              "Options-Manager",
              "Verwaltung",
              "Eine Windchill-Kontextrolle, die für das Erstellen von Optionen und Auswahlmöglichkeiten und die Pflege von Optionssätzen verantwortlich ist."
            ],
            [
              "Parameter",
              "Logik",
              "Ein Attribut innerhalb eines konfigurierbaren Moduls, das für die erweiterte Auswahllogik mit Einschränkungen verwendet wird."
            ],
            [
              "Produktfamilie",
              "Struktur",
              "Eine Gruppe verwandter Produkte, die wesentliche Teile gemeinsam nutzen, definiert durch einen Optionssatz und eine konfigurierbare Produktstruktur."
            ],
            [
              "Variante",
              "Struktur",
              "Ein Teil oder eine Struktur, die eine bestimmte Konfiguration darstellt und während des Konfigurationsprozesses erstellt wird."
            ],
            [
              "Variantenspezifikation",
              "Verwaltung",
              "Eine Aufzeichnung der Benutzereingaben (Auswahlmöglichkeiten und Parameterwerte), die zur Generierung einer bestimmten Variante verwendet werden."
            ]
          ]
        },
        {
          "type": "callout",
          "variant": "insight",
          "text": "Diese 15 Begriffe fallen in drei Kategorien: Strukturbegriffe (Konfigurierbares Modul, konfigurierbare Produktstruktur, Produktfamilie, Variante) definieren, wie Produkte organisiert sind; Logikbegriffe (Ausdrücke, Regeln, Parameter) definieren, wie Konfigurationen bestimmt werden; Verwaltungsbegriffe (Optionsfilter, Options-Manager, Variantenspezifikation) definieren, wie Konfigurationen verwaltet werden."
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Testen Sie Ihr Wissen"
        },
        {
          "type": "interactive-match",
          "prompt": "Ordnen Sie jeden O&V-Begriff seiner Definition zu:",
          "pairs": [
            {
              "left": "Konfigurierbares Modul",
              "right": "Ein Windchill-Teil mit untergeordneten Teilen, die Designvariationen darstellen"
            },
            {
              "left": "Variantenspezifikation",
              "right": "Eine Aufzeichnung der Benutzereingaben zur Generierung einer bestimmten Variante"
            },
            {
              "left": "Ausschlussregel",
              "right": "Beschränkt die Auswahl inkompatibler Auswahlmöglichkeiten"
            },
            {
              "left": "Optionsfilter",
              "right": "Kriterien zum Filtern der Produktstruktur basierend auf zugewiesenen Auswahlmöglichkeiten"
            }
          ]
        }
      ],
      "keyTakeaways": [
        "Optionen und Varianten hat ein Vokabular von mehr als 15 spezialisierten Begriffen, die Sie verstehen müssen",
        "Die Begriffe fallen in drei Kategorien: Struktur (Konfigurierbares Modul, Produktfamilie), Logik (Ausdrücke, Regeln, Parameter) und Verwaltung (Optionsfilter, Options-Manager)",
        "Das Verständnis der Terminologie ist unerlässlich, bevor Sie mit O&V in Windchill arbeiten"
      ]
    },
    {
      "id": "m2t2",
      "title": "Optionen und Auswahlmöglichkeiten",
      "estimatedMinutes": 5,
      "content": [
        {
          "type": "paragraph",
          "text": "Optionen und Auswahlmöglichkeiten sind die grundlegenden Bausteine zur Definition der Produktvariabilität in Windchill. Eine Option repräsentiert ein bestimmtes Produktmerkmal, und jede Option hat eine oder mehrere Auswahlmöglichkeiten, die die gültigen Werte für dieses Merkmal definieren."
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Wie Optionen und Auswahlmöglichkeiten funktionieren"
        },
        {
          "type": "paragraph",
          "text": "Eine Option ist ein bestimmtes Produktmerkmal, das über Konfigurationen hinweg variieren kann. Jede Option hat eine bis viele verfügbare Auswahlmöglichkeiten. Optionen können als erforderlich (der Benutzer muss eine Auswahl treffen) oder als Einzelauswahl (es kann nur eine Auswahl gleichzeitig getroffen werden) gekennzeichnet werden. Optionen sind auf bestimmte Produktvariationen anwendbar, und Auswahlmöglichkeiten können Teilen, Vorkommen oder Verknüpfungen in der Produktstruktur zugewiesen werden."
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Optionspool vs. Optionssatz"
        },
        {
          "type": "paragraph",
          "text": "Optionen und Auswahlmöglichkeiten sind in zwei Schlüsselbehältern organisiert: dem Optionspool und dem Optionssatz. Das Verständnis der Beziehung zwischen diesen beiden ist entscheidend für die Verwaltung der Produktkonfigurierbarkeit."
        },
        {
          "type": "reveal-cards",
          "cards": [
            {
              "front": "Optionspool",
              "back": "Der Optionspool enthält ALLE für einen Produktkontext definierten Optionen und Auswahlmöglichkeiten. Er ist das Hauptverzeichnis, aus dem Optionssätze ihren Inhalt beziehen. Stellen Sie ihn sich als den vollständigen Katalog jedes möglichen variablen Merkmals vor."
            },
            {
              "front": "Optionssatz",
              "back": "Ein Optionssatz ist eine kuratierte Sammlung von Optionen, Auswahlmöglichkeiten und Regeln, die zur Definition von Konfigurationen innerhalb einer bestimmten Produktfamilie verwendet wird. Er ist eine Teilmenge des Optionspools und enthält nur die für eine bestimmte Produktlinie oder ein Konfigurationsszenario relevanten Optionen."
            },
            {
              "front": "Warum zwei Behälter?",
              "back": "Der Optionspool kann Optionen für viele Produktfamilien enthalten. Ein Optionssatz wählt nur die relevanten Optionen für eine bestimmte Produktfamilie aus. Diese Trennung ermöglicht Wiederverwendung — dieselbe Option (z. B. Farbe) kann in mehreren Optionssätzen für verschiedene Produktfamilien erscheinen."
            }
          ]
        },
        {
          "type": "callout",
          "variant": "tip",
          "text": "Denken Sie daran: Der Optionspool ist die Obermenge, und der Optionssatz ist eine kuratierte Teilmenge. Ein Produkt kann viele Optionen in seinem Pool haben, aber der Optionssatz einer bestimmten Produktfamilie enthält nur die für die Konfigurationen dieser Familie relevanten Optionen."
        }
      ],
      "keyTakeaways": [
        "Eine Option repräsentiert ein variables Produktmerkmal; jede Option hat eine oder mehrere Auswahlmöglichkeiten",
        "Optionen können als erforderlich oder Einzelauswahl gekennzeichnet sein, und Auswahlmöglichkeiten können Teilen, Vorkommen oder Verknüpfungen zugewiesen werden",
        "Der Optionspool ist das Hauptverzeichnis aller Optionen und Auswahlmöglichkeiten für einen Produktkontext",
        "Ein Optionssatz ist eine kuratierte Teilmenge des Optionspools zur Definition von Konfigurationen für eine bestimmte Produktfamilie"
      ]
    },
    {
      "id": "m2t3",
      "title": "Elemente einer konfigurierbaren Struktur",
      "estimatedMinutes": 5,
      "content": [
        {
          "type": "paragraph",
          "text": "Eine konfigurierbare Struktur in Windchill enthält sowohl Standardteile (in jeder Variante vorhanden) als auch optionale Teile (nur enthalten, wenn bestimmte Auswahlmöglichkeiten getroffen werden). Drei konfigurierbare Schlüsselobjekte bilden eine Hierarchie, die definiert, wie Produktvariabilität erfasst und aufgelöst wird."
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Drei konfigurierbare Objekte"
        },
        {
          "type": "comparison-table",
          "headers": [
            "Objekt",
            "Rolle",
            "Beschreibung"
          ],
          "rows": [
            [
              "Konfigurierbares Produkt",
              "Endprodukt der obersten Ebene",
              "Das Produkt der obersten Ebene, das eine Sammlung von Produktvariationen darstellt. Es ist der Einstiegspunkt für die Konfiguration und enthält die vollständige überladene Struktur."
            ],
            [
              "Konfigurierbares Modul",
              "Konfigurierbare Komponente",
              "Eine konfigurierbare Komponente, die Variabilität auf Komponentenebene erfasst. Dargestellt durch eine überladene Struktur, die alle Designvariationen für diesen Abschnitt des Produkts enthält."
            ],
            [
              "Modulvariante",
              "Spezifische Auswahl",
              "Die spezifischen Teile, die aus den optionalen Teilen innerhalb eines konfigurierbaren Moduls ausgewählt werden, basierend auf Auswahlkriterien und Auswahlmöglichkeiten. Repräsentiert eine aufgelöste Konfiguration eines Moduls."
            ]
          ]
        },
        {
          "type": "callout",
          "variant": "info",
          "text": "Eine überladene Struktur enthält ALLE möglichen Designvariationen für ein konfigurierbares Modul. Während des Konfigurationsprozesses reduzieren Optionsfilter diese überladene Struktur auf nur die Teile, die für eine bestimmte Konfiguration benötigt werden, und erzeugen so eine Modulvariante."
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Hierarchie konfigurierbarer Objekte"
        },
        {
          "type": "paragraph",
          "text": "Die drei konfigurierbaren Objekte bilden eine klare Hierarchie vom Breitesten zum Spezifischsten. Das Verständnis dieser Hierarchie ist der Schlüssel zur Arbeit mit konfigurierbaren Strukturen."
        },
        {
          "type": "interactive-sort",
          "prompt": "Ordnen Sie die konfigurierbaren Objekte von der höchsten Ebene (breiteste) bis zur niedrigsten Ebene (spezifischste):",
          "correctOrder": [
            "Konfigurierbares Produkt",
            "Konfigurierbares Modul",
            "Modulvariante"
          ]
        }
      ],
      "keyTakeaways": [
        "Drei konfigurierbare Objekte bilden eine Hierarchie: Konfigurierbares Produkt, Konfigurierbares Modul und Modulvariante",
        "Konfigurierbare Module erfassen Variabilität mithilfe überladener Strukturen, die alle Designvariationen enthalten",
        "Modulvarianten sind die spezifischen Teile, die aus einem konfigurierbaren Modul nach Anwendung von Optionsfiltern ausgewählt werden",
        "Eine konfigurierbare Struktur enthält sowohl Standardteile (immer vorhanden) als auch optionale Teile (bedingt einbezogen)"
      ]
    },
    {
      "id": "m2t4",
      "title": "Top-Down- und Bottom-Up-Konfiguration",
      "estimatedMinutes": 5,
      "content": [
        {
          "type": "paragraph",
          "text": "Windchill unterstützt zwei Ansätze zur Erstellung konfigurierbarer Produkte: Top-Down (beginnend in Windchill) und Bottom-Up (beginnend in Creo). Der gewählte Ansatz hängt davon ab, wo Ihr Produktdesign seinen Ursprung hat und wie Ihre Organisation CAD- und PLM-Daten verwaltet."
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Vergleich der beiden Ansätze"
        },
        {
          "type": "comparison-table",
          "headers": [
            "Aspekt",
            "Top-Down (Windchill zuerst)",
            "Bottom-Up (Creo zuerst)"
          ],
          "rows": [
            [
              "Ausgangspunkt",
              "Teilestruktur zuerst in Windchill erstellen",
              "Konfigurierbares Produkt (überladene Baugruppe) zuerst in Creo erstellen"
            ],
            [
              "Optionsdefinition",
              "Optionspool und Optionssatz in Windchill erstellen, dann Auswahlmöglichkeiten Teilen zuweisen",
              "Überladene Baugruppe in Creo öffnen, in Windchill einchecken, dann Optionen und Auswahlmöglichkeiten in Windchill definieren"
            ],
            [
              "Strukturfluss",
              "CAD-Struktur aus Windchill-Struktur generieren, an Creo weitergeben",
              "Creo-Baugruppe in Windchill einchecken, als konfigurierbares Produkt kennzeichnen, Auswahlmöglichkeiten zuweisen"
            ],
            [
              "Konfiguration",
              "Teilestruktur in Windchill mit Variantenspezifikation konfigurieren, dann in Creo öffnen",
              "Variante in Creo konfigurieren, in Windchill einchecken, Variantenstrukturen überprüfen"
            ],
            [
              "Ausdrucksbeschränkung",
              "Nur Grundausdrücke werden von Windchill an Creo übergeben",
              "Nur Grundausdrücke werden von Windchill an Creo übergeben"
            ],
            [
              "Am besten geeignet für",
              "Organisationen, bei denen PLM die Produktstruktur bestimmt",
              "Organisationen, bei denen CAD-Design die Produktstruktur bestimmt"
            ]
          ]
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Top-Down-Workflow"
        },
        {
          "type": "paragraph",
          "text": "Beim Top-Down-Ansatz beginnen Sie mit der Erstellung der Teilestruktur in Windchill: Erstellen Sie den Optionspool, den Optionssatz, richten Sie konfigurierbare Module ein und weisen Sie Teilen Auswahlmöglichkeiten zu. Dann generieren Sie die CAD-Struktur und konfigurieren die Teilestruktur. In Creo öffnen Sie das konfigurierbare Produkt, checken es ein, konfigurieren es mithilfe einer Variantenspezifikation und verknüpfen die Variante."
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Bottom-Up-Workflow"
        },
        {
          "type": "paragraph",
          "text": "Beim Bottom-Up-Ansatz beginnen Sie in Creo, indem Sie die überladene Baugruppe öffnen und sie in Windchill einchecken. Dann definieren Sie in Windchill Optionen und Auswahlmöglichkeiten, erstellen und weisen den Optionssatz zu, kennzeichnen das konfigurierbare Produkt, weisen Auswahlmöglichkeiten zu, konfigurieren und geben Auswahlmöglichkeiten an CAD weiter. Zurück in Creo überprüfen Sie die Auswahlzuweisungen, konfigurieren die Variante und checken ein. Abschließend überprüfen Sie die Variantenstrukturen in Windchill."
        },
        {
          "type": "callout",
          "variant": "warning",
          "text": "Unabhängig vom gewählten Ansatz werden nur Grundausdrücke von Windchill an Creo übergeben. Erweiterte Ausdrücke verbleiben nur in Windchill. Dies ist eine wichtige Einschränkung, die Sie bei der Planung Ihrer Konfigurationsstrategie berücksichtigen sollten."
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Ordnen Sie die Schritte zu"
        },
        {
          "type": "interactive-match",
          "prompt": "Ordnen Sie jeden Schritt dem richtigen Konfigurationsansatz zu:",
          "pairs": [
            {
              "left": "Teilestruktur zuerst in Windchill erstellen",
              "right": "Top-Down"
            },
            {
              "left": "Überladene Baugruppe zuerst in Creo öffnen",
              "right": "Bottom-Up"
            },
            {
              "left": "CAD-Struktur aus Windchill generieren",
              "right": "Top-Down"
            },
            {
              "left": "Creo-Baugruppe in Windchill einchecken, dann Optionen definieren",
              "right": "Bottom-Up"
            }
          ]
        }
      ],
      "keyTakeaways": [
        "Top-Down-Konfiguration beginnt in Windchill und wird an Creo weitergegeben; Bottom-Up beginnt in Creo und wird an Windchill weitergegeben",
        "Nur Grundausdrücke werden zwischen Windchill und Creo übertragen — erweiterte Ausdrücke verbleiben nur in Windchill",
        "Beide Ansätze enden letztlich mit verifizierten Variantenstrukturen in beiden Systemen",
        "Die Wahl des Ansatzes hängt davon ab, ob PLM oder CAD Ihre Produktstruktur bestimmt"
      ]
    },
    {
      "id": "m2t5",
      "title": "Optionen- und Varianten-Präferenzen",
      "estimatedMinutes": 5,
      "content": [
        {
          "type": "paragraph",
          "text": "Windchill verwendet eine Reihe von Präferenzen zur Steuerung des Optionen- und Varianten-Verhaltens. Die wichtigste Präferenz ist die Unterstützung konfigurierbarer Module, die auf Ja gesetzt werden muss, bevor eine O&V-Funktionalität verwendet werden kann. Präferenzen folgen einem Vererbungsmodell von übergeordneten Behältern zu untergeordneten Kontexten."
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Wichtige O&V-Präferenzen"
        },
        {
          "type": "reveal-cards",
          "cards": [
            {
              "front": "Unterstützung konfigurierbarer Module",
              "back": "Steuert die Möglichkeit, optionale Produktstrukturen zu erstellen. Standard ist Nein. Muss auf Ja gesetzt werden, um O&V-Funktionalität zu nutzen. Dies ist die Schlüsselpräferenz — wenn sie auf Nein steht, können keine konfigurierbaren Module erstellt werden."
            },
            {
              "front": "Erweiterte Logik",
              "back": "Aktiviert oder deaktiviert die erweiterte Auswahllogik unter Verwendung von Parametern und Einschränkungen innerhalb konfigurierbarer Module. Erforderlich für Auftragskonfigurations- und Auftragskonstruktionsszenarien."
            },
            {
              "front": "Anzeigeformat für Auswahlmöglichkeiten",
              "back": "Steuert, wie Auswahlmöglichkeiten den Benutzern während der Konfiguration angezeigt werden. Optionen umfassen die Anzeige von Auswahlname, Nummer oder beidem. Beeinflusst die Benutzererfahrung während der Variantenspezifikation."
            },
            {
              "front": "Unterstützte Ausdrücke",
              "back": "Bestimmt, welche Ausdruckstypen zur Verfügung stehen: nur Grundausdrücke oder sowohl Grund- als auch erweiterte Ausdrücke. Begrenzt die Komplexität der Auswahllogik, die erstellt werden kann."
            }
          ]
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Präferenzvererbung und Rollen"
        },
        {
          "type": "paragraph",
          "text": "O&V-Präferenzen werden von übergeordneten Behältern (Standortebene) an untergeordnete Kontexte (Organisation, Produkt) vererbt. Auf Standortebene festgelegte Präferenzen dienen als Standardwerte. Untergeordnete Kontexte können geerbte Werte überschreiben oder als geerbt belassen. Präferenzen können auch auf einer höheren Ebene gesperrt werden, um Überschreibungen auf niedrigerer Ebene zu verhindern."
        },
        {
          "type": "comparison-table",
          "headers": [
            "Rolle",
            "Geltungsbereich",
            "Fähigkeit"
          ],
          "rows": [
            [
              "Standortadministrator",
              "Gesamter Windchill-Standort",
              "Legt standortweite Standardpräferenzen fest, die für alle Organisationen und Produkte gelten, sofern sie nicht überschrieben werden."
            ],
            [
              "Organisationsadministrator",
              "Bestimmte Organisation",
              "Kann Präferenzen auf Standortebene für seine Organisation überschreiben. Einstellungen gelten für alle Produkte innerhalb der Organisation."
            ],
            [
              "Produktmanager",
              "Bestimmtes Produkt",
              "Kann Präferenzen auf Organisationsebene für seinen Produktkontext überschreiben. Detaillierteste Steuerungsebene."
            ],
            [
              "Bibliotheksmanager",
              "Bestimmte Bibliothek",
              "Kann Präferenzen für Bibliothekskontexte überschreiben und das O&V-Verhalten für gemeinsam genutzte Bibliotheksinhalte steuern."
            ]
          ]
        },
        {
          "type": "callout",
          "variant": "tip",
          "text": "Wenn O&V-Funktionen in einem bestimmten Produktkontext nicht verfügbar sind, sollten Sie zuerst die Präferenz Unterstützung konfigurierbarer Module überprüfen. Stellen Sie sicher, dass sie auf der entsprechenden Ebene (Standort, Organisation oder Produkt) auf Ja gesetzt ist. Prüfen Sie auch, ob eine Sperre auf höherer Ebene die Änderung der Präferenz verhindert."
        }
      ],
      "keyTakeaways": [
        "Die Unterstützung konfigurierbarer Module muss auf Ja gesetzt sein, um Optionen- und Varianten-Funktionalität zu nutzen — der Standard ist Nein",
        "Präferenzen werden von höheren Ebenen (Standort) an niedrigere Ebenen (Organisation, Produkt) vererbt und können gesperrt oder überschrieben werden",
        "Vier Rollen können O&V-Präferenzen ändern: Standortadministrator, Organisationsadministrator, Produktmanager und Bibliotheksmanager",
        "Das Verständnis der Präferenzvererbung ist für die Diagnose von O&V-Problemen in bestimmten Produktkontexten unerlässlich"
      ]
    }
  ]
},
    "modules/m3-rules.json": {
  "id": "m3",
  "title": "Regeln für Optionen und Varianten untersuchen",
  "description": "Untersuchen Sie Einschluss-, Ausschluss-, Aktivierungs- und bedingte Regeln. Erkunden Sie die Regelvalidierung und Ausdrucksaliase.",
  "exerciseTopicStart": 4,
  "topics": [
    {
      "id": "m3t1",
      "title": "Regeltypen und Geschäftslogik",
      "estimatedMinutes": 5,
      "content": [
        {
          "type": "paragraph",
          "text": "Optionen- und Varianten-Regeln definieren die gültigen Kombinationen von Auswahlmöglichkeiten, die bei der Konfiguration eines Produkts zusammen ausgewählt werden können. Windchill bietet vier Regeltypen, die steuern, wie Auswahlmöglichkeiten interagieren, und sicherstellen, dass nur gültige Produktkonfigurationen erstellt werden können."
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Vier Regeltypen"
        },
        {
          "type": "comparison-table",
          "headers": [
            "Regeltyp",
            "Beschreibung",
            "Beispiel"
          ],
          "rows": [
            [
              "Einschlussregel",
              "Verknüpft die Auswahl einer Auswahlmöglichkeit mit zugehörigen Auswahlmöglichkeiten. Wenn eine Quellauswahl getroffen wird, werden die Zielauswahlmöglichkeiten automatisch ebenfalls ausgewählt.",
              "Land=USA schließt automatisch Spannung=110 Volt ein"
            ],
            [
              "Ausschlussregel",
              "Beschränkt die gleichzeitige Auswahl inkompatibler Auswahlmöglichkeiten. Wenn eine Quellauswahl getroffen wird, sind die Zielauswahlmöglichkeiten nicht erlaubt.",
              "Spannung=110V schließt Frequenz=50Hz aus, da sie inkompatibel sind"
            ],
            [
              "Aktivierungsregel",
              "Lässt nur bestimmte Auswahlmöglichkeiten zur Auswahl erscheinen, sobald eine Quellauswahl getroffen wurde. Steuert, welche Optionsauswahlmöglichkeiten abhängig von einer Bedingung verfügbar sind.",
              "Die Auswahl von Auswahl 1 aktiviert Auswahlmöglichkeiten 7, 8, 13 und deaktiviert Auswahlmöglichkeiten 9, 12"
            ],
            [
              "Bedingte Regel",
              "WENN/DANN-Anweisungen, die festlegen, wann Auswahlmöglichkeiten eingeschlossen, aktiviert oder deaktiviert werden sollen. Bietet komplexe Logik mit mehreren Bedingungen.",
              "WENN Auswahlmöglichkeiten 1 UND 4 ausgewählt sind, DANN werden Auswahlmöglichkeiten 7, 8 und 13 deaktiviert"
            ]
          ]
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Methoden der Geschäftslogik"
        },
        {
          "type": "paragraph",
          "text": "Windchill bietet verschiedene Methoden zur Implementierung von Geschäftslogik, die die Produktkonfiguration steuert. Jede Methode dient einem bestimmten Zweck im gesamten Regelframework:"
        },
        {
          "type": "reveal-cards",
          "cards": [
            {
              "front": "Designoption",
              "back": "Ermöglicht Aktionen an Optionen innerhalb des Optionspools. Dies ist die Grundlage für die Definition der variablen Merkmale eines Produkts und der für jedes Merkmal verfügbaren Auswahlmöglichkeiten."
            },
            {
              "front": "Einschlussregeln",
              "back": "Erfassen logische Verknüpfungen zwischen Produktmerkmalen. Wenn eine Auswahl getroffen wird, werden zugehörige Auswahlmöglichkeiten automatisch einbezogen, um die Produktintegrität zu gewährleisten."
            },
            {
              "front": "Ausschlussregeln",
              "back": "Erfassen inkompatible Auswahlmöglichkeiten, die nicht zusammen ausgewählt werden sollten. Verhindert ungültige Kombinationen, die zu nicht funktionsfähigen oder nicht fertigbaren Produkten führen würden."
            },
            {
              "front": "Aktivierungsregeln",
              "back": "Steuern, welche Optionsauswahlmöglichkeiten abhängig von einer Bedingung verfügbar sind. Passen die sichtbaren Auswahlmöglichkeiten basierend auf vorherigen Auswahlen dynamisch an, um Benutzer zu gültigen Konfigurationen zu führen."
            },
            {
              "front": "Bedingte Regeln",
              "back": "WENN/DANN-Konstruktionen für die Auswahlselektion im Optionsfilter. Bieten die flexibelste und komplexeste Logik zur Steuerung von Auswahlinteraktionen über mehrere Optionen hinweg."
            }
          ]
        },
        {
          "type": "callout",
          "variant": "insight",
          "text": "Windchill überprüft, ob neue Regeln nicht mit bestehenden Regeln in Konflikt stehen oder diese duplizieren. Diese integrierte Regelvalidierung verhindert widersprüchliche Logik, die bestimmte Produktkonfigurationen unmöglich oder mehrdeutig machen könnte."
        },
        {
          "type": "interactive-match",
          "prompt": "Ordnen Sie jeden Regeltyp seinem Verhalten zu:",
          "pairs": [
            {
              "left": "Einschlussregel",
              "right": "Wählt automatisch zugehörige Auswahlmöglichkeiten aus, wenn eine Quellauswahl getroffen wird"
            },
            {
              "left": "Ausschlussregel",
              "right": "Verhindert, dass inkompatible Auswahlmöglichkeiten zusammen ausgewählt werden"
            },
            {
              "left": "Aktivierungsregel",
              "right": "Steuert, welche Auswahlmöglichkeiten basierend auf einer Bedingung sichtbar oder verfügbar sind"
            },
            {
              "left": "Bedingte Regel",
              "right": "Verwendet WENN/DANN-Logik, um Auswahlmöglichkeiten basierend auf mehreren Bedingungen zu aktivieren oder zu deaktivieren"
            }
          ]
        }
      ],
      "keyTakeaways": [
        "Vier Regeltypen steuern gültige Auswahlkombinationen: Einschluss, Ausschluss, Aktivierung und bedingt",
        "Einschlussregeln erzwingen, dass zugehörige Auswahlen automatisch zusammen gewählt werden",
        "Ausschlussregeln verhindern, dass inkompatible Kombinationen ausgewählt werden",
        "Windchill validiert Regeln, um Konflikte und Duplikate zu verhindern"
      ]
    },
    {
      "id": "m3t2",
      "title": "Einschluss-, Ausschluss- und bedingte Regeln",
      "estimatedMinutes": 5,
      "content": [
        {
          "type": "paragraph",
          "text": "Einschluss-, Ausschluss- und bedingte Regeln bilden den Kern der Produktkonfigurationslogik in Windchill. Jeder Regeltyp behandelt einen anderen Aspekt der Beziehung zwischen Auswahlmöglichkeiten, von der automatischen Auswahl über die Durchsetzung von Inkompatibilitäten bis hin zu komplexen Szenarien mit mehreren Bedingungen."
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Regeldetails und Beispiele"
        },
        {
          "type": "reveal-cards",
          "cards": [
            {
              "front": "Einschlussregel",
              "back": "Identifiziert Zielauswahlmöglichkeiten, die automatisch ausgewählt werden, wenn eine Quellauswahl getroffen wird. Wenn beispielsweise Auswahl 1 ausgewählt wird, werden die Auswahlmöglichkeiten 7 und 13 automatisch eingeschlossen. Dies stellt sicher, dass abhängige Merkmale immer zusammen ausgewählt werden."
            },
            {
              "front": "Ausschlussregel",
              "back": "Definiert inkompatible Auswahlmöglichkeiten, die nicht zusammen mit einer Quellauswahl ausgewählt werden können. Wenn beispielsweise Auswahl 1 ausgewählt wird, ist Auswahl 9 nicht erlaubt. Dies verhindert, dass Benutzer ungültige Produktkonfigurationen mit widersprüchlichen Merkmalen erstellen."
            },
            {
              "front": "Bedingte Regel",
              "back": "Verwendet WENN/DANN-Logik zur Handhabung komplexer Szenarien mit mehreren Auswahlmöglichkeiten. Wenn Sie beispielsweise die Auswahlmöglichkeiten 1 und 4 wählen, werden die Auswahlmöglichkeiten 7, 8 und 13 deaktiviert, sodass nur die Auswahlmöglichkeiten 9 und 12 verfügbar bleiben. Dies bietet die flexibelste Steuerung der Auswahlinteraktionen."
            }
          ]
        },
        {
          "type": "callout",
          "variant": "tip",
          "text": "Einschluss- und Ausschlussregeln behandeln einfache Eins-zu-eins- oder Eins-zu-viele-Beziehungen zwischen Auswahlmöglichkeiten. Wenn Sie Logik benötigen, die von der gleichzeitigen Auswahl mehrerer Quellauswahlmöglichkeiten abhängt, verwenden Sie bedingte Regeln mit WENN/DANN-Anweisungen."
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Wie die Regeln zusammenwirken"
        },
        {
          "type": "paragraph",
          "text": "In der Praxis verwenden Produkte eine Kombination aller drei Regeltypen. Einschlussregeln stellen sicher, dass Abhängigkeiten erfüllt werden, Ausschlussregeln verhindern Konflikte, und bedingte Regeln behandeln die komplexen Interaktionen, die nicht mit einfacher Einschluss- oder Ausschlusslogik ausgedrückt werden können. Zusammen bilden sie ein umfassendes Einschränkungssystem, das Benutzer zu gültigen Konfigurationen führt."
        },
        {
          "type": "comparison-table",
          "headers": [
            "Regeltyp",
            "Quelle → Zielverhalten",
            "Anwendungsfall"
          ],
          "rows": [
            [
              "Einschluss",
              "Quelle ausgewählt → Ziele automatisch ausgewählt",
              "Abhängige Merkmale, die immer zusammen erscheinen müssen"
            ],
            [
              "Ausschluss",
              "Quelle ausgewählt → Ziele nicht erlaubt",
              "Inkompatible Merkmale, die nicht koexistieren können"
            ],
            [
              "Bedingt",
              "WENN mehrere Quellen → DANN Ziele an/aus",
              "Komplexe Szenarien, bei denen das Ergebnis von einer Kombination von Auswahlen abhängt"
            ]
          ]
        }
      ],
      "keyTakeaways": [
        "Einschlussregeln wählen automatisch zugehörige Auswahlmöglichkeiten aus, wenn eine Quellauswahl getroffen wird",
        "Ausschlussregeln verhindern, dass widersprüchliche Auswahlen zusammen getroffen werden",
        "Bedingte Regeln bieten komplexe WENN/DANN-Logik für Szenarien mit mehreren Auswahlmöglichkeiten"
      ]
    },
    {
      "id": "m3t3",
      "title": "Aktivierungsregeln und Ausdrucksaliase",
      "estimatedMinutes": 5,
      "content": [
        {
          "type": "paragraph",
          "text": "Aktivierungsregeln und Ausdrucksaliase erweitern das Regelframework um zusätzliche Fähigkeiten. Aktivierungsregeln steuern die Sichtbarkeit und Verfügbarkeit von Auswahlmöglichkeiten basierend auf vorherigen Auswahlen, während Ausdrucksaliase die Erstellung komplexer Regeln vereinfachen, indem sie wiederverwendbare logische Anweisungen kapseln."
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Aktivierungsregeln"
        },
        {
          "type": "paragraph",
          "text": "Aktivierungsregeln steuern, welche Optionsauswahlmöglichkeiten verfügbar sind, sobald eine Quellauswahl getroffen wurde. Im Gegensatz zu Einschluss- oder Ausschlussregeln, die Auswahlen erzwingen oder verhindern, passen Aktivierungsregeln dynamisch an, welche Auswahlmöglichkeiten sichtbar sind. Beispielsweise aktiviert die Auswahl von Auswahl 1 die Auswahlmöglichkeiten 7, 8 und 13 und deaktiviert die Auswahlmöglichkeiten 9 und 12. Nur die aktivierten Auswahlmöglichkeiten erscheinen als auswählbare Optionen während der Konfiguration."
        },
        {
          "type": "comparison-table",
          "headers": [
            "Aspekt",
            "Aktivierungsregeln",
            "Bedingte Regeln"
          ],
          "rows": [
            [
              "Auslöser",
              "Auswahl einer einzelnen Quellauswahl",
              "Mehrere ausgewählte Quellauswahlmöglichkeiten (WENN/DANN)"
            ],
            [
              "Wirkung",
              "Schaltet bestimmte Auswahlmöglichkeiten für die Sichtbarkeit ein oder aus",
              "Schaltet Auswahlmöglichkeiten basierend auf zusammengesetzten Bedingungen ein oder aus"
            ],
            [
              "Komplexität",
              "Einfache Eins-zu-viele-Sichtbarkeitssteuerung",
              "Komplexe Logik mit mehreren Bedingungen"
            ],
            [
              "Hauptverwendung",
              "Steuerung, welche Auswahlmöglichkeiten basierend auf einer einzelnen Auswahl erscheinen",
              "Handhabung von Interaktionen, die von Kombinationen vorheriger Auswahlen abhängen"
            ]
          ]
        },
        {
          "type": "callout",
          "variant": "info",
          "text": "Aktivierungsregeln sind besonders nützlich, wenn bestimmte Auswahlmöglichkeiten nur im Kontext einer vorherigen Auswahl sinnvoll sind. Beispielsweise können bestimmte Reifengrößen nur relevant sein, wenn ein bestimmter Rahmentyp ausgewählt wurde."
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Ausdrucksaliase"
        },
        {
          "type": "paragraph",
          "text": "Ausdrucksaliase repräsentieren logische Anweisungen, die über mehrere Regeln hinweg wiederverwendet werden können. Häufig verwendete Definitionen in der Produktkonfiguration können als Aliase erfasst werden, was die Regelerstellung vereinfacht und die Wartbarkeit verbessert."
        },
        {
          "type": "reveal-cards",
          "cards": [
            {
              "front": "Was ist ein Ausdrucksalias?",
              "back": "Ein Ausdrucksalias ist eine benannte logische Anweisung, die eine häufig verwendete Bedingung oder eine Reihe von Auswahlmöglichkeiten kapselt. Beispielsweise könnte ein 'GroßeReifen'-Alias die Reifengrößen 48IN, 50IN, 52IN, 54IN und 56IN aus der REIFEN-Option repräsentieren."
            },
            {
              "front": "Wo werden Aliase verwendet?",
              "back": "Ausdrucksaliase können bei der Erstellung von bedingten Regeln, erweiterten Ausdrücken und anderen Aliasen verwendet werden. Sie dienen als Bausteine für komplexe Konfigurationslogik und reduzieren Duplikation, wodurch Regeln einfacher zu lesen und zu pflegen sind."
            },
            {
              "front": "Wiederverwendbarkeit über Regeln hinweg",
              "back": "Einmal definiert, kann ein Alias in mehreren bedingten Regeln und Ausdrücken in der gesamten Produktkonfiguration referenziert werden. Dies bedeutet, dass eine Änderung der Aliasdefinition automatisch an alle Regeln weitergegeben wird, die ihn referenzieren."
            },
            {
              "front": "Lizenzanforderungen",
              "back": "Ausdrucksaliase sind eine erweiterte Fähigkeit, die einer separaten Lizenzberechtigung unterliegt. Organisationen müssen über die entsprechende Windchill-Lizenz verfügen, um Ausdrucksaliase in ihren Produktkonfigurationen erstellen und verwenden zu können."
            }
          ]
        },
        {
          "type": "callout",
          "variant": "warning",
          "text": "Ausdrucksaliase erfordern eine separate Lizenzberechtigung. Überprüfen Sie, ob die Windchill-Lizenz Ihrer Organisation diese Fähigkeit umfasst, bevor Sie den Einsatz von Aliasen in Ihren Regeldefinitionen planen."
        }
      ],
      "keyTakeaways": [
        "Aktivierungsregeln steuern die Sichtbarkeit von Auswahlmöglichkeiten basierend auf einer Quellauswahl",
        "Ausdrucksaliase vereinfachen die Erstellung komplexer Regeln durch Kapselung wiederverwendbarer logischer Anweisungen",
        "Aliase sind über bedingte Regeln und Ausdrücke hinweg wiederverwendbar",
        "Ausdrucksaliase erfordern eine separate Lizenzberechtigung"
      ]
    },
    {
      "id": "m3t4",
      "title": "Einschluss- und Ausschlussregeln erstellen",
      "estimatedMinutes": 5,
      "isExercise": true,
      "content": [
        {
          "type": "paragraph",
          "text": "In dieser Übung erstellen Sie Einschluss- und Ausschlussregeln für das PTC Motorcycle-Produkt. Anna Chen navigiert zum Optionspool, um eine Einschlussregel zu definieren, die den Geländemotorradtyp mit den richtigen Radauswahlmöglichkeiten verknüpft, und eine Ausschlussregel, die inkompatible Radauswahlen verhindert."
        },
        {
          "type": "callout",
          "variant": "warning",
          "text": "Diese Übung ändert die Produktkonfigurationsregeln. Folgen Sie den Schritten sorgfältig und verwenden Sie die genauen angegebenen Namen, um die Konsistenz mit späteren Übungen sicherzustellen."
        },
        {
          "type": "exercise",
          "exerciseId": "ex4",
          "title": "Einschluss- und Ausschlussregeln erstellen",
          "objective": "Lernen Sie, wie Sie Einschluss- und Ausschlussregeln in Windchill erstellen, indem Sie logische Verknüpfungen und inkompatible Auswahlbeschränkungen für das PTC Motorcycle-Produkt definieren.",
          "tasks": [
            {
              "id": "ex4-t1",
              "title": "Eine Einschlussregel erstellen",
              "steps": [
                {
                  "action": "Navigieren Sie zum PTC Motorcycle-Produkt und öffnen Sie die Registerkarte Optionspool.",
                  "detail": "Sie werden eine Einschlussregel erstellen, die den Geländemotorradtyp mit den entsprechenden Radauswahlmöglichkeiten verknüpft. Einschlussregeln werden im Optionspool erstellt.",
                  "hint": null
                },
                {
                  "action": "Erweitern Sie die Option Motorradtyp im Optionspool, um deren Auswahlmöglichkeiten anzuzeigen.",
                  "detail": "Sie sollten die Auswahlmöglichkeiten Gelände und Straße/Straßenzulassung sehen, die in einer vorherigen Übung erstellt wurden. Die Auswahlmöglichkeit Gelände wird die Quelle der Einschlussregel sein.",
                  "hint": "Klicken Sie auf den Erweiterungspfeil neben Motorradtyp, um die Auswahlmöglichkeiten anzuzeigen."
                },
                {
                  "action": "Klicken Sie mit der rechten Maustaste auf die Auswahl 'Gelände' und wählen Sie 'Neue Einschlussregel'.",
                  "detail": "Die Aktion Neue Einschlussregel öffnet einen Dialog, in dem Sie angeben, welche Zielauswahlmöglichkeiten automatisch ausgewählt werden sollen, wenn Gelände gewählt wird. Dies stellt sicher, dass die richtigen Räder immer bei einer Geländekonfiguration eingeschlossen werden.",
                  "hint": "Die Option befindet sich möglicherweise in einem Kontextmenü oder unter einem Aktionen-Dropdown in der Auswahlzeile."
                },
                {
                  "action": "Wählen Sie im Einschlussregel-Dialog die Option Räder und wählen Sie 'Gelände Vorne' und 'Gelände Hinten' als Zielauswahlmöglichkeiten.",
                  "detail": "Indem Sie sowohl Gelände Vorne als auch Gelände Hinten Räder auswählen, definieren Sie, dass bei Auswahl des Gelände-Motorradtyps beide Geländeradtypen automatisch in die Konfiguration aufgenommen werden.",
                  "hint": "Wenn die Option Räder keine Mehrfachauswahl erlaubt, müssen Sie sie zuerst bearbeiten (siehe nächste Aufgabe)."
                },
                {
                  "action": "Wenn der Dialog die Auswahl mehrerer Radauswahlmöglichkeiten nicht zulässt, notieren Sie das Problem und fahren Sie mit der nächsten Aufgabe fort, um zuerst die Option Räder zu bearbeiten.",
                  "detail": "Die Option Räder ist möglicherweise standardmäßig auf Einzelauswahl gesetzt. Damit eine Einschlussregel mehrere Auswahlmöglichkeiten aus derselben Option ansprechen kann, muss diese Option Mehrfachauswahl zulassen. Dies ist ein häufiger Konfigurationsschritt beim Einrichten von Einschlussregeln.",
                  "hint": null
                }
              ]
            },
            {
              "id": "ex4-t2",
              "title": "Option Räder bearbeiten und Einschlussregel abschließen",
              "steps": [
                {
                  "action": "Klicken Sie im Optionspool mit der rechten Maustaste auf die Option Räder und wählen Sie 'Bearbeiten'.",
                  "detail": "Sie müssen die Option Räder von Einzelauswahl auf Mehrfachauswahl ändern, damit die Einschlussregel mehrere Radauswahlmöglichkeiten gleichzeitig ansprechen kann.",
                  "hint": "Suchen Sie nach einer Bearbeiten-Aktion im Kontextmenü oder in der Aktionssymbolleiste, wenn die Option Räder ausgewählt ist."
                },
                {
                  "action": "Ändern Sie die Einstellung 'Einzelauswahl' von 'Ja' auf 'Nein' und speichern Sie die Änderung.",
                  "detail": "Das Setzen von Einzelauswahl auf Nein ermöglicht die Auswahl mehrerer Auswahlmöglichkeiten für die Option Räder. Dies ist erforderlich, da der Geländemotorradtyp sowohl Gelände Vorne als auch Gelände Hinten Räder gleichzeitig auswählen muss.",
                  "hint": "Das Feld Einzelauswahl kann ein Kontrollkästchen oder ein Dropdown im Optionsbearbeitungsformular sein."
                },
                {
                  "action": "Kehren Sie zur Option Motorradtyp zurück, klicken Sie mit der rechten Maustaste auf 'Gelände' und wählen Sie erneut 'Neue Einschlussregel'.",
                  "detail": "Da die Option Räder jetzt Mehrfachauswahl unterstützt, können Sie die Einschlussregel erstellen, die sowohl Gelände Vorne als auch Gelände Hinten Radauswahlmöglichkeiten anspricht.",
                  "hint": null
                },
                {
                  "action": "Wählen Sie die Option Räder und wählen Sie sowohl 'Gelände Vorne' als auch 'Gelände Hinten' als Zielauswahlmöglichkeiten. Speichern Sie die Einschlussregel.",
                  "detail": "Die Einschlussregel ist jetzt vollständig. Immer wenn ein Benutzer Gelände als Motorradtyp auswählt, werden sowohl Gelände Vorne als auch Gelände Hinten Räder automatisch in die Konfiguration aufgenommen.",
                  "hint": "Halten Sie Strg gedrückt, während Sie klicken, um mehrere Auswahlmöglichkeiten in der Zielliste auszuwählen."
                },
                {
                  "action": "Überprüfen Sie, ob die Einschlussregel in der Registerkarte Einschlussregeln für die Auswahl Gelände erscheint.",
                  "detail": "Nach dem Speichern sollte die Regel in der Regelübersicht sichtbar sein. Bestätigen Sie, dass die Quelle Gelände und die Ziele Gelände Vorne und Gelände Hinten sind.",
                  "hint": "Navigieren Sie zu den Details der Auswahl Gelände und überprüfen Sie die Registerkarte oder den Abschnitt Einschlussregeln."
                }
              ]
            },
            {
              "id": "ex4-t3",
              "title": "Eine Ausschlussregel erstellen",
              "steps": [
                {
                  "action": "Navigieren Sie zum PTC Motorcycle-Teil der obersten Ebene in der Produktstruktur oder Optionspoolansicht.",
                  "detail": "Ausschlussregeln können aus dem Produktkontext der obersten Ebene erstellt werden. Sie werden eine Regel erstellen, die verhindert, dass inkompatible Radauswahlmöglichkeiten mit dem Geländemotorradtyp ausgewählt werden.",
                  "hint": "Wählen Sie das PTC Motorcycle-Produkt auf der obersten Ebene der Struktur aus."
                },
                {
                  "action": "Gehen Sie zur Registerkarte Ausschlussregeln.",
                  "detail": "Die Registerkarte Ausschlussregeln zeigt alle vorhandenen Ausschlussregeln für das Produkt an und bietet Aktionen zum Erstellen neuer Regeln. Diese zentrale Ansicht erleichtert die Verwaltung aller Inkompatibilitätsregeln.",
                  "hint": "Die Registerkarte befindet sich möglicherweise neben Einschlussregeln, Aktivierungsregeln und anderen regelbezogenen Registerkarten."
                },
                {
                  "action": "Klicken Sie auf 'Neue Ausschlussregel', um eine neue Ausschlussregel zu erstellen.",
                  "detail": "Sie werden eine Ausschlussregel definieren, die verhindert, dass Straßenräder ausgewählt werden, wenn der Geländemotorradtyp gewählt wird, und so sicherstellen, dass nur kompatible Radtypen verfügbar sind.",
                  "hint": "Suchen Sie nach einer Schaltfläche oder einem Symbol 'Neue Ausschlussregel' in der Symbolleiste über der Regeltabelle."
                },
                {
                  "action": "Setzen Sie die Quelle auf Motorradtyp = Gelände. Setzen Sie die Ziele auf Räder = Straße Vorne und Räder = Straße Hinten.",
                  "detail": "Diese Ausschlussregel besagt: Wenn Gelände als Motorradtyp ausgewählt wird, können die Auswahlmöglichkeiten Straße Vorne und Straße Hinten nicht ausgewählt werden. Dies verhindert, dass ein Benutzer versehentlich Straßenräder für ein Geländemotorrad auswählt.",
                  "hint": "Wählen Sie zuerst die Quelloption und -auswahl aus, dann wählen Sie die Zieloption und die auszuschließenden Auswahlmöglichkeiten."
                },
                {
                  "action": "Speichern Sie die Ausschlussregel und überprüfen Sie, ob sie in der Registerkarte Ausschlussregeln erscheint.",
                  "detail": "Die Ausschlussregel ist jetzt aktiv. In Kombination mit der Einschlussregel aus der vorherigen Aufgabe wird bei Auswahl von Gelände als Motorradtyp automatisch die Geländeräder eingeschlossen und die Straßenräder von der Auswahl ausgeschlossen.",
                  "hint": null
                }
              ]
            }
          ]
        }
      ],
      "keyTakeaways": [
        "Einschlussregeln wählen automatisch zugehörige Auswahlmöglichkeiten aus, wenn eine Quellauswahl getroffen wird",
        "Optionen müssen möglicherweise bearbeitet werden, um Mehrfachauswahl für Einschlussregeln zu unterstützen, die mehrere Auswahlmöglichkeiten ansprechen",
        "Ausschlussregeln verhindern, dass inkompatible Auswahlmöglichkeiten zusammen ausgewählt werden",
        "Regeln werden über die Registerkarten des Optionspools und die produktbezogenen Regelregisterkarten erstellt"
      ]
    }
  ]
},
    "modules/m4-option-sets.json": {
  "id": "m4",
  "title": "Optionssätze erkunden",
  "description": "Definieren Sie Optionssätze, erkunden Sie das Änderungsmanagement für Optionssätze, weisen Sie Optionssätze zu, wenden Sie Ausdrücke an und verwenden Sie Optionsfilter zur Variantengenerierung.",
  "topics": [
    {
      "id": "m4t1",
      "title": "Optionssätze und Änderungsmanagement",
      "estimatedMinutes": 5,
      "content": [
        {
          "type": "paragraph",
          "text": "Ein Optionssatz ist eine kuratierte Sammlung von Optionen, Auswahlmöglichkeiten und Regeln, die das Konfigurationsvokabular für eine bestimmte Produktfamilie definiert. Während der Optionspool jede jemals für einen Produktkontext definierte Option enthält, wählt ein Optionssatz nur die relevante Teilmenge aus, die für eine bestimmte Produktlinie benötigt wird. Das Verständnis, wie Optionssätze verwaltet, versioniert und gesteuert werden, ist für die Aufrechterhaltung zuverlässiger Produktkonfigurationen unerlässlich."
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Was ist ein Optionssatz?"
        },
        {
          "type": "paragraph",
          "text": "Ein Optionssatz bezieht seinen Inhalt aus dem Optionspool und verpackt ihn für die Verwendung mit einem bestimmten konfigurierbaren Produkt oder einer Produktfamilie. Er enthält die Optionen, Auswahlmöglichkeiten und Regeln, die gültige Konfigurationen für diese Familie definieren. Ein einzelner Optionspool kann mehrere Optionssätze speisen, die jeweils auf eine andere Produktlinie zugeschnitten sind. Diese Trennung ermöglicht es Organisationen, ein zentrales Verzeichnis von Optionen zu pflegen und gleichzeitig fokussierte Konfigurationsvokabulare für einzelne Produkte bereitzustellen."
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Optionspool vs. Optionssatz vs. Optionsfilter"
        },
        {
          "type": "comparison-table",
          "headers": [
            "Konzept",
            "Inhalt",
            "Geltungsbereich",
            "Zweck"
          ],
          "rows": [
            [
              "Optionspool",
              "Alle für einen Produktkontext definierten Optionen, Auswahlmöglichkeiten und Regeln",
              "Gesamter Produktkontext (alle Produktfamilien)",
              "Hauptverzeichnis aller konfigurierbaren Merkmale, die über die Produkte der Organisation verfügbar sind"
            ],
            [
              "Optionssatz",
              "Eine kuratierte Teilmenge von Optionen, Auswahlmöglichkeiten und Regeln aus dem Optionspool",
              "Bestimmte Produktfamilie oder konfigurierbares Produkt",
              "Definiert das gültige Konfigurationsvokabular für eine bestimmte Produktlinie, einschließlich anwendbarer Regeln"
            ],
            [
              "Optionsfilter",
              "Eine bestimmte Reihe von Auswahlselektionen, die auf einen Optionssatz angewendet werden",
              "Eine einzelne Konfigurationsinstanz",
              "Filtert eine überladene Produktstruktur auf die Teile, die für eine bestimmte Produktvariante benötigt werden"
            ]
          ]
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Änderungsmanagement für Optionssätze"
        },
        {
          "type": "paragraph",
          "text": "Optionssätze in Windchill sind verwaltete Objekte, die den standardmäßigen Änderungsmanagement-Workflows folgen. Dies bedeutet, dass sie Versionierung, Lebenszyklusstatus und Ein-/Auscheckoperationen unterstützen und sicherstellen, dass Änderungen an Produktkonfigurationsdefinitionen kontrolliert und nachverfolgbar sind."
        },
        {
          "type": "callout",
          "variant": "info",
          "text": "Optionssätze folgen denselben Änderungsmanagement-Prinzipien wie andere Windchill-Objekte. Sie können zum Bearbeiten ausgecheckt, zum Speichern eingecheckt, zur Nachverfolgung der Entwicklung versioniert und durch Lebenszyklusstatus (z. B. In Bearbeitung, Freigegeben) gesteuert werden. Dies stellt sicher, dass Konfigurationsdefinitionen immer prüfbar sind und dass nicht autorisierte Änderungen freigegebene Produkte nicht beeinflussen können."
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Steuerung von Optionssätzen"
        },
        {
          "type": "paragraph",
          "text": "Die Steuerung von Optionssätzen umfasst die Kontrolle darüber, wer sie erstellen, ändern und freigeben darf. Die Rolle des Options-Managers ist für die Pflege von Optionssätzen, das Hinzufügen oder Entfernen von Optionen und Auswahlmöglichkeiten, die Definition von Regeln und das Management des Lebenszyklus des Optionssatzes verantwortlich. Organisationen etablieren typischerweise Überprüfungs- und Genehmigungsprozesse, bevor ein Optionssatz für den Produktionseinsatz freigegeben wird."
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Testen Sie Ihr Wissen"
        },
        {
          "type": "interactive-match",
          "prompt": "Ordnen Sie jedes Konzept der Optionssatzverwaltung seiner Beschreibung zu:",
          "pairs": [
            {
              "left": "Optionssatz-Versionierung",
              "right": "Verfolgt Änderungen am Optionssatz im Laufe der Zeit und erstellt eine Historie der Konfigurationsdefinitionen"
            },
            {
              "left": "Ein-/Auschecken",
              "right": "Steuert gleichzeitiges Bearbeiten durch Sperren des Optionssatzes während der Bearbeitung"
            },
            {
              "left": "Lebenszyklusstatus",
              "right": "Steuert den Reifegrad des Optionssatzes (z. B. In Bearbeitung, In Prüfung, Freigegeben)"
            },
            {
              "left": "Options-Manager-Rolle",
              "right": "Die Windchill-Rolle, die für das Erstellen und Pflegen von Optionssätzen und deren Inhalt verantwortlich ist"
            }
          ]
        }
      ],
      "keyTakeaways": [
        "Ein Optionssatz ist eine kuratierte Sammlung von Optionen, Auswahlmöglichkeiten und Regeln aus dem Optionspool für eine bestimmte Produktfamilie",
        "Der Optionspool ist das Hauptverzeichnis; der Optionssatz ist eine fokussierte Teilmenge; der Optionsfilter wendet bestimmte Auswahlmöglichkeiten an, um eine Variante zu generieren",
        "Optionssätze sind verwaltete Objekte mit Versionierung, Lebenszyklusstatus und Ein-/Auschecken-Unterstützung",
        "Die Options-Manager-Rolle ist für das Erstellen, Pflegen und Steuern von Optionssätzen verantwortlich"
      ]
    },
    {
      "id": "m4t2",
      "title": "Optionssätze zuweisen und verwalten",
      "estimatedMinutes": 5,
      "content": [
        {
          "type": "paragraph",
          "text": "Nachdem ein Optionssatz erstellt und mit den entsprechenden Optionen, Auswahlmöglichkeiten und Regeln befüllt wurde, muss er einem konfigurierbaren Produkt oder konfigurierbaren Modul zugewiesen werden. Der Zuweisungsprozess verknüpft das Konfigurationsvokabular mit der Produktstruktur und ermöglicht die optionsbasierte Variantengenerierung. Eine ordnungsgemäße Verwaltung der Optionssatz-Mitgliedschaft stellt sicher, dass Produkte konfigurierbar bleiben, wenn sich die Anforderungen weiterentwickeln."
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Optionssätze zuweisen"
        },
        {
          "type": "paragraph",
          "text": "Optionssätze werden konfigurierbaren Produkten und konfigurierbaren Modulen über die Windchill-Benutzeroberfläche zugewiesen. Ein konfigurierbares Produkt muss einen zugewiesenen Optionssatz haben, bevor Optionsfilter angewendet oder Varianten generiert werden können. Konfigurierbare Module innerhalb der Produktstruktur können auch eigene Optionssätze haben, sodass verschiedene Abschnitte des Produkts bei Bedarf unterschiedliche Konfigurationsvokabulare verwenden können."
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Wichtige Schritte zur Zuweisung von Optionssätzen"
        },
        {
          "type": "reveal-cards",
          "cards": [
            {
              "front": "Schritt 1: Zum konfigurierbaren Produkt navigieren",
              "back": "Öffnen Sie das konfigurierbare Produkt in Windchill und suchen Sie das Aktionsmenü oder die Registerkarte Optionssatz. Das Produkt muss bereits als Konfigurierbares Produkt gekennzeichnet sein, bevor ein Optionssatz zugewiesen werden kann."
            },
            {
              "front": "Schritt 2: Aktion Optionssatz zuweisen auswählen",
              "back": "Verwenden Sie das Aktionsmenü oder die Registerkarte Optionssatz, um die Zuweisung zu initiieren. Windchill zeigt eine Liste der verfügbaren Optionssätze aus dem Produktkontext an. Nur Optionssätze, die zum selben Produktkontext (oder einem gemeinsamen Kontext) gehören, sind für die Zuweisung verfügbar."
            },
            {
              "front": "Schritt 3: Den entsprechenden Optionssatz auswählen",
              "back": "Wählen Sie den Optionssatz aus, der die für diese Produktfamilie relevanten Optionen, Auswahlmöglichkeiten und Regeln enthält. Überprüfen Sie den Inhalt des Optionssatzes, um sicherzustellen, dass er alle erforderlichen Konfigurationsparameter enthält, bevor Sie die Zuweisung abschließen."
            },
            {
              "front": "Schritt 4: Zuweisung überprüfen",
              "back": "Überprüfen Sie nach der Zuweisung, ob der Optionssatz auf der Registerkarte Optionssatz des Produkts erscheint. Bestätigen Sie, dass die Optionen und Auswahlmöglichkeiten aus dem zugewiesenen Satz jetzt für die Verwendung in Ausdrücken und Optionsfiltern der Produktstruktur verfügbar sind."
            }
          ]
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Verwaltung der Optionssatz-Mitgliedschaft"
        },
        {
          "type": "paragraph",
          "text": "Wenn sich die Produktanforderungen weiterentwickeln, müssen Optionssätze aktualisiert werden, um neue Optionen, zusätzliche Auswahlmöglichkeiten oder geänderte Regeln widerzuspiegeln. Der Options-Manager kann neue Optionen aus dem Optionspool hinzufügen, neue Auswahlmöglichkeiten zu vorhandenen Optionen innerhalb des Satzes hinzufügen, nicht mehr relevante Optionen oder Auswahlmöglichkeiten entfernen und Regeln aktualisieren, um die sich ändernde Geschäftslogik widerzuspiegeln. Alle Änderungen erfordern, dass der Optionssatz zuerst ausgecheckt wird, und Änderungen sind für andere erst nach dem Einchecken sichtbar."
        },
        {
          "type": "callout",
          "variant": "tip",
          "text": "Best Practice: Organisieren Sie Optionssätze nach Produktfamilie, nicht nach einzelnem Produkt. Ein gut gestalteter Optionssatz deckt alle Konfigurationen innerhalb einer Produktfamilie ab. Vermeiden Sie es, einen Optionssatz pro Produktvariante zu erstellen, da dies den Zweck konfigurierbarer Produkte untergräbt und unnötigen Wartungsaufwand verursacht."
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Den Zuweisungsprozess ordnen"
        },
        {
          "type": "interactive-sort",
          "prompt": "Ordnen Sie die Schritte zur Zuweisung eines Optionssatzes zu einem konfigurierbaren Produkt in der richtigen Reihenfolge an:",
          "correctOrder": [
            "Zum konfigurierbaren Produkt in Windchill navigieren",
            "Das Aktionsmenü öffnen und Optionssatz zuweisen auswählen",
            "Den entsprechenden Optionssatz aus der verfügbaren Liste auswählen",
            "Die Zuweisung bestätigen und überprüfen, ob der Optionssatz beim Produkt erscheint"
          ]
        }
      ],
      "keyTakeaways": [
        "Optionssätze müssen konfigurierbaren Produkten zugewiesen werden, bevor Optionsfilter oder Variantengenerierung verwendet werden können",
        "Der Zuweisungsprozess umfasst das Navigieren zum Produkt, das Auswählen der Aktion Optionssatz zuweisen, das Auswählen des Satzes und die Überprüfung",
        "Die Optionssatz-Mitgliedschaft kann durch Hinzufügen oder Entfernen von Optionen, Auswahlmöglichkeiten und Regeln aktualisiert werden, wenn sich die Anforderungen weiterentwickeln",
        "Best Practice ist die Organisation von Optionssätzen nach Produktfamilie statt nach einzelner Produktvariante"
      ]
    },
    {
      "id": "m4t3",
      "title": "Ausdrücke und Optionsfilter",
      "estimatedMinutes": 5,
      "content": [
        {
          "type": "paragraph",
          "text": "Ausdrücke und Optionsfilter sind die Mechanismen, die Optionsauswahlmöglichkeiten mit der Produktstruktur verbinden. Ausdrücke werden Teilen und Verknüpfungen zugewiesen, um festzulegen, wann eine Komponente in eine Variante aufgenommen werden soll. Optionsfilter verwenden die zugewiesenen Ausdrücke, um zu evaluieren, welche Teile basierend auf den Auswahlselektionen des Benutzers zu einer bestimmten Konfiguration gehören."
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Grundausdrücke vs. Erweiterte Ausdrücke"
        },
        {
          "type": "paragraph",
          "text": "Windchill unterstützt zwei Arten von Ausdrücken zur Zuweisung von Auswahlmöglichkeiten an Teile und Verknüpfungen. Grundausdrücke verwenden einfache Auswahlreferenzen, während erweiterte Ausdrücke Operatoren und Funktionen für komplexe Auswahllogik hinzufügen. Die Art des Ausdrucks, die Sie verwenden, hängt von der Komplexität Ihrer Konfigurationsanforderungen und davon ab, ob eine Creo-Integration erforderlich ist."
        },
        {
          "type": "comparison-table",
          "headers": [
            "Aspekt",
            "Grundausdruck",
            "Erweiterter Ausdruck"
          ],
          "rows": [
            [
              "Syntax",
              "Einfache Auswahlreferenz (z. B. Farbe=Rot)",
              "Umfasst Auswahlmöglichkeiten, Operatoren (UND, ODER, NICHT) und Funktionen"
            ],
            [
              "Fähigkeit",
              "Weist eine einzelne Auswahl oder eine einfache Liste von Auswahlmöglichkeiten einem Teil oder einer Verknüpfung zu",
              "Unterstützt komplexe logische Bedingungen, die mehrere Optionen und Auswahlmöglichkeiten mit booleschen Operatoren kombinieren"
            ],
            [
              "Creo-Unterstützung",
              "Wird von Windchill an Creo übergeben und in beiden Systemen unterstützt",
              "Verbleibt nur in Windchill; wird NICHT an Creo übergeben"
            ],
            [
              "Anwendungsfälle",
              "Unkomplizierte Konfigurationen, bei denen ein Teil einbezogen wird, wenn eine einzelne Auswahl getroffen wird",
              "Komplexe Konfigurationen, bei denen die Einbeziehung eines Teils von Kombinationen von Auswahlmöglichkeiten über mehrere Optionen abhängt"
            ],
            [
              "Beispiel",
              "Motorradtyp = Gelände",
              "(Motorradtyp = Gelände) UND (Hubraum = 1200cc)"
            ],
            [
              "Erforderliche Präferenz",
              "Unterstützte Ausdrücke-Präferenz auf Grund oder Beide gesetzt",
              "Unterstützte Ausdrücke-Präferenz auf Beide gesetzt"
            ]
          ]
        },
        {
          "type": "callout",
          "variant": "warning",
          "text": "Erweiterte Ausdrücke werden NICHT von Windchill an Creo übergeben. Wenn Ihr Workflow die Konfiguration von Varianten in Creo beinhaltet, müssen Sie Grundausdrücke für alle Auswahlzuweisungen verwenden, die in Creo sichtbar sein müssen. Planen Sie Ihre Ausdrucksstrategie sorgfältig basierend auf Ihren Creo-Integrationsanforderungen."
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Optionsfilter"
        },
        {
          "type": "paragraph",
          "text": "Ein Optionsfilter ist eine Reihe von Auswahlselektionen, die auf eine überladene Produktstruktur angewendet werden, um eine gefilterte Variante zu generieren. Wenn Sie einen Optionsfilter erstellen, wählen Sie bestimmte Auswahlmöglichkeiten für jede Option im zugewiesenen Optionssatz aus. Windchill evaluiert dann die Ausdrücke an jedem Teil und jeder Verknüpfung in der Struktur und bezieht nur die Teile ein, deren Ausdrücke mit den ausgewählten Auswahlmöglichkeiten übereinstimmen. Das Ergebnis ist eine reduzierte Struktur, die eine bestimmte Produktvariante darstellt."
        },
        {
          "type": "heading",
          "level": 2,
          "text": "Optionsfilter-Konzepte"
        },
        {
          "type": "reveal-cards",
          "cards": [
            {
              "front": "Einen Optionsfilter erstellen",
              "back": "Navigieren Sie zur konfigurierbaren Produktstruktur und wählen Sie die Aktion Optionsfilter erstellen. Windchill zeigt die Optionen aus dem zugewiesenen Optionssatz an. Wählen Sie für jede Option eine Auswahl aus, um die Filterkriterien zu definieren. Regeln im Optionssatz erzwingen automatisch gültige Auswahlkombinationen."
            },
            {
              "front": "Einen Optionsfilter anwenden",
              "back": "Nach der Erstellung wird der Optionsfilter auf die überladene Struktur angewendet. Windchill evaluiert den Ausdruck jedes Teils anhand der Auswahlmöglichkeiten des Filters. Teile, deren Ausdrücke übereinstimmen, werden einbezogen; Teile, deren Ausdrücke nicht übereinstimmen, werden ausgeschlossen. Das Ergebnis ist eine gefilterte Struktur, die nur die Komponenten für diese spezifische Variante zeigt."
            },
            {
              "front": "Variantenspezifikation",
              "back": "Wenn ein Optionsfilter angewendet wird, um eine Variante zu generieren, erstellt Windchill eine Variantenspezifikation, die die genauen verwendeten Auswahlmöglichkeiten aufzeichnet. Diese Spezifikation ermöglicht die Wiederverwendung von Varianten — wenn dieselben Auswahlmöglichkeiten später angefordert werden, kann Windchill die vorhandene Variante finden und wiederverwenden, anstatt eine neue zu generieren."
            },
            {
              "front": "Regeldurchsetzung während der Filterung",
              "back": "Einschluss-, Ausschluss-, Aktivierungs- und bedingte Regeln werden während des Optionsfilterprozesses durchgesetzt. Wenn ein Benutzer eine Auswahl trifft, die eine Einschlussregel auslöst, werden die zugehörigen Auswahlmöglichkeiten automatisch ausgewählt. Wenn eine Auswahl eine Ausschlussregel verletzt, wird sie verhindert. Dies stellt sicher, dass jede generierte Variante gültig ist."
            }
          ]
        },
        {
          "type": "callout",
          "variant": "insight",
          "text": "Der Optionsfilter ist der Punkt, an dem alles zusammenkommt: Der Optionssatz liefert das Vokabular, Ausdrücke verknüpfen Auswahlmöglichkeiten mit Teilen, Regeln erzwingen gültige Kombinationen, und der Filter wendet bestimmte Auswahlmöglichkeiten an, um die überladene Struktur zu einer konkreten Variante zu reduzieren. Die Beherrschung von Optionsfiltern ist der Schlüssel zur effektiven Produktkonfiguration in Windchill."
        }
      ],
      "keyTakeaways": [
        "Grundausdrücke verwenden einfache Auswahlreferenzen und werden an Creo übergeben; erweiterte Ausdrücke verwenden boolesche Logik und verbleiben nur in Windchill",
        "Ausdrücke werden Teilen und Verknüpfungen zugewiesen, um festzulegen, wann eine Komponente in eine Variante aufgenommen wird",
        "Optionsfilter wenden bestimmte Auswahlselektionen auf eine überladene Struktur an, um eine gefilterte Variante zu generieren",
        "Variantenspezifikationen zeichnen die zur Generierung einer Variante verwendeten Auswahlmöglichkeiten auf und ermöglichen die Wiederverwendung vorhandener Varianten"
      ]
    },
    {
      "id": "m4t4",
      "title": "Optionssatz zuweisen und Filter anwenden",
      "estimatedMinutes": 5,
      "isExercise": true,
      "content": [
        {
          "type": "paragraph",
          "text": "In dieser Übung weisen Sie dem konfigurierbaren Produkt PTC Motorcycle einen Optionssatz zu und erstellen und wenden dann einen Optionsfilter an, um eine gefilterte Variantenstruktur zu generieren. Diese Übung verbindet die Konzepte aus den vorherigen Themen: Optionssätze, Ausdrücke und Optionsfilter."
        },
        {
          "type": "callout",
          "variant": "warning",
          "text": "Diese Übung baut auf den vorherigen Übungen auf. Stellen Sie sicher, dass Sie die Übungen zur Options- und Regelerstellung abgeschlossen haben, bevor Sie fortfahren. Der in dieser Übung referenzierte Optionssatz sollte bereits im PTC Motorcycle-Produktkontext vorhanden sein."
        },
        {
          "type": "exercise",
          "exerciseId": "ex5",
          "title": "Optionssatz zuweisen und Filter anwenden",
          "objective": "Lernen Sie, wie Sie einem konfigurierbaren Produkt einen Optionssatz zuweisen und einen Optionsfilter anwenden, um eine gefilterte Variantenstruktur zu generieren.",
          "tasks": [
            {
              "id": "ex5-t1",
              "title": "Den Optionssatz dem konfigurierbaren Produkt zuweisen",
              "steps": [
                {
                  "action": "Navigieren Sie zum konfigurierbaren Produkt PTC Motorcycle. Gehen Sie zu Durchsuchen > Produkte und wählen Sie PTC Motorcycle.",
                  "detail": "PTC Motorcycle ist das konfigurierbare Produkt, das in diesem Kurs durchgehend verwendet wird. Sie werden den vorhandenen Optionssatz diesem Produkt zuweisen, damit Optionsfilter auf seine überladene Struktur angewendet werden können.",
                  "hint": "Melden Sie sich als Anna Chen oder Ihrem zugewiesenen Schulungsbenutzer an. PTC Motorcycle sollte in der Produktliste erscheinen."
                },
                {
                  "action": "Öffnen Sie das Aktionsmenü auf der PTC Motorcycle-Produktseite und wählen Sie 'Optionssatz zuweisen'.",
                  "detail": "Die Aktion Optionssatz zuweisen verknüpft einen Optionssatz mit dem konfigurierbaren Produkt. Diese Aktion ist über das Aktionsmenü auf Produktebene oder über die Registerkarte Optionssatz verfügbar. Ein Produkt muss einen zugewiesenen Optionssatz haben, bevor Optionsfilter erstellt werden können.",
                  "hint": "Wenn Sie die Aktion Optionssatz zuweisen nicht sehen, überprüfen Sie, ob das Produkt als Konfigurierbares Produkt gekennzeichnet ist und ob Sie die entsprechenden Berechtigungen haben."
                },
                {
                  "action": "Wählen Sie im Zuweisungsdialog den PTC Motorcycle-Optionssatz aus der Liste der verfügbaren Optionssätze aus.",
                  "detail": "Der Dialog zeigt die in diesem Produktkontext verfügbaren Optionssätze an. Wählen Sie den Optionssatz aus, der die Optionen Motorradtyp, Hubraum, Farbe, Räder und Satteltaschenposition zusammen mit den in vorherigen Übungen erstellten Einschluss- und Ausschlussregeln enthält.",
                  "hint": "Wenn mehrere Optionssätze erscheinen, wählen Sie denjenigen, der den in früheren Übungen erstellten Optionen und Regeln entspricht."
                },
                {
                  "action": "Bestätigen Sie die Zuweisung und überprüfen Sie, ob der Optionssatz jetzt auf der Registerkarte Optionssatz von PTC Motorcycle erscheint.",
                  "detail": "Nach der Zuweisung sollte die Registerkarte Optionssatz den zugewiesenen Optionssatz mit allen seinen Optionen, Auswahlmöglichkeiten und Regeln anzeigen. Durchsuchen Sie die Optionen, um zu bestätigen, dass die Optionen Motorradtyp, Hubraum, Farbe, Räder und Satteltaschenposition mit ihren jeweiligen Auswahlmöglichkeiten vorhanden sind.",
                  "hint": "Klicken Sie auf die Registerkarte Optionssatz auf der Produktseite. Erweitern Sie die Optionen, um Auswahlmöglichkeiten und Regeln zu überprüfen."
                }
              ]
            },
            {
              "id": "ex5-t2",
              "title": "Einen Optionsfilter erstellen und anwenden",
              "steps": [
                {
                  "action": "Navigieren Sie zur PTC Motorcycle-Produktstruktur, indem Sie auf die Registerkarte Struktur klicken.",
                  "detail": "Die Registerkarte Struktur zeigt die überladene Produktstruktur mit allen möglichen Designvariationen an. Sie werden einen Optionsfilter erstellen, um diese Struktur basierend auf Ihren Auswahlselektionen auf eine bestimmte Variante zu reduzieren.",
                  "hint": "Die Registerkarte Struktur zeigt die vollständige Stückliste mit allen konfigurierbaren Modulen und ihren untergeordneten Teilen."
                },
                {
                  "action": "Klicken Sie auf die Aktion 'Optionsfilter erstellen' in der Symbolleiste oder im Aktionsmenü der Strukturansicht.",
                  "detail": "Die Aktion Optionsfilter erstellen öffnet einen Dialog, der alle Optionen aus dem zugewiesenen Optionssatz anzeigt. Sie werden bestimmte Auswahlmöglichkeiten für jede Option auswählen, um die Filterkriterien für die zu generierende Variante zu definieren.",
                  "hint": "Suchen Sie nach einem Filtersymbol oder einer 'Optionsfilter'-Aktion in der Symbolleiste über dem Strukturbaum."
                },
                {
                  "action": "Wählen Sie 'Gelände' für die Option Motorradtyp.",
                  "detail": "Die Auswahl von Gelände definiert diese Variante als Gelände-Motorradkonfiguration. Beachten Sie, dass die von Ihnen erstellte Einschlussregel automatisch Gelände Vorne und Gelände Hinten für die Option Räder auswählt und die Ausschlussregel verhindert, dass Straße Vorne und Straße Hinten ausgewählt werden.",
                  "hint": "Beobachten Sie, wie die Auswahlmöglichkeiten der Option Räder automatisch aktualisiert werden, wenn die Einschluss- und Ausschlussregeln angewendet werden."
                },
                {
                  "action": "Wählen Sie Auswahlmöglichkeiten für die verbleibenden Optionen: wählen Sie einen Hubraum (z. B. 1000cc), eine Farbe (z. B. Schwarz) und überprüfen Sie die Satteltaschenposition (z. B. Nicht verwendet).",
                  "detail": "Vervollständigen Sie den Optionsfilter, indem Sie für jede verbleibende Option eine Auswahl treffen. Die Kombination aller Auswahlmöglichkeiten definiert eine bestimmte Produktvariante. Regeln erzwingen weiterhin gültige Kombinationen, während Sie Auswahlen treffen.",
                  "hint": "Wenn bestimmte Auswahlmöglichkeiten ausgegraut oder nicht verfügbar sind, prüfen Sie, ob eine Regel sie basierend auf Ihren vorherigen Auswahlen einschränkt."
                },
                {
                  "action": "Klicken Sie auf 'Anwenden' oder 'OK', um den Optionsfilter auf die Produktstruktur anzuwenden.",
                  "detail": "Windchill evaluiert die Ausdrücke, die jedem Teil und jeder Verknüpfung in der überladenen Struktur zugewiesen sind, anhand Ihrer ausgewählten Auswahlmöglichkeiten. Teile, deren Ausdrücke übereinstimmen, werden in das gefilterte Ergebnis aufgenommen; Teile, die nicht übereinstimmen, werden ausgeschlossen. Die Strukturansicht wird aktualisiert, um nur die Komponenten für diese spezifische Variante anzuzeigen.",
                  "hint": "Die gefilterte Struktur sollte merklich kleiner sein als die vollständige überladene Struktur und nur die für die Geländevariante relevanten Teile enthalten."
                }
              ]
            },
            {
              "id": "ex5-t3",
              "title": "Die gefilterte Struktur überprüfen",
              "steps": [
                {
                  "action": "Untersuchen Sie die in der Registerkarte Struktur angezeigte gefilterte Struktur. Notieren Sie, welche Teile einbezogen und welche entfernt wurden.",
                  "detail": "Die gefilterte Struktur repräsentiert die Geländevariante des PTC Motorcycle. Vergleichen Sie sie mit der vollständigen überladenen Struktur, die Sie zuvor gesehen haben. Teile, die mit Straßenkomponenten verbunden sind (z. B. Straßenräder, Straßenbeleuchtung), sollten fehlen, während geländespezifische Teile vorhanden sein sollten.",
                  "hint": "Erweitern Sie den Strukturbaum, um die vollständige Hierarchie der einbezogenen Teile zu sehen."
                },
                {
                  "action": "Vergleichen Sie die gefilterte Struktur mit der vollständigen überladenen Struktur, indem Sie den Optionsfilter ein- und ausschalten (wenn die Oberfläche dies unterstützt) oder indem Sie die Unterschiede notieren.",
                  "detail": "Die überladene Struktur enthält alle möglichen Teile für alle Varianten. Die gefilterte Struktur enthält nur die Teile für die von Ihnen angegebene Geländekonfiguration. Der Unterschied zwischen beiden veranschaulicht, wie Optionsfilter die Komplexität reduzieren, indem sie die Struktur auf eine einzelne gültige Konfiguration eingrenzen.",
                  "hint": "Einige Windchill-Versionen ermöglichen es Ihnen, den Filter zu löschen, um zur vollständigen überladenen Ansicht zurückzukehren. Suchen Sie nach einer 'Filter löschen'- oder 'Alle anzeigen'-Aktion."
                },
                {
                  "action": "Identifizieren Sie, welche konfigurierbaren Module vom Filter betroffen waren, und verstehen Sie, warum bestimmte Teile basierend auf den von Ihnen ausgewählten Auswahlmöglichkeiten einbezogen oder ausgeschlossen wurden.",
                  "detail": "Jedes konfigurierbare Modul in der Struktur wurde möglicherweise unterschiedlich gefiltert, abhängig davon, welche Ausdrücke seinen untergeordneten Teilen zugewiesen waren. Beispielsweise sollte das Räder-Modul jetzt nur Geländeradteile anzeigen, da die Auswahlmöglichkeiten Gelände Vorne und Gelände Hinten ausgewählt (über die Einschlussregel) und die Straßenauswahlmöglichkeiten ausgeschlossen wurden.",
                  "hint": "Klicken Sie auf einzelne Teile, um deren zugewiesene Ausdrücke zu sehen und zu verstehen, warum sie vom Filter einbezogen oder ausgeschlossen wurden."
                },
                {
                  "action": "Notieren Sie die erstellte Variantenspezifikation. Überprüfen Sie die aufgezeichneten Auswahlmöglichkeiten, um zu bestätigen, dass sie Ihren Filterauswahlen entsprechen.",
                  "detail": "Windchill zeichnet eine Variantenspezifikation auf, die die genauen Auswahlmöglichkeiten dokumentiert, die zur Generierung dieser Variante verwendet wurden. Diese Spezifikation ermöglicht die Wiederverwendung von Varianten: Wenn jemand in Zukunft dieselbe Kombination von Auswahlmöglichkeiten anfordert, kann Windchill diese vorhandene Variante finden, anstatt eine neue zu generieren, was Zeit spart und Konsistenz gewährleistet.",
                  "hint": "Suchen Sie nach einem Link oder einer Registerkarte Variantenspezifikation, die mit der gefilterten Strukturansicht verknüpft ist."
                }
              ]
            }
          ]
        }
      ],
      "keyTakeaways": [
        "Ein Optionssatz muss einem konfigurierbaren Produkt zugewiesen werden, bevor Optionsfilter erstellt werden können",
        "Die Erstellung eines Optionsfilters umfasst die Auswahl bestimmter Auswahlmöglichkeiten für jede Option im zugewiesenen Optionssatz",
        "Regeln werden während des Filterprozesses automatisch durchgesetzt und stellen sicher, dass nur gültige Auswahlkombinationen möglich sind",
        "Die gefilterte Struktur zeigt nur die für die ausgewählte Variante relevanten Teile und reduziert die Komplexität der vollständigen überladenen Struktur"
      ]
    },
    {
      "id": "m4t5",
      "title": "Kursüberprüfung und Zusammenfassung",
      "estimatedMinutes": 5,
      "isExercise": true,
      "content": [
        {
          "type": "paragraph",
          "text": "Diese abschließende Übung überprüft die Schlüsselkonzepte aus allen vier Modulen des Kurses Optionen und konfigurierbare Produkte. Verwenden Sie diese Zusammenfassung, um Ihr Verständnis zu validieren und Bereiche zu identifizieren, die möglicherweise einer weiteren Überprüfung bedürfen, bevor Sie diese Konzepte in Ihrer täglichen Arbeit mit Windchill anwenden."
        },
        {
          "type": "callout",
          "variant": "info",
          "text": "Dies ist eine Überprüfungsübung. Arbeiten Sie jede Aufgabe durch, um die wichtigsten Konzepte des Kurses zu wiederholen. Verwenden Sie die Hinweise, um Ihr Gedächtnis zu Themen aufzufrischen, die weniger vertraut erscheinen."
        },
        {
          "type": "exercise",
          "exerciseId": "ex6",
          "title": "Kursüberprüfung und Zusammenfassung",
          "objective": "Überprüfen Sie die Schlüsselkonzepte aus allen vier Modulen und validieren Sie Ihr Verständnis von Optionen und konfigurierbaren Produkten.",
          "tasks": [
            {
              "id": "ex6-t1",
              "title": "Schlüsselkonzepte überprüfen",
              "steps": [
                {
                  "action": "Erinnern Sie sich an die fünf Geschäftsstrategien für Produktvariabilität: Auftragsmontage, Lagermontage, Auftragskonfiguration, Auftragskonstruktion und Vertrag.",
                  "detail": "Jede Strategie unterscheidet sich im Grad der Beteiligung der Produktentwicklung pro Auftrag. Auftragsmontage erfordert keine Konstruktionsbeteiligung pro Auftrag, während Vertrag eine vollständige kundenspezifische Konstruktion erfordert. Windchill OCP unterstützt hauptsächlich Auftragsmontage- und Auftragskonfigurationsstrategien.",
                  "hint": "Der wesentliche Unterschied ist, wie viel Konstruktionsbeteiligung für jeden Kundenauftrag erforderlich ist."
                },
                {
                  "action": "Überprüfen Sie die vier Schritte des generischen Plattformdesigns: Anforderungen analysieren, vorhandene Produkte auf Wiederverwendung prüfen, generische Produktdefinition erstellen und Plattform freigeben und pflegen.",
                  "detail": "Plattformdesign etabliert die wiederverwendbare Grundlage, aus der alle Produktvarianten abgeleitet werden. Eine gut gestaltete Plattform maximiert die Teilwiederverwendung und identifiziert klar, welche Abschnitte fest und welche variabel sind.",
                  "hint": "Prüfen Sie immer vorhandene Produkte auf Wiederverwendbarkeit, bevor Sie neue Designs von Grund auf erstellen."
                },
                {
                  "action": "Erinnern Sie sich an das Konzept einer überladenen Produktstruktur und wie sie alle möglichen Designvariationen für ein konfigurierbares Produkt enthält.",
                  "detail": "Eine überladene Struktur enthält ALLE Designalternativen unter konfigurierbaren Modulen. Während der Variantengenerierung reduzieren Optionsfilter diese Struktur auf nur die Teile, die für eine bestimmte Konfiguration benötigt werden. Die überladene Struktur ist die Hauptstruktur, aus der alle Varianten abgeleitet werden.",
                  "hint": "Stellen Sie sich die überladene Struktur als Obermenge und die gefilterte Variante als Teilmenge vor."
                },
                {
                  "action": "Überprüfen Sie die drei konfigurierbaren Objekte und ihre Hierarchie: Konfigurierbares Produkt, Konfigurierbares Modul und Modulvariante.",
                  "detail": "Das Konfigurierbare Produkt ist das Endprodukt der obersten Ebene, das die vollständige überladene Struktur enthält. Konfigurierbare Module sind Abschnitte, die Variabilität mit mehreren Designalternativen erfassen. Modulvarianten sind die spezifischen Teile, die aus einem konfigurierbaren Modul nach Anwendung von Optionsfiltern ausgewählt werden.",
                  "hint": "Die Hierarchie fließt vom Breitesten (Konfigurierbares Produkt) zum Spezifischsten (Modulvariante)."
                }
              ]
            },
            {
              "id": "ex6-t2",
              "title": "Optionen- und Varianten-Einrichtung überprüfen",
              "steps": [
                {
                  "action": "Überprüfen Sie die wichtigsten O&V-Begriffe: Optionen, Auswahlmöglichkeiten, Optionspool, Optionssatz, Optionsfilter, Ausdrücke, Variantenspezifikation, Konfigurierbares Modul und Options-Manager-Rolle.",
                  "detail": "Optionen repräsentieren variable Produktmerkmale, jeweils mit einer oder mehreren Auswahlmöglichkeiten. Der Optionspool ist das Hauptverzeichnis; Optionssätze sind kuratierte Teilmengen für Produktfamilien. Optionsfilter wenden Auswahlmöglichkeiten an, um Varianten zu generieren. Ausdrücke verknüpfen Auswahlmöglichkeiten mit Teilen. Variantenspezifikationen zeichnen die verwendeten Auswahlmöglichkeiten auf.",
                  "hint": "Die Begriffe fallen in drei Kategorien: Strukturbegriffe, Logikbegriffe und Verwaltungsbegriffe."
                },
                {
                  "action": "Erinnern Sie sich an den Unterschied zwischen Optionspool und Optionssatz und erklären Sie, warum beide benötigt werden.",
                  "detail": "Der Optionspool enthält ALLE Optionen und Auswahlmöglichkeiten für einen Produktkontext — er ist der Hauptkatalog. Der Optionssatz wählt nur die relevanten Optionen für eine bestimmte Produktfamilie aus. Diese Trennung ermöglicht Wiederverwendung: Dieselbe Option (z. B. Farbe) kann in mehreren Optionssätzen für verschiedene Produktfamilien erscheinen, ohne Duplikation.",
                  "hint": "Der Optionspool ist die Obermenge; der Optionssatz ist eine fokussierte Teilmenge, die auf eine Produktfamilie zugeschnitten ist."
                },
                {
                  "action": "Überprüfen Sie die beiden Konfigurationsansätze: Top-Down (Windchill zuerst) und Bottom-Up (Creo zuerst) sowie die Einschränkung, dass nur Grundausdrücke an Creo übertragen werden.",
                  "detail": "Top-Down beginnt mit der Teilestruktur in Windchill und gibt an Creo weiter. Bottom-Up beginnt mit der überladenen Baugruppe in Creo und checkt sie in Windchill ein. Unabhängig vom Ansatz werden nur Grundausdrücke von Windchill an Creo übergeben — erweiterte Ausdrücke verbleiben nur in Windchill.",
                  "hint": "Der Ansatz hängt davon ab, ob PLM oder CAD Ihre Produktstruktur bestimmt."
                },
                {
                  "action": "Erinnern Sie sich an die Präferenz Unterstützung konfigurierbarer Module und ihre Bedeutung sowie daran, wie Präferenzen von Standort- über Organisations- zu Produktebene vererbt werden.",
                  "detail": "Die Unterstützung konfigurierbarer Module muss auf Ja gesetzt sein, um O&V-Funktionalität zu nutzen — der Standard ist Nein. Präferenzen werden von höheren Ebenen (Standort) an niedrigere Ebenen (Organisation, Produkt) vererbt und können auf jeder Ebene gesperrt oder überschrieben werden. Standortadministratoren, Organisationsadministratoren, Produktmanager und Bibliotheksmanager können O&V-Präferenzen ändern.",
                  "hint": "Wenn O&V-Funktionen nicht verfügbar sind, ist die Unterstützung konfigurierbarer Module auf der entsprechenden Ebene zuerst zu prüfen."
                }
              ]
            },
            {
              "id": "ex6-t3",
              "title": "Regeln und Optionssätze überprüfen",
              "steps": [
                {
                  "action": "Überprüfen Sie die vier Regeltypen: Einschlussregeln (automatische Auswahl zugehöriger Auswahlmöglichkeiten), Ausschlussregeln (Verhinderung inkompatibler Auswahlmöglichkeiten), Aktivierungsregeln (Steuerung der Auswahlsichtbarkeit) und bedingte Regeln (WENN/DANN-Logik).",
                  "detail": "Einschlussregeln erzwingen, dass zugehörige Auswahlmöglichkeiten zusammen ausgewählt werden. Ausschlussregeln verhindern, dass widersprüchliche Auswahlmöglichkeiten koexistieren. Aktivierungsregeln zeigen oder verbergen Auswahlmöglichkeiten dynamisch basierend auf vorherigen Auswahlen. Bedingte Regeln bieten komplexe WENN/DANN-Logik mit mehreren Bedingungen. Windchill validiert Regeln, um Konflikte und Duplikate zu verhindern.",
                  "hint": "Einschluss und Ausschluss behandeln einfache Beziehungen; Aktivierung und bedingt behandeln komplexere Szenarien."
                },
                {
                  "action": "Überprüfen Sie Optionssätze, ihr Änderungsmanagement (Versionierung, Lebenszyklusstatus, Ein-/Auschecken) und den Prozess zur Zuweisung eines Optionssatzes zu einem konfigurierbaren Produkt.",
                  "detail": "Optionssätze sind verwaltete Objekte mit voller Änderungsmanagement-Unterstützung. Sie müssen zum Bearbeiten ausgecheckt und zum Speichern eingecheckt werden. Der Zuweisungsprozess umfasst das Navigieren zum konfigurierbaren Produkt, das Auswählen von Optionssatz zuweisen aus dem Aktionsmenü, das Auswählen des entsprechenden Satzes und die Überprüfung der Zuweisung.",
                  "hint": "Optionssätze folgen denselben Änderungsmanagement-Workflows wie andere Windchill-Objekte."
                },
                {
                  "action": "Überprüfen Sie Ausdrücke (Grund vs. Erweitert) und wie sie Optionsauswahlmöglichkeiten mit Teilen und Verknüpfungen in der Produktstruktur verknüpfen.",
                  "detail": "Grundausdrücke verwenden einfache Auswahlreferenzen (z. B. Farbe=Rot) und werden sowohl in Windchill als auch in Creo unterstützt. Erweiterte Ausdrücke verwenden boolesche Operatoren (UND, ODER, NICHT) für komplexe Logik, verbleiben aber nur in Windchill. Ausdrücke werden Teilen und Verknüpfungen zugewiesen, um festzulegen, wann eine Komponente in eine Variante aufgenommen wird.",
                  "hint": "Erweiterte Ausdrücke sind leistungsfähiger, können aber nicht an Creo übergeben werden."
                },
                {
                  "action": "Überprüfen Sie Optionsfilter und wie sie alles zusammenbringen: Der Optionssatz liefert das Vokabular, Ausdrücke verknüpfen Auswahlmöglichkeiten mit Teilen, Regeln erzwingen gültige Kombinationen, und der Filter reduziert die überladene Struktur zu einer bestimmten Variante.",
                  "detail": "Die Erstellung eines Optionsfilters umfasst die Auswahl von Auswahlmöglichkeiten aus dem zugewiesenen Optionssatz. Windchill evaluiert den Ausdruck jedes Teils anhand der ausgewählten Auswahlmöglichkeiten und bezieht nur übereinstimmende Teile ein. Das Ergebnis ist eine gefilterte Struktur, die eine bestimmte Produktvariante darstellt. Eine Variantenspezifikation zeichnet die Auswahlmöglichkeiten für die zukünftige Wiederverwendung auf.",
                  "hint": "Der Optionsfilter ist der Höhepunkt aller O&V-Konzepte, die zusammenwirken."
                }
              ]
            }
          ]
        }
      ],
      "keyTakeaways": [
        "Der Kurs umfasst vier Module: Übersicht konfigurierbare Produkte, Einrichtung von Optionen und Varianten, Regeln und Optionssätze",
        "Schlüsselkonzepte umfassen Geschäftsstrategien, Plattformdesign, überladene Strukturen, Optionen, Auswahlmöglichkeiten, Regeln, Ausdrücke, Optionssätze und Optionsfilter",
        "Optionsfilter bringen alle Konzepte zusammen, indem sie Auswahlmöglichkeiten auf eine überladene Struktur anwenden, um spezifische Produktvarianten zu generieren",
        "Das Verständnis des gesamten O&V-Workflows vom Optionspool bis zur Variantengenerierung ist für eine effektive Produktkonfiguration in Windchill unerlässlich"
      ]
    }
  ]
},
    "quizzes/q1-configurable-products.json": {
  "moduleId": "m1",
  "title": "Wissensüberprüfung Konfigurierbare Produkte",
  "questions": [
    {
      "id": "m1-kc-001",
      "question": "Welche Aussage beschreibt den Geschäftsansatz Auftragskonfiguration (Configure-to-Order) korrekt?",
      "options": [
        "Eine Strategie zur Entwicklung von Produkten mit einer endlichen Liste diskreter Optionsauswahlmöglichkeiten für wichtige Produktmerkmale.",
        "Eine Strategie zur Entwicklung flexibler Produkte, die konfiguriert oder an die individuellen Bedürfnisse jedes Kundenauftrags angepasst werden können.",
        "Eine Strategie, bei der ein allgemeines Produkt mit Beteiligung der Konstruktion an die individuellen Kundenanforderungen angepasst wird.",
        "Eine Strategie zur kundenspezifischen Entwicklung und Fertigung eines Produkts, um die einzigartigen Anforderungen eines bestimmten Kunden zu erfüllen."
      ],
      "answerIndex": 1,
      "rationale": "Auftragskonfiguration bedeutet speziell, flexible Produkte zu entwickeln, die konfiguriert oder an die individuellen Kundenbedürfnisse angepasst werden können, typischerweise unter Verwendung eines Konfigurators mit Regeln. Option A beschreibt Auftragsmontage, Option C beschreibt Auftragskonstruktion und Option D beschreibt Vertragsentwicklung.",
      "topic": "m1t1"
    },
    {
      "id": "m1-kc-002",
      "question": "Was ist der erste Schritt im Prozess des generischen Plattformdesigns?",
      "options": [
        "Die generische Produktdefinition erstellen",
        "Vorhandene Produkte auf Wiederverwendung prüfen",
        "Anforderungen an die Plattformoptionalität analysieren",
        "Die Plattform freigeben und pflegen"
      ],
      "answerIndex": 2,
      "rationale": "Der Plattformdesignprozess beginnt mit der Analyse der Anforderungen. Sie müssen verstehen, welche Optionen erforderlich sind, bevor Sie Wiederverwendungsmöglichkeiten bewerten oder etwas aufbauen.",
      "topic": "m1t2"
    },
    {
      "id": "m1-kc-003",
      "question": "Was ist eine überladene Produktstruktur?",
      "options": [
        "Eine Produktstruktur mit zu vielen Teilen, um sie effizient zu verwalten",
        "Eine Struktur, in der Abschnitte mehrere Designs enthalten, um verschiedene Fähigkeitsstufen zu erfüllen",
        "Eine Struktur, die mehrfach exportiert und reimportiert wurde",
        "Eine Produktstruktur, die die maximale Anzahl konfigurierbarer Module überschreitet"
      ],
      "answerIndex": 1,
      "rationale": "Eine überladene Produktstruktur enthält mehrere Designs innerhalb desselben Abschnitts, um eine Reihe von Optionen zu unterstützen. Während der Variantengenerierung wird die Struktur auf die spezifischen Designs gefiltert, die für eine bestimmte Konfiguration benötigt werden.",
      "topic": "m1t3"
    },
    {
      "id": "m1-kc-004",
      "question": "Welche Windchill-Fähigkeit wird hauptsächlich für Auftragsmontage- und Lagermontage-Strategien verwendet?",
      "options": [
        "Parameter für erweiterte Auswahllogik",
        "Workflowbasierte Genehmigungsprozesse",
        "Optionen und Auswahlmöglichkeiten zum Filtern einer überladenen Produktstruktur",
        "CAD-gesteuerte Produktkonfiguration"
      ],
      "answerIndex": 2,
      "rationale": "Auftragsmontage- und Lagermontage-Strategien verwenden Optionen und Auswahlmöglichkeiten zum Filtern einer überladenen Produktstruktur. Parameter werden zusätzlich für Auftragskonfigurations- und Auftragskonstruktionsstrategien verwendet, die eine erweiterte Auswahllogik benötigen.",
      "topic": "m1t4"
    }
  ]
},
    "quizzes/q2-options-and-variants.json": {
  "moduleId": "m2",
  "title": "Wissensüberprüfung Optionen und Varianten",
  "questions": [
    {
      "id": "m2-kc-001",
      "question": "Welche Aussage beschreibt eine Option in Windchill Optionen und Varianten korrekt?",
      "options": [
        "Ein Behälter, der alle für jedes Produkt im System definierten Auswahlmöglichkeiten enthält",
        "Eine Aufzeichnung der Benutzereingaben zur Generierung einer bestimmten Variante",
        "Eine kuratierte Sammlung von Regeln, die einer Produktfamilie zugewiesen sind",
        "Ein bestimmtes Produktmerkmal, das über Konfigurationen variieren kann, mit einer oder mehreren verfügbaren Auswahlmöglichkeiten"
      ],
      "answerIndex": 3,
      "rationale": "Eine Option repräsentiert ein bestimmtes Produktmerkmal, das über Konfigurationen variieren kann und eine oder mehrere Auswahlmöglichkeiten hat, die gültige Werte definieren. Option A beschreibt einen Optionspool, Option B beschreibt eine Variantenspezifikation und Option C beschreibt einen Optionssatz (teilweise).",
      "topic": "m2t1"
    },
    {
      "id": "m2-kc-002",
      "question": "Was ist die Beziehung zwischen einem Optionspool und einem Optionssatz?",
      "options": [
        "Sie sind identische Behälter, die austauschbar verwendet werden",
        "Der Optionspool ist eine Teilmenge des Optionssatzes für eine Produktfamilie",
        "Der Optionssatz ist eine kuratierte Teilmenge des Optionspools, die nur die für eine bestimmte Produktfamilie relevanten Optionen enthält",
        "Der Optionspool enthält Regeln, während der Optionssatz Auswahlmöglichkeiten enthält"
      ],
      "answerIndex": 2,
      "rationale": "Der Optionspool ist das Hauptverzeichnis ALLER Optionen und Auswahlmöglichkeiten für einen Produktkontext, während ein Optionssatz eine kuratierte Teilmenge ist, die nur die für die Konfigurationen einer bestimmten Produktfamilie relevanten Optionen enthält.",
      "topic": "m2t2"
    },
    {
      "id": "m2-kc-003",
      "question": "Welches konfigurierbare Objekt repräsentiert die spezifischen Teile, die aus den optionalen Teilen innerhalb eines konfigurierbaren Moduls ausgewählt werden?",
      "options": [
        "Konfigurierbares Produkt",
        "Modulvariante",
        "Optionsfilter",
        "Konfigurierbares Modul"
      ],
      "answerIndex": 1,
      "rationale": "Eine Modulvariante repräsentiert die spezifischen Teile, die aus den optionalen Teilen innerhalb eines konfigurierbaren Moduls ausgewählt werden, basierend auf Auswahlkriterien und Auswahlmöglichkeiten. Das Konfigurierbare Produkt ist das Endprodukt der obersten Ebene, das Konfigurierbare Modul erfasst Variabilität auf Komponentenebene und ein Optionsfilter sind die Kriterien zum Filtern der Struktur.",
      "topic": "m2t3"
    },
    {
      "id": "m2-kc-004",
      "question": "Was ist eine wesentliche Einschränkung bei der Verwendung von Top-Down- oder Bottom-Up-Konfigurationsansätzen mit Creo?",
      "options": [
        "Bottom-Up-Konfigurationen können keine Optionssätze verwenden",
        "Top-Down-Konfigurationen erfordern manuelle CAD-Aktualisierungen",
        "Nur Grundausdrücke werden von Windchill an Creo übergeben — erweiterte Ausdrücke verbleiben nur in Windchill",
        "Top-Down- und Bottom-Up-Konfigurationen können nicht dieselben Variantenergebnisse liefern"
      ],
      "answerIndex": 2,
      "rationale": "Unabhängig vom verwendeten Ansatz (Top-Down oder Bottom-Up) werden nur Grundausdrücke von Windchill an Creo übergeben. Erweiterte Ausdrücke verbleiben nur in Windchill. Dies ist eine wichtige Einschränkung, die bei der Planung der Konfigurationsstrategie zu berücksichtigen ist.",
      "topic": "m2t4"
    }
  ]
},
    "quizzes/q3-rules.json": {
  "moduleId": "m3",
  "title": "Wissensüberprüfung Optionen- und Varianten-Regeln",
  "questions": [
    {
      "id": "m3-kc-001",
      "question": "Was ist der Hauptzweck von Optionen- und Varianten-Regeln?",
      "options": [
        "Die visuelle Darstellung konfigurierbarer Module im Strukturbaum zu definieren",
        "Den Benutzerzugriff auf bestimmte Optionen und Auswahlmöglichkeiten basierend auf ihrer Rolle einzuschränken",
        "Geschäftslogik durchzusetzen, die gültige Beziehungen zwischen Auswahlmöglichkeiten und Teilen regelt",
        "Automatisch neue Optionen zu erstellen, wenn eine Produktfamilie freigegeben wird"
      ],
      "answerIndex": 2,
      "rationale": "O&V-Regeln setzen Geschäftslogik durch, die gültige Beziehungen zwischen Auswahlmöglichkeiten und Teilen regelt. Sie stellen sicher, dass nur gültige Kombinationen von Auswahlmöglichkeiten ausgewählt werden können und dass die richtigen Teile in Variantenstrukturen einbezogen werden.",
      "topic": "m3t1"
    },
    {
      "id": "m3-kc-002",
      "question": "Was passiert, wenn eine Ausschlussregel während der Konfiguration ausgelöst wird?",
      "options": [
        "Die ausgeschlossene Auswahlmöglichkeit wird automatisch ausgewählt",
        "Die ausgeschlossene Auswahlmöglichkeit wird dauerhaft aus dem Optionspool entfernt",
        "Die ausgeschlossene Auswahlmöglichkeit wird nicht verfügbar und verhindert, dass der Benutzer eine inkompatible Kombination auswählt",
        "Die ausgeschlossene Auswahlmöglichkeit löst einen Workflow zur Konstruktionsprüfung aus"
      ],
      "answerIndex": 2,
      "rationale": "Eine Ausschlussregel beschränkt die Auswahl inkompatibler Auswahlmöglichkeiten. Wenn sie ausgelöst wird, wird die ausgeschlossene Auswahlmöglichkeit in der Auswahlliste nicht verfügbar und verhindert, dass der Benutzer eine ungültige Konfiguration erstellt.",
      "topic": "m3t2"
    },
    {
      "id": "m3-kc-003",
      "question": "Welche Aussage beschreibt eine Aktivierungsregel korrekt?",
      "options": [
        "Eine Regel, die automatisch alle Auswahlmöglichkeiten für eine bestimmte Option auswählt",
        "Eine Regel, die während der Konfiguration dynamisch neue Auswahlmöglichkeiten erstellt",
        "Eine Regel, die Auswahlmöglichkeiten sperrt, damit sie nach der ersten Auswahl nicht mehr geändert werden können",
        "Eine Regel, die bewirkt, dass nur bestimmte Auswahlmöglichkeiten in der Auswahlliste erscheinen, sobald eine Zielauswahl getroffen wurde"
      ],
      "answerIndex": 3,
      "rationale": "Eine Aktivierungsregel steuert, welche Auswahlmöglichkeiten basierend auf anderen Auswahlen in einer Auswahlliste erscheinen. Sobald eine Zielauswahl getroffen wurde, werden nur die aktivierten Auswahlmöglichkeiten sichtbar und grenzen die verfügbaren Optionen auf gültige Auswahlen für diesen Kontext ein.",
      "topic": "m3t3"
    }
  ]
},
    "quizzes/q4-option-sets.json": {
  "moduleId": "m4",
  "title": "Wissensüberprüfung Optionssätze",
  "questions": [
    {
      "id": "m4-kc-001",
      "question": "Welche Aussage beschreibt einen Optionssatz korrekt?",
      "options": [
        "Ein Hauptverzeichnis, das alle Optionen und Auswahlmöglichkeiten für jedes Produkt im System enthält",
        "Eine kuratierte Sammlung von Optionen, Auswahlmöglichkeiten und Regeln, die zur Definition von Konfigurationen innerhalb einer bestimmten Produktfamilie verwendet wird",
        "Ein Filter, der ungültige Auswahlmöglichkeiten während der Konfiguration aus dem Optionspool entfernt",
        "Ein Bericht, der alle für ein Produkt generierten Variantenspezifikationen anzeigt"
      ],
      "answerIndex": 1,
      "rationale": "Ein Optionssatz ist eine kuratierte Sammlung von Optionen, Auswahlmöglichkeiten und Regeln, die zur Definition von Konfigurationen innerhalb einer bestimmten Produktfamilie verwendet wird. Option A beschreibt einen Optionspool, Option C beschreibt einen Optionsfilter und Option D beschreibt einen Variantenbericht.",
      "topic": "m4t1"
    },
    {
      "id": "m4-kc-002",
      "question": "Was muss geschehen, bevor ein Optionssatz für die Produktkonfiguration verwendet werden kann?",
      "options": [
        "Der Optionssatz muss zuerst in ein CAD-System exportiert werden",
        "Der Optionssatz muss einem konfigurierbaren Produkt oder konfigurierbaren Modul zugewiesen werden",
        "Der Optionssatz muss nur von einem Standortadministrator genehmigt werden",
        "Der Optionssatz muss mindestens zehn Optionen enthalten, um gültig zu sein"
      ],
      "answerIndex": 1,
      "rationale": "Ein Optionssatz muss einem konfigurierbaren Produkt oder konfigurierbaren Modul zugewiesen werden, bevor er für die Konfiguration verwendet werden kann. Diese Zuweisung stellt die Verknüpfung zwischen den verfügbaren Optionen und der zu konfigurierenden Produktstruktur her.",
      "topic": "m4t2"
    },
    {
      "id": "m4-kc-003",
      "question": "Was ist der Zweck eines Optionsfilters in Windchill?",
      "options": [
        "Nicht mehr benötigte Auswahlmöglichkeiten dauerhaft aus dem Optionspool zu löschen",
        "Automatisch neue Varianten ohne Benutzereingabe zu erstellen",
        "Eine konfigurierbare Produktstruktur basierend auf den Teilen zugewiesenen Auswahlmöglichkeiten zu filtern und eine Variante zu erzeugen",
        "Einzuschränken, welche Benutzer auf die Oberfläche zur Optionssatzverwaltung zugreifen können"
      ],
      "answerIndex": 2,
      "rationale": "Ein Optionsfilter verwendet Kriterien basierend auf ausgewählten Auswahlmöglichkeiten, um eine konfigurierbare Produktstruktur zu filtern und nur die Teile einzubeziehen, deren zugewiesene Auswahlmöglichkeiten mit den Selektionen übereinstimmen. So wird eine überladene Struktur auf eine bestimmte Variante reduziert.",
      "topic": "m4t3"
    }
  ]
},
    "glossary.json": {
  "terms": [
    {
      "term": "Erweiterter Ausdruck",
      "definition": "Ein Ausdruck, der Auswahlmöglichkeiten, Operatoren und Funktionen umfasst. Kann Teilen und Teileverwendungsverknüpfungen zugewiesen werden, um Bedingungen festzulegen, wann eine Komponente in die Produktstruktur aufgenommen werden soll."
    },
    {
      "term": "Grundausdruck",
      "definition": "Optionsauswahlmöglichkeiten, die Sie Teilen und Teileverwendungsverknüpfungen zuweisen können, um die Bedingungen festzulegen, wann eine Komponente in die Produktstruktur aufgenommen werden soll."
    },
    {
      "term": "Konfigurierbares Modul",
      "definition": "Ein Windchill-Teil, das ein oder mehrere untergeordnete Teile haben kann, die Variationen im Design und in der Konfiguration einer Komponente oder Funktionseinheit darstellen."
    },
    {
      "term": "Konfigurierbares Produkt",
      "definition": "Ein Endprodukt der obersten Ebene, das eine Sammlung von Produktvariationen darstellt. Ein Beispiel ist eine Produktfamilie mit verschiedenen Modellen, die einige Standardkomponenten gemeinsam nutzen."
    },
    {
      "term": "Konfigurierbare Produktstruktur",
      "definition": "Umfasst konfigurierbare Module, um die Möglichkeit zu unterstützen, mehrere Produktvarianten aus derselben Produktstruktur zu erstellen."
    },
    {
      "term": "Bedingte Regel",
      "definition": "Eine Regel mit WENN/DANN-Anweisungen, die festlegt, wann bestimmte Optionsauswahlmöglichkeiten eingeschlossen, aktiviert oder deaktiviert werden sollen, basierend auf anderen Auswahlentscheidungen im Optionsfilter."
    },
    {
      "term": "Aktivierungsregel",
      "definition": "Eine Regel, die bewirkt, dass nur bestimmte Auswahlmöglichkeiten zur Auswahl erscheinen, sobald eine bestimmte Zielauswahl getroffen wurde."
    },
    {
      "term": "Ausschlussregel",
      "definition": "Eine Regel, die die Auswahl inkompatibler Auswahlmöglichkeiten einschränkt. Beispielsweise verhindert die Auswahl von 110 Volt die Auswahl einer 50-Hz-Frequenz."
    },
    {
      "term": "Ausdrucksalias",
      "definition": "Eine benannte logische Anweisung, die bei der Erstellung von bedingten Regeln, erweiterten Ausdrücken und anderen Aliasen wiederverwendet werden kann. Erfasst gängige Definitionen für das globale Produktmanagement."
    },
    {
      "term": "Einschlussregel",
      "definition": "Eine Regel, die die Auswahl einer Optionsauswahlmöglichkeit mit einer oder mehreren zugehörigen Optionsauswahlmöglichkeiten verknüpft. Die Auswahl der Quellauswahl wählt automatisch die Zielauswahlmöglichkeiten aus."
    },
    {
      "term": "Modulvariante",
      "definition": "Die spezifischen Teile, die aus den optionalen Teilen und Komponenten eines konfigurierbaren Moduls basierend auf Auswahlkriterien und Auswahlzuordnungen bei der Variantengenerierung ausgewählt werden."
    },
    {
      "term": "Option",
      "definition": "Ein bestimmtes Produktmerkmal. Eine Option hat eine oder mehrere Auswahlmöglichkeiten, kann erforderlich oder als Einzelauswahl festgelegt sein und ist auf bestimmte Produktvariationen anwendbar."
    },
    {
      "term": "Optionsfilter",
      "definition": "Ein Satz von Kriterien, der verwendet wird, um die Produktstruktur basierend auf den Teilen zugewiesenen Auswahlmöglichkeiten und der Verwendung eines Teils in einer Struktur zu filtern."
    },
    {
      "term": "Options-Manager",
      "definition": "Eine Windchill-Kontextrolle mit der Befugnis, Optionen und Auswahlmöglichkeiten zu erstellen und Optionssätze sowie andere zugehörige Informationen zu pflegen."
    },
    {
      "term": "Optionspool",
      "definition": "Ein Behälter, der alle verfügbaren Optionen und deren Auswahlmöglichkeiten für ein Produkt enthält. Optionen und Auswahlmöglichkeiten werden innerhalb des Optionspools verwaltet."
    },
    {
      "term": "Optionssatz",
      "definition": "Eine Teilmenge von Optionen und Auswahlmöglichkeiten aus einem oder mehreren Optionspools, die zur Definition von Variationen innerhalb einer Produktfamilie verwendet wird. Optionssätze sind änderungsverwaltete Objekte."
    },
    {
      "term": "Parameter",
      "definition": "Ein Attribut, das lokal im Kontext eines konfigurierbaren Moduls definiert ist, um die erweiterte Auswahllogik während des Teilekonfigurationsprozesses zu unterstützen."
    },
    {
      "term": "Produktfamilie",
      "definition": "Eine Gruppe verwandter Produkte, die eine Reihe von Funktionen bieten und einen erheblichen Anteil derselben Teile gemeinsam nutzen."
    },
    {
      "term": "Variante",
      "definition": "Ein Teil oder eine Teilstruktur, die eine bestimmte Konfiguration einer konfigurierbaren Produktstruktur darstellt und während eines Konfigurationsprozesses erstellt wird."
    },
    {
      "term": "Variantenspezifikation",
      "definition": "Eine Aufzeichnung der Benutzereingaben von Optionsauswahlmöglichkeiten und Parameterwerten, die während eines Konfigurationsprozesses bereitgestellt werden und zur Generierung einer Variantenteilestruktur verwendet werden."
    },
    {
      "term": "Unterstützung konfigurierbarer Module",
      "definition": "Eine Windchill-Präferenz, die die Möglichkeit steuert, optionale Produktstrukturen zu erstellen. Muss auf Ja gesetzt werden, um die Funktionalität Optionen und Varianten nutzen zu können."
    }
  ]
},
    "i18n/ui-de.json": {
  "app.title": "Windchill OCP",
  "app.subtitle": "Einarbeitung",
  "app.courseProgress": "Kursfortschritt",
  "app.courseProgressPct": "Kursfortschritt: {pct}%",
  "app.resetProgress": "Fortschritt zurücksetzen",
  "app.resetConfirm": "Gesamten Fortschritt und alle Notizen zurücksetzen?",
  "app.openMenu": "Menü öffnen",
  "app.toggleTheme": "Design wechseln",
  "sidebar.dashboard": "Übersicht",
  "sidebar.modules": "Module",
  "sidebar.resources": "Ressourcen",
  "sidebar.glossary": "Glossar",
  "sidebar.knowledgeCheck": "Wissensüberprüfung",
  "sidebar.comingSoon": "Demnächst verfügbar",
  "sidebar.topicLabel": "Thema {mod}.{topic}",
  "sidebar.exerciseLabel": "Übung {num}",
  "dashboard.continueLabel": "Dort weitermachen, wo Sie aufgehört haben",
  "dashboard.statComplete": "Abgeschlossen",
  "dashboard.statTopics": "Themen",
  "dashboard.statEstimated": "Geschätzt",
  "dashboard.modules": "Module",
  "dashboard.moduleNum": "Modul {num}",
  "dashboard.moduleComingSoon": "Modul {num} – Demnächst verfügbar",
  "dashboard.topicsProgress": "{done}/{total} Themen",
  "dashboard.estimatedMin": "~{min} Min.",
  "dashboard.routeTopic": "Thema {label}",
  "dashboard.routeModule": "Modul {label}",
  "dashboard.routeQuiz": "Quiz {label}",
  "dashboard.routeGlossary": "Glossar",
  "topic.breadcrumbDashboard": "Übersicht",
  "topic.breadcrumbModule": "Modul {num}",
  "topic.topicNum": "Thema {mod}.{topic}",
  "topic.exerciseNum": "Übung {num}",
  "topic.estimated": "Geschätzt: ~{min} Min.",
  "topic.keyTakeaways": "Wichtigste Erkenntnisse",
  "topic.markComplete": "Als abgeschlossen markieren",
  "topic.completedUndo": "Abgeschlossen – Klicken zum Rückgängigmachen",
  "topic.previous": "Zurück",
  "topic.next": "Weiter",
  "topic.moduleOverview": "Modulübersicht",
  "topic.takeQuiz": "Quiz starten",
  "topic.clickToReveal": "Klicken zum Aufdecken",
  "topic.allMatchedCorrectly": "Alles korrekt zugeordnet!",
  "topic.scenarioLabel": "Szenario",
  "topic.strategyLabel": "Strategie",
  "topic.showHint": "Hinweis anzeigen",
  "topic.hideHint": "Hinweis ausblenden",
  "topic.objective": "Ziel",
  "topic.stepsCompleted": "{done}/{total} Schritte abgeschlossen",
  "topic.stepsProgress": "{done}/{total} Schritte",
  "topic.doThis": "Aufgabe",
  "topic.whyItMatters": "Warum es wichtig ist",
  "topic.doneNextStep": "Fertig — Nächster Schritt",
  "topic.topicsComplete": "{done}/{total} Themen abgeschlossen",
  "topic.moduleBadge": "Modul {num}",
  "topic.topics": "Themen",
  "topic.startModule": "Modul starten",
  "topic.backToDashboard": "Übersicht",
  "topic.knowledgeCheck": "Wissensüberprüfung Modul {num}",
  "topic.quizBest": "Bestleistung: {score}/{total}",
  "topic.quizNotAttempted": "Noch nicht versucht",
  "quiz.moduleKnowledgeCheck": "Wissensüberprüfung Modul {num}",
  "quiz.questionProgress": "Frage {current} von {total}",
  "quiz.previous": "Zurück",
  "quiz.back": "Zurück",
  "quiz.next": "Weiter",
  "quiz.seeResults": "Ergebnisse anzeigen",
  "quiz.retryQuiz": "Quiz wiederholen",
  "quiz.backToModule": "Zurück zum Modul",
  "quiz.greatJob": "Hervorragend!",
  "quiz.goodEffort": "Guter Einsatz!",
  "quiz.keepStudying": "Weiter lernen!",
  "quiz.scoreMessage": "Sie haben {pct}% bei der Wissensüberprüfung von Modul {num} erreicht.",
  "quiz.review": "Überprüfung",
  "quiz.yourAnswer": "Ihre Antwort: {answer}",
  "quiz.correct": "Richtig: {answer}",
  "quiz.notAvailable": "Quiz noch nicht verfügbar.",
  "quiz.topicNotFound": "Thema nicht gefunden.",
  "quiz.moduleNotFound": "Modul nicht gefunden.",
  "glossary.title": "Glossar",
  "glossary.subtitle": "Terminologie für Optionen und konfigurierbare Produkte ({count} Begriffe)",
  "glossary.searchPlaceholder": "Begriffe suchen...",
  "glossary.noResults": "Keine Begriffe entsprechen Ihrer Suche.",
  "glossary.notAvailable": "Glossar nicht verfügbar.",
  "notepad.title": "Notizen",
  "notepad.placeholder": "Machen Sie sich Notizen während des Lernens...",
  "notepad.charCount": "{count} Zeichen",
  "notepad.openNotepad": "Notizblock öffnen",
  "error.loadingContent": "Fehler beim Laden des Inhalts",
  "error.serverRequired": "Stellen Sie sicher, dass Sie diese Seite über einen HTTP-Server bereitstellen (z. B. python -m http.server). Die fetch()-API funktioniert nicht mit file://-URLs.",
  "locale.en": "English",
  "locale.fr": "Français",
  "locale.de": "Deutsch",
  "locale.ja": "日本語",
  "locale.zh": "中文",
  "locale.ko": "한국어",
  "locale.es": "Español"
}
  };
})();
