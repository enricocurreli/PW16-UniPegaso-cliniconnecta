import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeedService } from './seed.service';

async function bootstrap() {
  console.log('Avvio script di seeding CliniConnecta...\n');

  const app = await NestFactory.createApplicationContext(AppModule);

  const seeder = app.get(SeedService);

  try {
    await seeder.run();
  } catch (error) {
    console.error('\nErrore durante il seeding:', error);
    throw error;
  } finally {
    await app.close();
  }
}

bootstrap();
