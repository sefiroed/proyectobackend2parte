import { ProductsMemDAO } from './DAOs/memory';
import { ProductsFSDAO } from './DAOs/fs';
import { ProductsAtlasDAO } from './DAOs/mongo';

import path from 'path';
export enum TypePersistence {
  Memory = 'MEM',
  FileSystem = 'FS',
  MYSQL = 'MYSQL',
  SQLITE3 = 'SQLITE3',
  LocalMongo = 'LOCAL-MONGO',
  MongoAtlas = 'MONGO-ATLAS',
  Firebase = 'FIREBASE',
}

export class NewFactoryDAO {
  static get(type: TypePersistence) {
    switch (type) {
      case TypePersistence.FileSystem:
        console.log('RETURN INSTANCE CLASS FS');
        const filePath = path.resolve(__dirname, '../../../public/products.json');
        console.log(filePath);
        return new ProductsFSDAO(filePath);

      case TypePersistence.MongoAtlas:
        console.log('RETURN INSTANCE CLASS MONGO ATLAS');
        return new ProductsAtlasDAO();

      case TypePersistence.LocalMongo:
        console.log('RETURN INSTANCE CLASS MONGO LOCAL');
        return new ProductsAtlasDAO(true);

      // case TypePersistence.MYSQL:
      //   return new MYSQLProductDAO();  

      default:
        console.log('RETURN INSTANCE CLASS MEMORY');
        return new ProductsMemDAO();
    }
  }
}
