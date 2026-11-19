/* Auto-gid 2026 — тексти розділів: топ-вибір, марки, мотори, словник (французький ринок). */

/* [марка, модель, версія, роки, [ціна від, до] у k€, чому, покоління (якщо моделей кілька)] */
window.PICKS = [
  ["Volkswagen", "Golf 7 / 7.5", "1.4 TSI 125 · Manual 6", "2017–2018", [11, 15], "Еталон класу: надійний EA211, найкращий салон за ці гроші, запчастини всюди. Carat — найкраще оснащення.", ""],
  ["Skoda", "Octavia 3", "1.4 TSI 150 · Manual 6", "2017–2019", [11, 15], "Та сама механіка, що Golf, але більший салон і багажник 590 л, дешевше на 1–2 k€.", ""],
  ["Seat", "Leon 3", "FR 1.4 TSI 125/150 · Manual 6", "2017–2018", [12, 15], "Golf у спортивній версії: жорсткіший, гарніший, трохи дешевший.", ""],
  ["Mazda", "Mazda 3", "2.0 Skyactiv-G 120 · Manual 6", "2016–2018", [11, 15], "NA 2.0 без турбіни, найприємніша Manual 6, 16,8/20 у відгуках.", "BM / BN"],
  ["Audi", "A4 B9", "1.4 TFSI 150 · Manual 6", "2016–2017", [14, 17], "Преміум-салон і EA211 — той самий надійний мотор. Найкращий вибір за 14–17 k€.", ""],
  ["Skoda", "Superb 3", "1.4 TSI 150 · Manual 6", "2016–2018", [14, 18], "Простір як у лімузина, механіка Passat. Уникай ex-VTC (Uber).", ""],
  ["Kia", "Ceed 3", "1.4 T-GDI 140 · Manual 6", "2018–2020", [13, 17], "Часто ще з гарантією 7 років / 150k km, яка переходить до нового власника.", ""],
  ["Hyundai", "i30", "1.4 T-GDI 140 · Manual 6", "2018–2020", [12, 16], "Те саме, що Ceed, гарантія 5 років без ліміту km.", "PD"],
  ["Toyota", "Auris 2", "1.6 Valvematic 132 · Manual 6", "2015–2018", [9, 13], "Практично без поломок; салон простіший. Або 1.8 Hybrid, якщо згоден на e-CVT.", ""],
  ["Mazda", "Mazda 6", "2.0 Skyactiv-G 165 · Manual 6", "2015–2018", [12, 16], "Великий седан/універсал з NA 2.0 — альтернатива Passat і A4.", ""],
  ["Honda", "Civic 9", "1.8 i-VTEC 142 · Manual 6", "2014–2017", [9, 13], "NA 1.8, класна коробка, дешевше за Golf. Перевір тиск масла.", ""],
  ["Skoda", "Fabia 3", "1.2 TSI 110 · Manual 6", "2015–2017", [7, 10], "Найдешевший варіант з 4-cyl TSI. Менша, але дуже надійна.", ""]
];

/* Топ SUV і 4x4 (джипи) до 20 k€: [марка, модель, версія, роки, [k€], чому, покоління] */
window.PICKS_SUV = [
  ["Toyota", "RAV4 4", "2.0 Valvematic 151 AWD · Manual 6 або 2.5 Hybrid AWD-i", "2014–2016", [13, 19], "Найнадійніший AWD SUV до 20 k€: простий повний привід, мало поломок. Hybrid — 6 l замість 8–9.", "XA40"],
  ["Honda", "CR-V 4", "2.0 i-VTEC 155 4WD · Manual 6", "2013–2016", [12, 17], "NA 2.0 без турбіни, великий салон, надійна коробка. Масло в задньому дифі — кожні 40–60k km.", "RM"],
  ["Subaru", "Forester 4", "2.0i 150 boxer AWD · Manual 6", "2014–2017", [11, 17], "Найкращий постійний AWD у класі, X-Mode, кліренс 220 mm. Рідкісний — шукай по всій Франції.", "SJ"],
  ["Suzuki", "Vitara", "1.6 VVT 120 AllGrip · Manual 5", "2016–2019", [11, 16], "Легкий (1,2 t), простий 4-cyl NA, AllGrip 4x4. Найдешевший у володінні.", "LY"],
  ["Dacia", "Duster", "1.3 TCe 150 4x4 · Manual 6", "2019–2021", [14, 18], "Справжній 4x4 з короткою 1-ю передачею, 1.3 TCe H5Ht — надійний. Простий салон.", "HS / HM"],
  ["Suzuki", "Grand Vitara 2", "2.4 VVT 169 4x4 · Manual 5", "2010–2015", [8, 13], "Справжній джип з пониженою передачею за ціну Clio. Витрата 10 l — головний мінус.", "JT"],
  ["Mazda", "CX-5", "2.0 Skyactiv-G 165 2WD · Manual 6", "2014–2017", [12, 17], "Без 4x4, але NA 2.0 і Manual 6 — найприємніший у керуванні. AWD є тільки з 2.5 Auto 6.", "KE"],
  ["Volkswagen", "T-Roc", "1.5 TSI 150 2WD · Manual 6", "2018–2019", [16, 20], "Найкращий SUV за TÜV 2026, механіка Golf 7.5. 4Motion — тільки 2.0 TSI DSG.", "A1"],
  ["Hyundai", "Tucson", "1.6 GDI 132 2WD · Manual 6", "2016–2018", [12, 16], "Просторий і простий; 4WD — тільки з дизелями 1.7/2.0 CRDi.", "TL"],
  ["Toyota", "Land Cruiser J120", "3.0 D-4D 173 · Auto 5", "2007–2009", [14, 20], "Якщо хочеш справжній великий джип: рама, пониження, блокування. Дорогий у податках і пальному.", "J120 / J125"]
];

