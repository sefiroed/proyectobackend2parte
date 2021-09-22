import mongoose from 'mongoose';
import {
  newProductCarI,
  ProductCarI,
  ProductCarBaseClass,
  ProductCarQuery,
} from '../productscar.interface';
import Config from '../../../config';

const productsSchema = new mongoose.Schema<ProductCarI>({
  name: String,
  description: String,
  codeproduct: Number,
  url: String,
  price: Number,
  stock: Number,
});

export class ProductsCarAtlasDAO implements ProductCarBaseClass {
  private srv: string;
  private products;

  constructor(local: boolean = false) {
    if (local)
      this.srv = `mongodb://localhost:27017/${Config.MONGO_LOCAL_DBNAME}`;
    else
      this.srv = `mongodb+srv://${Config.MONGO_ATLAS_USER}:${Config.MONGO_ATLAS_PASSWORD}@${Config.MONGO_ATLAS_CLUSTER}/${Config.MONGO_ATLAS_DBNAME}?retryWrites=true&w=majority`;
    mongoose.connect(this.srv);
    this.products = mongoose.model<ProductCarI>('productcar', productsSchema);
  }

  async get(id?: string): Promise<ProductCarI[]> {
    let output: ProductCarI[] = [];
    try {
      if (id) {
        const document = await this.products.findById(id);
        if (document) output.push(document);
      } else {
        output = await this.products.find();
      }

      return output;
    } catch (err) {
      return output;
    }
  }

  async add(data: newProductCarI): Promise<ProductCarI> {
    if (!data.name || !data.description || 
      !data.codeproduct || !data.url || 
      !data.price || !data.stock ) throw new Error('invalid data');

    const newProduct = new this.products(data);
    await newProduct.save();

    return newProduct;
  }

  async update(id: string, newProductData: newProductCarI): Promise<ProductCarI> {
    return this.products.findByIdAndUpdate(id, newProductData);
  }

  async delete(id: string) {
    await this.products.findByIdAndDelete(id);
  }

  async query(options: ProductCarQuery): Promise<ProductCarI[]> {
    let query: ProductCarQuery = {};

    if (options.name) query.name = options.name;

    if (options.description) query.description = options.description;

    if (options.codeproduct) query.codeproduct = options.codeproduct;

    if (options.url) query.url = options.url;

    if (options.price) query.price = options.price;

    if (options.stock) query.stock = options.stock;

    return this.products.find(query);
  }
}
