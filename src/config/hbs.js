import exphbs from 'express-handlebars';
import handlebarsHelpers from "handlebars-helpers";

const { eq } = handlebarsHelpers();

const hbs = exphbs.create({
  defaultLayout: 'main',  // Cambia esto si tienes un layout diferente
  extname: 'hbs', // Extensión correcta para las plantillas
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  helpers: {
    eq,
  },
});

export default hbs;