/* [g = добре, m = з нюансами, x = ризик, назва, текст] */
window.BRANDS = [
  ["g", "Toyota / Lexus", "Найнадійніші на petrol і Hybrid. Уникай Diesel 1AD/2AD і AMT (MMT). Toyota Relax: +1 рік гарантії за кожне ТО у дилера, до 10 років / 185k km."],
  ["g", "Mazda", "NA Skyactiv-G — дуже надійні. Skyactiv-D 2.2 — уникай. Mazda 2 — №1 у TÜV-Report 2026."],
  ["g", "Volkswagen / Skoda / Seat / Audi", "EA211 (2012+) і EA888 Gen3 — добре. EA111 і EA888 Gen1/2 — погано. DSG7 DQ200 — ризик. Найкращі салони і ліквідність."],
  ["g", "Honda", "NA R18, L13, L15 — відмінні. 1.0/1.5 VTEC Turbo — паливо в маслі."],
  ["g", "Hyundai / Kia", "Надійні. Гарантія 5 років без ліміту km (Hyundai) і 7 років / 150k km (Kia) переходить до нового власника."],
  ["g", "Suzuki", "Прості й міцні K12, M16, Boosterjet. Тонка фарба, дешевий пластик."],
  ["m", "BMW / Mini", "Ранні N13, N47, Prince — уникай. B38/B48/B47 (2015+) — добре, але ремонт дорогий."],
  ["m", "Mercedes", "Імідж і салон, але середня надійність молодших моделей і 7G-DCT."],
  ["m", "Volvo", "Безпека і комфорт. До 2015 — мотори Ford/PSA, після — свої Drive-E."],
  ["m", "Ford", "Їздять найкраще, але EcoBoost (wet belt, перегрів) і Powershift — ризик. NA Sigma 1.25/1.6 — добре."],
  ["m", "Dacia", "Прості і дешеві. 1.6 SCe, 1.3 TCe — ок; 1.2 TCe H5Ft — уникай."],
  ["x", "Renault / Nissan", "1.2 TCe H5Ft (2012–2018) — уникай. 1.3 TCe H5Ht — добре. EDC і CVT — ризик."],
  ["x", "Peugeot / Citroën / Opel (Stellantis)", "1.0/1.2 PureTech з wet belt — головний ризик (гарантія 10 років / 175k km для машин 04/2014–06/2022 при ТО за регламентом). BlueHDi — ок, але AdBlue."],
  ["x", "Fiat", "Простий 1.2/1.4 FIRE живучий; електрика і AMT Dualogic — слабко."]
];

