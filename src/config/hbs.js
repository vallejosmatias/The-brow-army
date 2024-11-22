import exphbs from 'express-handlebars';
import handlebarsHelpers from "handlebars-helpers";

const { eq } = handlebarsHelpers();

const hbs = exphbs.create({
  defaultLayout: 'main', // Cambia esto si tienes un layout diferente
  extname: 'hbs', // Extensión correcta para las plantillas
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  helpers: {
    eq,
    // Helper para determinar la moneda
    currency(precio) {
      return precio > 310 ? 'ARS' : 'USD';
    },
    isUSD(precio) {
      return precio <= 310; // Devuelve true si es USD
    },
  },
});

export default hbs;