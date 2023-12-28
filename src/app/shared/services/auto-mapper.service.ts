import { Injectable } from "@angular/core";
import { IMapper } from '../../models/IMapper.interface';

@Injectable({
  providedIn: 'root'
})
export class AutoMapperService {
  private mappers = new Map<string, IMapper<any, any>>();

  private getMapperKey<TInput, TOutput>(inputType: new (...args: any[]) => TInput, outputType: new (...args: any[]) => TOutput): string {
    return `${inputType.name}To${outputType.name}`;
  }

  registerMapper<TInput, TOutput>(inputType: new (...args: any[]) => TInput, outputType: new (...args: any[]) => TOutput, mapper: IMapper<TInput, TOutput>) {
    const key = this.getMapperKey(inputType, outputType);
    // console.log(key);
    this.mappers.set(key, mapper);
  }

  map<TInput, TOutput>(input: TInput | TInput[], outputType: new (...args: any[]) => TOutput): TOutput | TOutput[] {
    if (Array.isArray(input)) {
      // Process each element of the array
      return input.map(item => this.mapItem(item, outputType));
    } else {
      // Process a single item
      return this.mapItem(input as TInput, outputType);
    }
  }

  private mapItem<TInput, TOutput>(input: TInput, outputType: new (...args: any[]) => TOutput): TOutput {
    const key = this.getMapperKey(input.constructor as new (...args: any[]) => TInput, outputType);
    const mapper = this.mappers.get(key);
    if (!mapper) {
      throw new Error(`No mapper registered for ${key}`);
    }
    return mapper.map(input);
  }
}