/* [мотор/коробка, де стоїть, ok|warn|bad, чому] */
window.ENGINES = [
  ["EA211 1.2 / 1.4 TSI (2012+)", "Golf 7, Octavia 3, Leon 3, A3 8V, A4 B9 1.4, Polo 6C, Fabia 3", "ok", "Timing belt, алюмінієвий блок, без масложору. Слабке місце — помпа/термостат."],
  ["EA211 evo 1.5 TSI (2017+)", "Golf 7.5/8, Octavia, Leon, T-Roc, Karoq", "ok", "Надійний; ранні — «кенгуру» на низьких обертах, лікується прошивкою."],
  ["EA211 1.0 MPI / TSI", "up!, Polo, Fabia, T-Cross", "ok", "Надійні, але 3-cyl: вібрації, шум."],
  ["EA113 1.6 MPI 102", "Golf 5/6, A3 8P, Octavia 2", "ok", "Простий NA, вічний, але слабкий."],
  ["EA111 1.2 TSI CBZ / 1.4 TSI CAXA, CAVD", "Golf 6, Polo 5 (до 2014), Octavia 2, A1, A3 8P", "bad", "Розтяг ланцюга, масложор, поршні (twincharger)."],
  ["EA888 Gen1/2 1.8/2.0 TFSI (до ~2012)", "A4 B8, A5 8T, Golf 6 GTI, Octavia 2 RS", "bad", "Масложор через кільця, chain."],
  ["EA888 Gen3 (2012+)", "Golf 7 GTI, Octavia 3 RS, A4 B9 2.0, Superb 3", "ok", "Проблеми попередника вирішені."],
  ["EA189 TDI (до 2015)", "Golf 6, Passat B7, A4 B8", "warn", "Dieselgate-прошивка, EGR, форсунки."],
  ["EA288 TDI (2012+)", "Golf 7, Octavia 3, Passat B8", "ok", "Міцний, але DPF не любить місто."],
  ["DSG7 DQ200 (dry clutch)", "Усі VAG до 250 Nm", "warn", "Мехатронік і зчеплення після 100–150k km. Надійніше — Manual або DSG з мокрим зчепленням."],
  ["DSG6 DQ250 / DSG7 DQ381 (wet clutch)", "GTI, RS, 2.0 TDI, Tiguan", "ok", "Надійні при заміні масла кожні 60k km."],
  ["Toyota Hybrid (HSD) 1.5/1.8/2.0/2.5", "Yaris, Auris, Corolla, C-HR, RAV4, Lexus", "ok", "Без зчеплення і стартера, e-CVT — найнадійніша схема на ринку."],
  ["Toyota 1ZR/2ZR/3ZR Valvematic", "Auris 2, Verso, Avensis 3, RAV4 4", "ok", "Простий NA з chain. Ранні — трохи масла."],
  ["Toyota 1NR 1.33 / 2NR 1.5", "Yaris 3, Auris 2", "ok", "Надійні; 1NR 2011–2014 — трохи масла."],
  ["Toyota 8NR 1.2 T", "Auris 2, C-HR, Corolla 2019", "ok", "4-cyl turbo з chain, без масових проблем."],
  ["Toyota 1AD/2AD 2.0/2.2 D-4D", "Auris, Avensis, Verso, RAV4 до 2015", "bad", "Прокладка ГБЦ, масложор, DPF."],
  ["Toyota MMT / x-shift (AMT)", "Aygo, Yaris, Auris до 2012", "bad", "Смикання, дорогий актуатор."],
  ["Mazda Skyactiv-G 1.5 / 2.0 / 2.5", "Mazda 2, 3, 6, CX-3, CX-5, CX-30", "ok", "NA з високим стисненням, chain, мінімум поломок."],
  ["Mazda Skyactiv-D 2.2", "Mazda 3, 6, CX-5", "bad", "Розбавлення масла паливом, DPF, форсунки."],
  ["Honda R18 / L13 / L15 (NA)", "Civic 8/9, Jazz, HR-V", "ok", "Дуже надійні i-VTEC."],
  ["Honda 1.0 / 1.5 VTEC Turbo", "Civic 10, CR-V 5", "warn", "Паливо в маслі, особливо при коротких поїздках взимку."],
  ["Hyundai/Kia 1.2 MPI, 1.0/1.4 T-GDI", "i10, i20, i30 PD, Ceed 3, Rio", "ok", "Надійні, chain, гарантія."],
  ["Hyundai/Kia 1.6 GDI (Gamma)", "i30 GD, Ceed 2, Tucson, Sportage", "warn", "Нагар на клапанах, трохи масла."],
  ["Renault 1.2 TCe H5Ft (2012–2018)", "Clio 4, Captur 1, Mégane, Kadjar, Qashqai, Juke", "bad", "Масложор, перескок ланцюга, руйнування мотора."],
  ["Renault 1.3 TCe H5Ht (2017+)", "Mégane 4, Captur, Kadjar, Qashqai, Duster, Classe A", "ok", "Chain, спільний з Mercedes, надійний."],
  ["Renault 1.6 16V K4M / SCe H4M, 1.2 16V D4F", "Mégane 3, Duster, Clio 4, Sandero", "ok", "Прості NA, живучі."],
  ["Renault EDC (dry) / Nissan CVT", "Clio, Captur, Mégane, Qashqai", "warn", "Зчеплення, ривки, ціна ремонту."],
  ["Stellantis 1.0/1.2 PureTech (wet belt)", "208, 2008, 308, 3008, C3, C4, Corsa F, Crossland", "bad", "Ремінь розшаровується, засмічує масляний насос. Гарантія 10 років / 175k km для 04/2014–06/2022."],
  ["Stellantis/BMW 1.6 VTi / THP (Prince)", "208, 308, C4, Mini R56", "bad", "Chain, масложор, нагар."],
  ["Stellantis BlueHDi 1.5/1.6/2.0", "308, 3008, C4, Berlingo", "warn", "Мотор ок, але бак/насос AdBlue часто ламаються."],
  ["Opel 1.4 Turbo A14NET / M32 gearbox", "Astra J, Mokka, Insignia A", "bad", "Турбіна, поршні; підшипники M32."],
  ["Opel 1.4 Turbo B14XFT 125", "Astra K", "ok", "16,3/20 у відгуках, chain."],
  ["Ford Sigma 1.25 / 1.6 Ti-VCT (NA)", "Fiesta 6, Focus 3", "ok", "Прості NA, надійні."],
  ["Ford 1.0 / 1.5 / 1.6 EcoBoost", "Fiesta, Focus, Puma, Kuga", "warn", "Перегрів, тріщини ГБЦ (1.5/1.6), wet belt (1.0 з 2018)."],
  ["Ford Powershift DPS6", "Fiesta, Focus, C-Max до 2018", "bad", "Зчеплення і блок керування."],
  ["BMW N13 / N47", "Série 1/3 до 2015, Mini, Toyota 1.6 D-4D", "bad", "Chain (у N47 — ззаду мотора, дорого)."],
  ["BMW B38 / B48 / B47 (2015+)", "Série 1/3, X1, Mini F56", "ok", "Модульні, надійні, але ТО дороге."],
  ["Mercedes 7G-DCT", "Classe A/B, CLA, GLA", "warn", "Смикання, дорогий ремонт."]
];

