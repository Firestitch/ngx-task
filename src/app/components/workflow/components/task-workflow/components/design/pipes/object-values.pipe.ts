import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectValues',
  standalone: true,
})
export class ObjectValuesPipe implements PipeTransform {
  public transform(value: any): any {
    return Object.values(value);
  }
}
