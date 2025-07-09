import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], searchTerm: string, displayedColumns?: string[]): any[] {
    if (!items || !searchTerm) {
      return items;
    }

    searchTerm = searchTerm.toLowerCase();

    return items.filter(item => {
      if (displayedColumns && displayedColumns.length > 0) {
        // Solo busca en las columnas especificadas
        return displayedColumns.some(col => {
          const value = item[col]?.toString().toLowerCase() || '';
          return value.includes(searchTerm);
        });
      } else {
        // Busca en todos los valores del objeto
        return Object.values(item).some(val => {
          return val?.toString().toLowerCase().includes(searchTerm);
        });
      }
    });
  }
}
