import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], searchTerm: string, displayedColumns: string[]): any[] {
    if (!items || !searchTerm || !displayedColumns) {
      return items;
    }

    searchTerm = searchTerm.toLowerCase();

    return items.filter(item => {
      return displayedColumns.some(col => {
        const value = item[col]?.toString().toLowerCase() || '';
        return value.includes(searchTerm);
      });
    });
  }
}
