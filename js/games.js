/* =====================================================
   CATÁLOGO DE JUEGOS - GL FIXCORE

   CÓMO AGREGAR UN JUEGO (1 línea):
   Escribe dentro del género que corresponda:

       "Nombre del juego | Plataformas | archivo-de-imagen.jpg",

   - Plataformas: opcional, sepáralas con coma.   Ej: PS5, Xbox, PC
   - Imagen: opcional. Guarda el archivo en  images/games/
   - Si NO pones imagen, la página busca sola un archivo llamado
     igual que el juego, en minúsculas y con guiones:
         "Elden Ring"  ->  images/games/elden-ring.jpg  (o .png / .webp)
   - Si no existe imagen, se muestra una portada de color.
   - No olvides la coma al final de la línea.

   Ejemplos válidos:
       "Hollow Knight",
       "Hollow Knight | Switch, PC",
       "Hollow Knight | Switch, PC | hollow.jpg",
   ===================================================== */

/* Géneros (botones de filtro). "id" debe coincidir con las
   claves de CATALOG de más abajo. */
const GENRES = [
  { id: "todos",        label: "Todos" },
  { id: "aventura",     label: "Aventura y RPG" },
  { id: "carreras",     label: "Carreras" },
  { id: "shooters",     label: "Shooters" },
  { id: "multijugador", label: "Multijugador y party" },
  { id: "clasicos",     label: "Clásicos y retro" }
];

const CATALOG = {

  aventura: [
    "The Legend of Zelda: Tears of the Kingdom | Switch",
    "Elden Ring | PS5, Xbox, PC",
    "God of War Ragnarök | PS5, PS4",
    "The Witcher 3: Wild Hunt | PS5, Xbox, Switch",
    "Red Dead Redemption 2 | PS4, Xbox, PC",
    "Fallout 4 | PS4, PS5, Xbox, PC",
  ],

  carreras: [
    "Gran Turismo 7 | PS5, PS4",
    "Forza Horizon 5 | Xbox, PC",
    "Mario Kart 8 Deluxe | Switch",
    "Need for Speed Unbound | PS5, Xbox, PC",
    "F1 24 | PS5, Xbox, PC",
  ],

  shooters: [
    "Call of Duty: Modern Warfare III | PS5, Xbox, PC",
    "Halo Infinite | Xbox, PC",
    "DOOM Eternal | PS5, Xbox, Switch",
    "Apex Legends | PS5, Xbox, PC",
    "Battlefield 2042 | PS5, Xbox, PC",
  ],

  multijugador: [
    "Fortnite | PS5, Xbox, Switch",
    "Super Smash Bros. Ultimate | Switch",
    "Overcooked! 2 | PS4, Xbox, Switch",
    "EA Sports FC 25 | PS5, Xbox, PC",
    "Mario Party Superstars | Switch",
  ],

  clasicos: [
    "Super Mario Bros. | NES, Switch",
    "Sonic the Hedgehog | Mega Drive, Switch",
    "Street Fighter II | Arcade, SNES",
    "Crash Bandicoot | PS1, PS4",
    "Pac-Man | Arcade, Switch",
  ],

};