/* Словник: як те саме пишуть у французьких оголошеннях (La Centrale, Leboncoin) */
window.GLOSSARY = [
  ["Manual 6", "BVM6 · boîte manuelle 6 vitesses", "Механіка, 6 передач"],
  ["Auto", "BVA · boîte automatique", "Класичний автомат (гідротрансформатор)"],
  ["DSG / S tronic", "DSG7, S tronic 7 (VAG)", "Робот з двома зчепленнями (dry DQ200 — ризик)"],
  ["EAT6 / EAT8", "EAT8 (Peugeot, Citroën, Opel)", "Класичний автомат Aisin — ок"],
  ["EDC", "EDC6 / EDC7 (Renault, Dacia)", "Робот з двома зчепленнями"],
  ["AMT", "BVR · boîte robotisée (ASG, MMT, ETG, Easytronic, Dualogic)", "Робот з одним зчепленням — уникай"],
  ["CVT / e-CVT", "CVT, Xtronic, Multitronic / e-CVT (Toyota Hybrid)", "Варіатор; e-CVT у гібридах — надійна"],
  ["Petrol", "Essence (SP95-E10, SP98)", "Бензин"],
  ["Diesel", "Gazole · Diesel (TDI, HDi, dCi, BlueHDi)", "Дизель"],
  ["Hybrid / PHEV", "Hybride (HEV) / Hybride rechargeable", "Гібрид / заряджаємий гібрид"],
  ["4-cyl / 3-cyl", "4 cylindres / 3 cylindres", "Кількість циліндрів"],
  ["NA", "Atmosphérique", "Без турбіни"],
  ["Timing belt / Wet belt / Chain", "Courroie de distribution / courroie humide / chaîne", "Ремінь ГРМ / ремінь у маслі / ланцюг"],
  ["hp (125 hp)", "ch (125 ch, chevaux DIN)", "Реальна потужність"],
  ["CV", "CV · chevaux fiscaux (carte grise, P.6)", "Фіскальна потужність — для ціни carte grise і страховки"],
  ["k km", "km au compteur", "Пробіг у тисячах km"],
  ["k€", "Prix TTC", "Ціна в тисячах євро (з ПДВ)"],
  ["Service history", "Carnet d'entretien (à jour)", "Сервісна книжка"],
  ["MOT", "CT · contrôle technique (< 6 mois)", "Техогляд — обов'язковий при продажу авто 4+ років"],
  ["1st owner", "Première main", "Перший власник"],
  ["Trim", "Finition (Confortline, Carat, R-Line; Ambition, Style; FR)", "Комплектація"],
  ["Dealer fees", "Frais de mise à la route / préparation", "Додаткові збори дилера — питай заздалегідь"]
];
