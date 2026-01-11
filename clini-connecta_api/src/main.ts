import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );
  const config = new DocumentBuilder()
    .setTitle("CliniConnecta API")
    .setDescription(
      `
      Sistema di Gestione Sanitaria CliniConnecta

      API RESTful per la prenotazione e gestione di visite mediche.

       Funzionalità Principali
      - Gestione completa dei profili pazienti e medici
      - Sistema di prenotazione appuntamenti
      - Gestione referti e prescrizioni mediche
      - Autenticazione sicura con JWT
    `
    )
    .setVersion("1.0")
    .addTag("Auth", "Autenticazione e gestione utenti")
    .addTag("Pazienti", "Gestione profili pazienti")
    .addTag("Dottori", "Gestione profili medici")
    .addTag("Appuntamenti", "Prenotazione e gestione appuntamenti")
    .addTag("Report medici", "Referti medici")
    .addTag("Prescrizioni", "Prescrizioni mediche")
    .addTag("Specializzazioni", "Specializzazione dei medici")
    .addTag("Calendario medici", "Disponibilità medici")
    .addTag("Cliniche", "Gestione cliniche")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Inserisci il token JWT ottenuto dal login",
        in: "header",
      },
      "JWT-auth"
    )
    .build();

  //* docs API
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document,  {
  customCss: `
    .swagger-ui .info .markdown,
    .swagger-ui .info .renderedMarkdown,
    .swagger-ui .info pre,
    .swagger-ui .info code,
    .swagger-ui .info .description {
      font-size: 20px !important;
      color: #e8e8e8 !important;
      line-height: 1.7 !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      background: transparent !important;
      border: none !important;
      padding: 0 !important;
    }
    .swagger-ui .info h1 {
      font-size: 50px !important;
      margin-top: 15px !important;
    }
    .swagger-ui .info h2 {
      font-size: 20px !important;
      margin-top: 12px !important;
    }
  `,
}  );

  const port = process.env.PORT || 3000;
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger docs available at: http://localhost:${port}/api/docs`);
}

bootstrap();
